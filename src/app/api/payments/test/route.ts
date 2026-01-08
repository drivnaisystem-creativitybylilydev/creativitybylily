import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';

export async function GET() {
  console.log('TEST ROUTE CALLED');
  
  try {
    // Try to initialize Square client
    const squareClient = new Client({
      environment: Environment.Production,
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    });
    
    return NextResponse.json({
      message: 'Square client initialized successfully',
      env: {
        hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
        hasLocationId: !!process.env.SQUARE_LOCATION_ID,
        environment: process.env.SQUARE_ENVIRONMENT,
        accessTokenLength: process.env.SQUARE_ACCESS_TOKEN?.length || 0,
        locationIdLength: process.env.SQUARE_LOCATION_ID?.length || 0,
      }
    });
  } catch (error: any) {
    console.error('Square client error:', error);
    return NextResponse.json({
      message: 'Square client initialization failed',
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
