import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendShippingConfirmationEmail } from '@/lib/email';
import { registerShipmentTracking } from '@/lib/shipping';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          quantity,
          products (
            title
          )
        )
      `
      )
      .eq('id', id)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = orderData.status as OrderStatus;
    const isBecomingShipped = status === 'shipped' && previousStatus !== 'shipped';

    const storedTracking = (orderData.tracking_number as string | null)?.trim() || '';
    let trackingFromBody = '';
    if ('tracking_number' in body) {
      const raw = body.tracking_number;
      trackingFromBody = typeof raw === 'string' ? raw.trim() : '';
    }
    const mergedTracking = trackingFromBody || storedTracking;

    if (isBecomingShipped && !mergedTracking) {
      return NextResponse.json(
        {
          error:
            'A tracking number is required when marking an order as shipped. Enter it above, then try again.',
        },
        { status: 400 }
      );
    }

    const updatePayload: { status: OrderStatus; tracking_number?: string | null } = { status };
    if ('tracking_number' in body) {
      const raw = body.tracking_number;
      updatePayload.tracking_number =
        typeof raw === 'string' && raw.trim() ? raw.trim() : null;
    }

    const { error } = await supabase.from('orders').update(updatePayload).eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    const shouldSendShippedEmail = status === 'shipped' && previousStatus !== 'shipped';

    if (shouldSendShippedEmail) {
      try {
        await registerShipmentTracking({ orderId: id, trackingNumber: mergedTracking });
      } catch (trackingError) {
        console.error('Error registering Shippo tracking:', trackingError);
      }

      try {
        const order = orderData as any;
        const emailItems = (order.order_items || []).map((item: any) => ({
          productTitle: item.products?.title || 'Product',
          quantity: item.quantity,
        }));

        await sendShippingConfirmationEmail({
          orderNumber: order.order_number,
          customerName:
            `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() || 'Customer',
          customerEmail: order.customer_email,
          trackingNumber: mergedTracking,
          carrier: undefined,
          estimatedDelivery: undefined,
          items: emailItems,
        });
      } catch (emailError) {
        console.error('Error sending shipping confirmation email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in status update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
