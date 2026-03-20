import { NextResponse } from 'next/server';

const FLAT_SHIPPING_COST = 6;

/**
 * Calculate shipping for checkout.
 * Currently returns flat $6 for all orders (free shipping still applies at $35+ subtotal).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shippingAddress, items } = body;

    if (!shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Shipping address and items are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      shippingCost: FLAT_SHIPPING_COST,
      baseCost: FLAT_SHIPPING_COST,
      markup: 0,
      carrier: 'USPS',
      serviceLevel: 'Flat Rate',
      estimatedDays: null,
    });
  } catch (error: any) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}







