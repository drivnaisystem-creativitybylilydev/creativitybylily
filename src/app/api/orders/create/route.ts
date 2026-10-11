import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email';
import { resolveVariantName } from '@/lib/orders/resolveVariantName';
import { getSiteSettings } from '@/lib/site-settings';
import { computeOrderTotals, CheckoutPricingError } from '@/lib/checkout-pricing';
import { sendCheckoutAlert } from '@/lib/checkout-alerts';

async function handleOrder(request: Request) {
  try {
    const settings = await getSiteSettings();
    if (settings.store_paused) {
      return NextResponse.json(
        { error: 'The shop is temporarily closed and not accepting new orders right now.' },
        { status: 503 }
      );
    }

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

    // Prices come from the database, and the order is only created for a payment Square confirms.
    if (!paymentId || typeof paymentId !== 'string') {
      return NextResponse.json({ error: 'Payment is required' }, { status: 400 });
    }
    let totals;
    try {
      totals = await computeOrderTotals(items);
    } catch (e) {
      if (e instanceof CheckoutPricingError) {
        return NextResponse.json(
          { error: e.message, details: e.details, message: e.details ? 'Some items in your cart are no longer available in the requested quantity. Please update your cart and try again.' : undefined },
          { status: e.status }
        );
      }
      throw e;
    }
    const { subtotal, tax, shipping: shippingCost, total } = totals;

    const squareBase = process.env.SQUARE_ENV === 'sandbox'
      ? 'https://connect.squareupsandbox.com'
      : 'https://connect.squareup.com';
    const paymentRes = await fetch(`${squareBase}/v2/payments/${encodeURIComponent(paymentId)}`, {
      headers: {
        'Square-Version': '2024-12-18',
        Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      },
    });
    const paymentJson = await paymentRes.json().catch(() => null);
    const squarePayment = paymentJson?.payment;
    if (squarePayment) {
      if (
        !['COMPLETED', 'APPROVED'].includes(squarePayment.status) ||
        squarePayment.amount_money?.amount !== totals.totalCents
      ) {
        console.error('Payment verification failed:', { paymentId, status: squarePayment.status, expected: totals.totalCents, got: squarePayment.amount_money?.amount });
        return NextResponse.json(
          { error: 'We could not confirm your payment for this order. If you were charged, please contact us.' },
          { status: 402 }
        );
      }
    } else if (paymentRes.status === 404) {
      console.error('Payment verification failed: unknown payment id', paymentId);
      return NextResponse.json(
        { error: 'We could not confirm your payment for this order. If you were charged, please contact us.' },
        { status: 402 }
      );
    } else {
      // Square itself couldn't be reached or didn't answer. The customer has already paid, so don't
      // lose their order over it; flag loudly so it can be checked by hand.
      console.error('PAYMENT VERIFICATION UNAVAILABLE, order accepted unverified:', { paymentId, status: paymentRes.status });
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

    // One payment can only ever back one order
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_id', paymentId)
      .limit(1)
      .maybeSingle();
    if (existingOrder) {
      return NextResponse.json({ error: 'This payment has already been used for an order' }, { status: 409 });
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

    // Extract customer info from shipping address for easy querying (normalize email for matching)
    const customerEmail = typeof shippingAddress.email === 'string'
      ? shippingAddress.email.trim().toLowerCase()
      : shippingAddress.email;
    const customerFirstName = shippingAddress.firstName;
    const customerLastName = shippingAddress.lastName;
    const customerPhone = shippingAddress.phone;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null, // Link to user account if logged in
        order_number: orderNumber,
        status: paymentId ? 'processing' : 'pending', // Mark as processing if payment succeeded
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
    const orderItems = totals.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: item.unitPrice,
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

    // Send order confirmation email
    try {
      // Fetch order items with product details for email
      const { data: orderItemsWithProducts } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          variant_id,
          products (
            id,
            title,
            image_url,
            variants
          )
        `)
        .eq('order_id', order.id);

      if (orderItemsWithProducts) {
        const emailItems = orderItemsWithProducts.map((item: any) => {
          const variantName = resolveVariantName(item.products?.variants, item.variant_id);
          return {
            productId: item.products.id,
            productTitle: item.products.title,
            productImage: item.products.image_url,
            variantName,
            quantity: item.quantity,
            price: item.price,
          };
        });

        const shippingAddr = {
          firstName: customerFirstName,
          lastName: customerLastName,
          address: shippingAddress.address,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country || 'US',
        };

        await sendOrderConfirmationEmail({
          orderNumber: order.order_number,
          customerName: `${customerFirstName} ${customerLastName}`,
          customerEmail: customerEmail,
          items: emailItems,
          subtotal,
          tax,
          shipping: shippingCost,
          total,
          shippingAddress: shippingAddr,
        });

        const adminLineItems = emailItems.map((row) => ({
          productTitle: row.productTitle,
          productImage: row.productImage,
          quantity: row.quantity,
          price: row.price,
          variantName: row.variantName,
        }));

        await sendAdminNewOrderNotification({
          orderId: order.id,
          orderNumber: order.order_number,
          customerName: `${customerFirstName} ${customerLastName}`,
          customerEmail: customerEmail,
          customerPhone: customerPhone || null,
          items: adminLineItems,
          subtotal,
          tax,
          shipping: shippingCost,
          total,
          shippingAddress: shippingAddr,
          paymentId: paymentId || null,
        }).catch((err) => console.error('Admin new-order notification failed:', err));
      }
    } catch (emailError) {
      // Don't fail the order if email fails, just log it
      console.error('Error sending order confirmation email:', emailError);
    }

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


export async function POST(request: Request) {
  const paymentId = await request.clone().json().then((b) => b?.paymentId).catch(() => undefined);
  const response = await handleOrder(request);
  try {
    const body = await response.clone().json().catch(() => null);
    if (response.ok && body?.success) {
      await sendCheckoutAlert({
        level: 'success',
        stage: 'order',
        summary: `order ${body.orderNumber} created`,
        details: { orderNumber: body.orderNumber, paymentId },
      });
    } else if (!response.ok && paymentId && response.status !== 503) {
      // A payment exists but no order was saved: the customer may have been charged for nothing.
      await sendCheckoutAlert({
        level: 'critical',
        stage: 'order',
        summary: 'PAID BUT NO ORDER, check Square and refund or fix by hand',
        details: { httpStatus: response.status, error: body?.error, paymentId },
      });
    }
  } catch {
    // alerting must never affect the customer's checkout
  }
  return response;
}
