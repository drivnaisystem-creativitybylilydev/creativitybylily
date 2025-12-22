import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendShippingConfirmationEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get order details before updating (for email)
    const { data: orderData } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          products (
            title
          )
        )
      `)
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // Send shipping confirmation email when status is set to 'shipped'
    if (status === 'shipped' && orderData) {
      try {
        const order = orderData as any;
        const trackingNumber = order.tracking_number || '';
        
        const emailItems = (order.order_items || []).map((item: any) => ({
          productTitle: item.products?.title || 'Product',
          quantity: item.quantity,
        }));

        await sendShippingConfirmationEmail({
          orderNumber: order.order_number,
          customerName: `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim() || 'Customer',
          customerEmail: order.customer_email,
          trackingNumber: trackingNumber,
          carrier: undefined, // Can be added later if stored
          estimatedDelivery: undefined, // Can be added later if calculated
          items: emailItems,
        });
      } catch (emailError) {
        // Don't fail the status update if email fails, just log it
        console.error('Error sending shipping confirmation email:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in status update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








