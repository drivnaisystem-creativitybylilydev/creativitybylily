import { NextResponse } from 'next/server';

export async function GET() {
  console.log('TEST ROUTE CALLED');
  
  try {
    // Use SquareClient instead of Client
    const { SquareClient } = require('square');
    console.log('SquareClient loaded via require');
    
    // Try to initialize Square client
    const squareClient = new SquareClient({
      environment: 'production',
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    });
    
    console.log('SquareClient initialized successfully!');
    
    return NextResponse.json({
      message: 'SquareClient initialized successfully!',
      env: {
        hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
        hasLocationId: !!process.env.SQUARE_LOCATION_ID,
        environment: process.env.SQUARE_ENVIRONMENT,
      }
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
