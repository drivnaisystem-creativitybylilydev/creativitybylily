import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  addressToCsvRow,
  rowsToCsv,
  type ShippingAddressInput,
} from '@/lib/formatShippingForRollo';

/**
 * GET /api/admin/orders/export-addresses?statuses=pending,processing
 * CSV of shipping addresses for Fulfillment / Rollo-style workflows (no Shippo).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('statuses');
    const statuses =
      raw
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [];
    const useStatuses = statuses.length > 0 ? statuses : ['pending', 'processing'];

    const supabase = createAdminClient();
    const { data: orders, error } = await supabase
      .from('orders')
      .select('order_number, customer_email, customer_phone, shipping_address, status, created_at')
      .in('status', useStatuses)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = [];
    for (const o of orders || []) {
      const addr = o.shipping_address as ShippingAddressInput;
      const row = addressToCsvRow(
        o.order_number,
        o.customer_email || '',
        addr,
        o.customer_phone
      );
      if (row) rows.push(row);
    }

    const csv = rowsToCsv(rows);
    const day = new Date().toISOString().slice(0, 10);
    const filename = `open-orders-addresses-${day}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Export failed' }, { status: 500 });
  }
}
