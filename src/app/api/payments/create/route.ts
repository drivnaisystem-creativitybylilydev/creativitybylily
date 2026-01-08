import { NextResponse } from 'next/server';
import type { CreatePaymentRequest, Money } from 'square';

export async function POST(request: Request) {
  try {
    console.log('=== Payment API Called ===');
    console.log('SQUARE_ACCESS_TOKEN exists:', !!process.env.SQUARE_ACCESS_TOKEN);
    console.log('SQUARE_LOCATION_ID exists:', !!process.env.SQUARE_LOCATION_ID);
    console.log('SQUARE_ENVIRONMENT:', process.env.SQUARE_ENVIRONMENT);
    
    // Verify environment variables are set
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      console.error('Square credentials not configured');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    console.log('Initializing Square client...');
    // Initialize Square client inside the function to avoid build-time issues
    const { SquareClient, SquareEnvironment } = require('square');
    const environment = process.env.SQUARE_ENVIRONMENT === 'sandbox' 
      ? SquareEnvironment.Sandbox 
      : SquareEnvironment.Production;
    
    const squareClient = new SquareClient({
      environment: environment,
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
    });
    console.log('Square client initialized successfully');

    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body:', { ...body, sourceId: body.sourceId ? 'EXISTS' : 'MISSING' });
    const { sourceId, idempotencyKey, amount, currency = 'USD' } = body;

    // Validate required fields
    if (!sourceId || !idempotencyKey || !amount) {
      console.error('Missing required fields:', { sourceId: !!sourceId, idempotencyKey: !!idempotencyKey, amount: !!amount });
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    console.log('All fields validated, preparing payment...');
    // Convert amount to Money object (Square expects amount in smallest currency unit, e.g., cents)
    // Square SDK v43+ requires bigint for amount
    const amountMoney: Money = {
      amount: BigInt(Math.round(amount * 100)), // Convert dollars to cents as bigint
      currency,
    };

    // Create payment request
    const paymentRequest: CreatePaymentRequest = {
      sourceId, // The card token from Square Web Payments SDK
      idempotencyKey, // Unique key to prevent duplicate payments
      amountMoney,
      locationId: process.env.SQUARE_LOCATION_ID,
    };

    console.log('Calling Square API...');
    // Create payment using Square API (use .payments not .paymentsApi)
    const response = await squareClient.payments.create(paymentRequest);
    console.log('Square API responded:', response);
    
    const { result } = response;

    if (!result || !result.payment) {
      console.error('Square payment failed:', result);
      return NextResponse.json(
        { 
          error: result?.errors?.[0]?.detail || 'Payment processing failed',
          details: result?.errors,
        },
        { status: 500 }
      );
    }

    // Payment successful
    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: result.payment.totalMoney,
      },
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { 
        error: 'Payment processing failed',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

