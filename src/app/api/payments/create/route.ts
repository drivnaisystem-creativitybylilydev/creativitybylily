import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import type { CreatePaymentRequest, Money } from 'square';

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

    // Initialize Square client inside the function to avoid build-time issues
    console.log('Initializing Square client...');
    const squareClient = new Client({
      environment: (process.env.SQUARE_ENV as Environment) || Environment.Production,
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
    });
    console.log('Square client initialized successfully');

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
    // Convert amount to Money object (Square expects amount in smallest currency unit, e.g., cents)
    const amountInCents = Math.round(amount * 100);
    const amountMoney: Money = {
      amount: BigInt(amountInCents), // Convert dollars to cents as bigint (required by Square SDK)
      currency,
    };

    // Create payment request
    const paymentRequest: CreatePaymentRequest = {
      sourceId, // The card token from Square Web Payments SDK
      idempotencyKey, // Unique key to prevent duplicate payments
      amountMoney,
      locationId: process.env.SQUARE_LOCATION_ID,
    };

    // Log payment request details (safe - no secrets)
    console.log('📤 Sending to Square API:');
    console.log('  Amount in cents:', amountInCents);
    console.log('  Currency:', currency);
    console.log('  Location ID:', process.env.SQUARE_LOCATION_ID);
    console.log('  Source ID (first 20 chars):', sourceId.substring(0, 20) + '...');

    // Create payment using Square API
    console.log('⏳ Calling Square paymentsApi.createPayment...');
    const { result, statusCode } = await squareClient.paymentsApi.createPayment(paymentRequest);
    console.log('✅ Square API Response Status:', statusCode);

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
    console.log('  Amount:', result.payment.totalMoney);
    
    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.totalMoney,
      },
    });
  } catch (error: any) {
    // Enhanced error logging for Square API errors
    console.error('❌ Payment processing exception caught:');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    
    // Square SDK errors have a specific structure
    if (error?.result) {
      console.error('Square API Response:');
      console.error('  Status Code:', error.statusCode);
      console.error('  Errors:', JSON.stringify(error.result.errors, null, 2));
    } else if (error?.errors) {
      console.error('Square Errors Array:', JSON.stringify(error.errors, null, 2));
    } else {
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    
    // Extract Square's actual error message if available
    let errorMessage = 'Payment processing failed';
    let errorDetails = null;
    
    if (error?.result?.errors && error.result.errors.length > 0) {
      // Square API returned structured errors
      errorMessage = error.result.errors[0].detail || errorMessage;
      errorDetails = error.result.errors;
    } else if (error?.errors && error.errors.length > 0) {
      // Alternative Square error format
      errorMessage = error.errors[0].detail || error.errors[0].message || errorMessage;
      errorDetails = error.errors;
    } else if (error?.message) {
      // Generic error message
      errorMessage = error.message;
    }
    
    // Return detailed error response
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        category: error?.result?.errors?.[0]?.category || 'PAYMENT_ERROR',
        code: error?.result?.errors?.[0]?.code || 'UNKNOWN',
      },
      { status: error?.statusCode || 500 }
    );
  }
}
