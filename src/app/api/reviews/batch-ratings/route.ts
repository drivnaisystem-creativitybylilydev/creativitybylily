import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/reviews/batch-ratings?ids=id1,id2,id3
 * One query for a whole page of product cards, instead of each card calling /api/reviews
 * individually (was firing one request + one RPC call per card on the shop grid).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || '';
    const productIds = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (productIds.length === 0) {
      return NextResponse.json({ ratings: {} });
    }

    const supabase = createAdminClient();
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('product_id, rating')
      .eq('is_approved', true)
      .in('product_id', productIds);

    if (error) {
      console.error('Error fetching batch ratings:', error);
      return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
    }

    const totals = new Map<string, { sum: number; count: number }>();
    for (const review of reviews || []) {
      const existing = totals.get(review.product_id) || { sum: 0, count: 0 };
      existing.sum += review.rating;
      existing.count += 1;
      totals.set(review.product_id, existing);
    }

    const ratings: Record<string, { average_rating: number; total_reviews: number }> = {};
    for (const [productId, { sum, count }] of totals) {
      ratings[productId] = {
        average_rating: Math.round((sum / count) * 10) / 10,
        total_reviews: count,
      };
    }

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Error in batch-ratings GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
