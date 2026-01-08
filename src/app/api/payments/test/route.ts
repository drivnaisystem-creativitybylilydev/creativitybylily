import { NextResponse } from 'next/server';

export async function GET() {
  console.log('TEST ROUTE CALLED');
  
  return NextResponse.json({
    message: 'Test route works',
    env: {
      hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
      hasLocationId: !!process.env.SQUARE_LOCATION_ID,
      environment: process.env.SQUARE_ENVIRONMENT,
      accessTokenLength: process.env.SQUARE_ACCESS_TOKEN?.length || 0,
      locationIdLength: process.env.SQUARE_LOCATION_ID?.length || 0,
    }
  });
}
