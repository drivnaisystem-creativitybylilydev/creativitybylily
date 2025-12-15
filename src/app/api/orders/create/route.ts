import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
// Email functionality temporarily disabled - will re-enable at launch
// import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format', details: parseError?.message },
        { status: 400 }
      );
    }

    const {
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      tax,
      shippingCost = 0,
      total,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: 'Shipping and billing addresses are required' },
        { status: 400 }
      );
    }

    // Create admin client (bypasses RLS)
    let supabase;
    try {
      supabase = createAdminClient();
    } catch (error: any) {
      console.error('Failed to create Supabase admin client:', error?.message);
      return NextResponse.json(
        { error: 'Server configuration error', details: error?.message },
        { status: 500 }
      );
    }

    // Generate order number (fallback if RPC fails)
    let orderNumber: string;
    try {
      const { data: orderNumberData, error: orderNumberError } = await supabase.rpc('generate_order_number');
      
      if (orderNumberError || !orderNumberData) {
        throw new Error('RPC failed');
      }
      
      orderNumber = orderNumberData;
    } catch (error) {
      // Fallback order number generation
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      orderNumber = `CBY-${date}-${random}`;
    }

    // Extract customer info from shipping address for easy querying
    const customerEmail = shippingAddress.email;
    const customerFirstName = shippingAddress.firstName;
    const customerLastName = shippingAddress.lastName;
    const customerPhone = shippingAddress.phone;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        tax,
        shipping: shippingCost,
        total,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        customer_email: customerEmail,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_phone: customerPhone,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      console.error('Order data attempted:', {
        order_number: orderNumber,
        subtotal,
        tax,
        shipping: shippingCost,
        total,
      });
      return NextResponse.json(
        { 
          error: 'Failed to create order',
          details: process.env.NODE_ENV === 'development' ? orderError.message : undefined
        },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      console.error('Order items attempted:', orderItems);
      return NextResponse.json(
        { 
          error: 'Failed to create order items',
          details: process.env.NODE_ENV === 'development' ? itemsError.message : undefined
        },
        { status: 500 }
      );
    }

    // Email functionality temporarily disabled - will re-enable at launch
    // Order confirmation emails will be added back when ready

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

