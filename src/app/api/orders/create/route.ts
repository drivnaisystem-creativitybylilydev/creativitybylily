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
      userId,
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      tax,
      shippingCost = 0,
      total,
      paymentId, // Square payment ID
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

    // Validate inventory before creating order
    const productIds = items.map((item: any) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, inventory_count, title')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products for inventory check:', productsError);
      return NextResponse.json(
        { error: 'Failed to validate inventory', details: productsError.message },
        { status: 500 }
      );
    }

    // Check inventory for each item
    const inventoryErrors: string[] = [];
    for (const item of items) {
      const product = products?.find((p) => p.id === item.productId);
      if (!product) {
        inventoryErrors.push(`Product not found: ${item.productId}`);
        continue;
      }

      const availableInventory = product.inventory_count || 0;
      if (availableInventory < item.quantity) {
        inventoryErrors.push(
          `${product.title}: Only ${availableInventory} available, but ${item.quantity} requested`
        );
      }
    }

    if (inventoryErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Insufficient inventory',
          details: inventoryErrors,
          message: 'Some items in your cart are no longer available in the requested quantity. Please update your cart and try again.'
        },
        { status: 400 }
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
        user_id: userId || null, // Link to user account if logged in
        order_number: orderNumber,
        status: paymentId ? 'paid' : 'pending', // Mark as paid if payment ID exists
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
        payment_id: paymentId || null, // Store Square payment ID
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

    // Decrease inventory for each product
    for (const item of items) {
      const product = products?.find((p) => p.id === item.productId);
      if (product) {
        const newInventory = Math.max(0, (product.inventory_count || 0) - item.quantity);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ inventory_count: newInventory })
          .eq('id', item.productId);

        if (updateError) {
          console.error(`Error updating inventory for product ${item.productId}:`, updateError);
          // Don't fail the order if inventory update fails, but log it
          // The order was already created, so we'll just log the error
        }
      }
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

