import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS for order lookup
    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            title,
            image_url,
            price
          )
        )
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      console.error('Order number searched:', orderNumber);
      return NextResponse.json(
        { error: 'Order not found', details: error.message },
        { status: 404 }
      );
    }

    if (!order) {
      console.error('Order not found for order number:', orderNumber);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

