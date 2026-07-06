import { createAdminClient } from '@/lib/supabase/server';

export type RatingStats = { average_rating: number; total_reviews: number };

/**
 * One query for a whole page of product cards, instead of each card calling
 * /api/reviews individually. Shared by the batch-ratings API route and the
 * products page server component (so first paint doesn't need a client round trip).
 */
export async function getBatchRatings(productIds: string[]): Promise<Record<string, RatingStats>> {
  if (productIds.length === 0) return {};

  const supabase = createAdminClient();
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('product_id, rating')
    .eq('is_approved', true)
    .in('product_id', productIds);

  if (error) {
    console.error('Error fetching batch ratings:', error);
    return {};
  }

  const totals = new Map<string, { sum: number; count: number }>();
  for (const review of reviews || []) {
    const existing = totals.get(review.product_id) || { sum: 0, count: 0 };
    existing.sum += review.rating;
    existing.count += 1;
    totals.set(review.product_id, existing);
  }

  const ratings: Record<string, RatingStats> = {};
  for (const [productId, { sum, count }] of totals) {
    ratings[productId] = {
      average_rating: Math.round((sum / count) * 10) / 10,
      total_reviews: count,
    };
  }

  return ratings;
}
