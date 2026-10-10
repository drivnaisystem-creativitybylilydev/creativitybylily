import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';
import { computeOrderTotals, CheckoutPricingError } from '@/lib/checkout-pricing';

export async function POST(request: Request) {
  try {
    console.log('=== Payment API Called ===');

    const settings = await getSiteSettings();
    if (settings.store_paused) {
      return NextResponse.json(
        { error: 'The shop is temporarily closed and not accepting new orders right now.' },
        { status: 503 }
      );
    }

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

    console.log('Parsing request body...');
    const body = await request.json();
    const { sourceId, idempotencyKey, amount, items } = body;
    const currency = 'USD';

    // Log incoming payment request (safe - no card details)
    console.log('💳 Payment Request Received:');
    console.log('  Source ID:', sourceId?.substring(0, 20) + '...');
    console.log('  Idempotency Key:', idempotencyKey);
    console.log('  Amount (dollars):', amount);
    console.log('  Currency:', currency);

    // Validate required fields
    if (!sourceId || !idempotencyKey) {
      console.error('❌ Missing required fields:', { 
        hasSourceId: !!sourceId, 
        hasIdempotencyKey: !!idempotencyKey, 
      });
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // The charge is priced from the database, never from the browser. `amount` is only the total the
    // shopper was shown, used to catch a stale cart before we take their money.
    const totals = await computeOrderTotals(items);
    if (typeof amount !== 'number' || Math.abs(amount - totals.total) > 0.01) {
      console.error('❌ Total mismatch:', { shown: amount, server: totals.total });
      return NextResponse.json(
        { error: 'Prices have changed since you loaded this page. Please refresh your cart and try again.' },
        { status: 409 }
      );
    }

    console.log('All fields validated, preparing payment...');
    const amountInCents = totals.totalCents;

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
    if (error instanceof CheckoutPricingError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status }
      );
    }
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
