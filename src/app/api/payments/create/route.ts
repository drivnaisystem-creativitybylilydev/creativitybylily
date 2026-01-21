import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('=== Payment API Called ===');
    
    // Verify environment variables are set
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      console.error('❌ Square credentials not configured');
      console.error('SQUARE_ACCESS_TOKEN present:', !!process.env.SQUARE_ACCESS_TOKEN);
      console.error('SQUARE_LOCATION_ID present:', !!process.env.SQUARE_LOCATION_ID);
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    // Log environment configuration (safe - no secrets)
    console.log('🔧 Square Environment Config:');
    console.log('  Environment:', process.env.SQUARE_ENV || 'production (default)');
    console.log('  Location ID:', process.env.SQUARE_LOCATION_ID);
    console.log('  Access Token present:', !!process.env.SQUARE_ACCESS_TOKEN);
    console.log('  Access Token prefix:', process.env.SQUARE_ACCESS_TOKEN?.substring(0, 8) + '...');

    console.log('Parsing request body...');
    const body = await request.json();
    const { sourceId, idempotencyKey, amount, currency = 'USD' } = body;

    // Log incoming payment request (safe - no card details)
    console.log('💳 Payment Request Received:');
    console.log('  Source ID:', sourceId?.substring(0, 20) + '...');
    console.log('  Idempotency Key:', idempotencyKey);
    console.log('  Amount (dollars):', amount);
    console.log('  Currency:', currency);

    // Validate required fields
    if (!sourceId || !idempotencyKey || !amount) {
      console.error('❌ Missing required fields:', { 
        hasSourceId: !!sourceId, 
        hasIdempotencyKey: !!idempotencyKey, 
        hasAmount: !!amount 
      });
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    console.log('All fields validated, preparing payment...');
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Log payment request details (safe - no secrets)
    console.log('📤 Preparing Square API request:');
    console.log('  Amount in cents:', amountInCents);
    console.log('  Currency:', currency);
    console.log('  Location ID:', process.env.SQUARE_LOCATION_ID);

    // Use fetch directly to call Square API (bypassing SDK issues)
    const squareApiUrl = process.env.SQUARE_ENV === 'sandbox' 
      ? 'https://connect.squareupsandbox.com/v2/payments'
      : 'https://connect.squareup.com/v2/payments';

    console.log('⏳ Calling Square API directly via fetch...');
    console.log('  URL:', squareApiUrl);

    const squareResponse = await fetch(squareApiUrl, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-12-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: amountInCents,
          currency: currency,
        },
        location_id: process.env.SQUARE_LOCATION_ID,
      }),
    });

    const statusCode = squareResponse.status;
    console.log('✅ Square API Response Status:', statusCode);

    const result = await squareResponse.json();
    console.log('Square API Result:', JSON.stringify(result, null, 2));

    if (statusCode !== 200 || !result.payment) {
      console.error('❌ Square payment failed!');
      console.error('Status Code:', statusCode);
      console.error('Result:', JSON.stringify(result, null, 2));
      console.error('Errors:', JSON.stringify(result.errors, null, 2));
      return NextResponse.json(
        { 
          error: result.errors?.[0]?.detail || 'Payment processing failed',
          details: result.errors,
          category: result.errors?.[0]?.category,
          code: result.errors?.[0]?.code,
        },
        { status: statusCode || 500 }
      );
    }

    // Payment successful
    console.log('✅ Payment successful!');
    console.log('  Payment ID:', result.payment.id);
    console.log('  Status:', result.payment.status);
    console.log('  Amount:', result.payment.total_money);
    
    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.total_money,
      },
    });
  } catch (error: any) {
    // Enhanced error logging
    console.error('❌ Payment processing exception caught:');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    
    // Extract error message
    let errorMessage = 'Payment processing failed';
    
    if (error?.message) {
      errorMessage = error.message;
    }
    
    // Return detailed error response
    return NextResponse.json(
      { 
        error: errorMessage,
        category: 'PAYMENT_ERROR',
        code: 'UNKNOWN',
      },
      { status: 500 }
    );
  }
}
