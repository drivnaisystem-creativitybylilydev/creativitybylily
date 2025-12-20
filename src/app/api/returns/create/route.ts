import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { sendReturnRequestReceivedEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    console.log('=== Return Creation Request ===');
    const body = await request.json();
    console.log('Request body:', { orderId: body.orderId, returnItemsCount: body.returnItems?.length });
    const { orderId, returnItems, reason, refundAmount } = body;

    // Validate required fields
    if (!orderId || !returnItems || !Array.isArray(returnItems) || returnItems.length === 0) {
      console.error('Validation failed:', { orderId, returnItems });
      return NextResponse.json(
        { error: 'Order ID and return items are required' },
        { status: 400 }
      );
    }

    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    console.log('Auth header present:', !!authHeader);
    console.log('Access token present:', !!accessToken);

    if (!accessToken) {
      console.error('No access token in request');
      return NextResponse.json(
        { error: 'Unauthorized - No access token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token', details: userError?.message },
        { status: 401 }
      );
    }

    console.log('User authenticated:', { email: user.email, id: user.id });

    // Verify order belongs to user (use admin client to bypass RLS)
    const adminSupabase = createAdminClient();
    console.log('Looking up order:', { orderId, userId: user.id });
    
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            title
          )
        )
      `)
      .eq('id', orderId)
      .single();

    console.log('Order lookup result:', { 
      found: !!order, 
      orderUserId: order?.user_id, 
      requestUserId: user.id,
      match: order?.user_id === user.id,
      error: orderError?.message 
    });

    if (orderError) {
      console.error('Order lookup error:', orderError);
      return NextResponse.json(
        { error: 'Order not found', details: orderError.message },
        { status: 404 }
      );
    }

    if (!order) {
      console.error('Order not found');
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order belongs to user (allow if user_id matches OR if order has no user_id for guest orders)
    if (order.user_id && order.user_id !== user.id) {
      console.error('Order access denied:', { orderUserId: order.user_id, requestUserId: user.id });
      return NextResponse.json(
        { error: 'Order access denied - This order belongs to another user' },
        { status: 403 }
      );
    }

    // Get return address from order shipping address
    const returnAddress = order.shipping_address;

    // Generate return number
    let returnNumber: string;
    try {
      const { data: returnNumberData, error: returnNumberError } = await adminSupabase.rpc('generate_return_number');
      
      if (returnNumberError || !returnNumberData) {
        throw new Error('RPC failed');
      }
      
      returnNumber = returnNumberData;
    } catch (error) {
      // Fallback return number generation
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      returnNumber = `RET-${date}-${random}`;
    }

    // Create return request
    const returnData = {
      return_number: returnNumber,
      order_id: orderId,
      user_id: user.id,
      status: 'pending',
      reason: reason || null,
      return_items: returnItems,
      refund_amount: refundAmount,
      return_address: returnAddress,
      return_shipping_cost: 0, // User pays, so 0 for now
    };

    console.log('Inserting return:', { returnNumber, orderId, userId: user.id, refundAmount });

    const { data: returnRequest, error: returnError } = await adminSupabase
      .from('returns')
      .insert(returnData)
      .select()
      .single();

    if (returnError) {
      console.error('Error creating return:', returnError);
      console.error('Return data attempted:', returnData);
      return NextResponse.json(
        { error: 'Failed to create return request', details: returnError.message, code: returnError.code },
        { status: 500 }
      );
    }

    console.log('Return created successfully:', { id: returnRequest.id, returnNumber: returnRequest.return_number });

    // Send email notification to customer
    try {
      const returnItemsArray = Array.isArray(returnItems) ? returnItems : [];
      const emailItems = returnItemsArray.map((item: any) => {
        // Find product title from order items
        const orderItem = (order as any).order_items?.find((oi: any) => oi.id === item.order_item_id);
        return {
          productTitle: orderItem?.products?.title || 'Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
        };
      });

      await sendReturnRequestReceivedEmail({
        returnNumber: returnRequest.return_number,
        customerName: (order as any).customer_first_name || 'Customer',
        customerEmail: (order as any).customer_email,
        orderNumber: (order as any).order_number,
        refundAmount: refundAmount,
        items: emailItems,
      });
    } catch (emailError) {
      console.error('Error sending return email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      returnId: returnRequest.id,
      returnNumber: returnRequest.return_number,
    });
  } catch (error: any) {
    console.error('Return creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


