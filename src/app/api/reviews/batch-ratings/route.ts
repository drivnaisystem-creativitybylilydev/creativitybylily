import { NextResponse } from 'next/server';
import { getBatchRatings } from '@/lib/reviews';

/**
 * GET /api/reviews/batch-ratings?ids=id1,id2,id3
 * One query for a whole page of product cards, instead of each card calling
 * /api/reviews individually (was firing one request + one RPC call per card on the shop grid).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || '';
    const productIds = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    const ratings = await getBatchRatings(productIds);
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Error in batch-ratings GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
