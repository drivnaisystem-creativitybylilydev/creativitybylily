import { Shippo } from 'shippo';
import { createAdminClient } from '@/lib/supabase/server';
import { sendDeliveryConfirmationEmail } from '@/lib/email';
import { normalizeCarrier } from '@/lib/carriers';

/** Returns null (instead of throwing) when SHIPPO_API_KEY isn't configured, so callers can no-op gracefully. */
export function getShippoClient(): Shippo | null {
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) return null;
  return new Shippo({ apiKeyHeader: apiKey });
}

/**
 * Upserts a `shipments` row with the current tracking number/carrier so tracking_number/carrier
 * are populated for Rollo-only orders that never went through generate-label. Pure DB write, safe
 * to call any time tracking info is saved (whether or not the order is becoming shipped).
 */
export async function upsertShipmentRecord({
  orderId,
  trackingNumber,
  carrier,
}: {
  orderId: string;
  trackingNumber: string;
  carrier: string;
}) {
  const supabase = createAdminClient();
  const normalizedCarrier = normalizeCarrier(carrier);

  const { data: existingShipment } = await supabase
    .from('shipments')
    .select('id')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingShipment) {
    await supabase
      .from('shipments')
      .update({ tracking_number: trackingNumber, carrier: normalizedCarrier })
      .eq('id', existingShipment.id);
  } else {
    await supabase.from('shipments').insert({
      order_id: orderId,
      tracking_number: trackingNumber,
      carrier: normalizedCarrier,
      status: 'pending',
    });
  }
}

/**
 * Registers a tracking number with Shippo (free, works for any carrier's number even if the
 * label wasn't purchased through Shippo). Called on the ship transition.
 */
export async function registerTrackingWithShippo({
  trackingNumber,
  carrier,
}: {
  trackingNumber: string;
  carrier: string;
}) {
  const shippo = getShippoClient();
  if (!shippo) {
    console.warn('Shippo tracking registration skipped: SHIPPO_API_KEY not configured');
    return;
  }

  try {
    await shippo.trackingStatus.create({ carrier: normalizeCarrier(carrier), trackingNumber });
  } catch (err) {
    // Non-fatal: the order still ships fine, just without live tracking updates.
    console.error('Error registering Shippo tracking webhook:', err);
  }
}

/**
 * Persists the latest tracking status onto `shipments` and, on a DELIVERED status for an order
 * that isn't already delivered, flips the order and sends the delivery email. Shared by both the
 * Shippo webhook route and the daily reconciliation cron so the transition logic lives in one place.
 */
export async function applyTrackingStatusUpdate({
  trackingNumber,
  status,
  statusDetails,
}: {
  trackingNumber: string;
  status: string;
  statusDetails?: string | null;
}): Promise<{ updated: boolean; delivered: boolean }> {
  const supabase = createAdminClient();

  const { data: shipment } = await supabase
    .from('shipments')
    .select('id, order_id, carrier')
    .eq('tracking_number', trackingNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!shipment) {
    console.warn('No shipment found for tracking number:', trackingNumber);
    return { updated: false, delivered: false };
  }

  await supabase
    .from('shipments')
    .update({ tracking_status: status, tracking_status_details: statusDetails ?? null })
    .eq('id', shipment.id);

  if (status !== 'DELIVERED') {
    return { updated: true, delivered: false };
  }

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        quantity,
        products ( title )
      )
    `
    )
    .eq('id', shipment.order_id)
    .single();

  if (!order || order.status === 'delivered') {
    return { updated: true, delivered: false };
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'delivered', delivered_at: new Date().toISOString() })
    .eq('id', order.id);

  if (updateError) {
    console.error('Error marking order delivered:', updateError);
    return { updated: true, delivered: false };
  }

  try {
    const emailItems = (order.order_items || []).map((item: any) => ({
      productTitle: item.products?.title || 'Product',
      quantity: item.quantity,
    }));

    await sendDeliveryConfirmationEmail({
      orderNumber: order.order_number,
      customerName:
        `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() || 'Customer',
      customerEmail: order.customer_email,
      trackingNumber,
      carrier: shipment.carrier ?? undefined,
      items: emailItems,
    });
  } catch (emailError) {
    console.error('Error sending delivery confirmation email:', emailError);
  }

  return { updated: true, delivered: true };
}

/**
 * Daily backstop: re-checks Shippo directly for any order stuck on "shipped" for more than a day,
 * in case its webhook notification was dropped. Applies the same transition logic as the webhook.
 */
export async function reconcileShippedOrders({ olderThanHours = 24 }: { olderThanHours?: number } = {}) {
  const shippo = getShippoClient();
  if (!shippo) {
    console.warn('Reconciliation skipped: SHIPPO_API_KEY not configured');
    return { checked: 0, delivered: 0 };
  }

  const supabase = createAdminClient();
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString();

  const { data: shipments } = await supabase
    .from('shipments')
    .select('id, order_id, tracking_number, carrier, orders!inner(status, updated_at)')
    .not('tracking_number', 'is', null)
    .eq('orders.status', 'shipped')
    .lte('orders.updated_at', cutoff);

  let checked = 0;
  let delivered = 0;

  for (const shipment of shipments || []) {
    if (!shipment.tracking_number) continue;
    checked += 1;
    try {
      const track = await shippo.trackingStatus.get(shipment.tracking_number, normalizeCarrier(shipment.carrier));
      const status = track.trackingStatus?.status;
      if (!status) continue;

      const result = await applyTrackingStatusUpdate({
        trackingNumber: shipment.tracking_number,
        status,
        statusDetails: track.trackingStatus?.statusDetails ?? null,
      });
      if (result.delivered) delivered += 1;
    } catch (err) {
      console.error(`Error reconciling tracking for order ${shipment.order_id}:`, err);
    }
  }

  return { checked, delivered };
}
