import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import type { CreatePaymentRequest, Money } from 'square';

// Initialize Square client
const squareClient = new Client({
  environment: (process.env.SQUARE_ENVIRONMENT as Environment) || Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    // Verify environment variables are set
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
      console.error('Square credentials not configured');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { sourceId, idempotencyKey, amount, currency = 'USD' } = body;

    // Validate required fields
    if (!sourceId || !idempotencyKey || !amount) {
      return NextResponse.json(
        { error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Convert amount to Money object (Square expects amount in smallest currency unit, e.g., cents)
    const amountMoney: Money = {
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency,
    };

    // Create payment request
    const paymentRequest: CreatePaymentRequest = {
      sourceId, // The card token from Square Web Payments SDK
      idempotencyKey, // Unique key to prevent duplicate payments
      amountMoney,
      locationId: process.env.SQUARE_LOCATION_ID,
    };

    // Create payment using Square API
    const { result, statusCode } = await squareClient.paymentsApi.createPayment(paymentRequest);

    if (statusCode !== 200 || !result.payment) {
      console.error('Square payment failed:', result);
      return NextResponse.json(
        { 
          error: result.errors?.[0]?.detail || 'Payment processing failed',
          details: result.errors,
        },
        { status: statusCode || 500 }
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

