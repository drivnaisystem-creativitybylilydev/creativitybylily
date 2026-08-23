import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/reviews/featured
 * Public. Approved reviews across all products, for the paused-store idle
 * screen and the homepage reviews section.
 * ?featuredOnly=false returns all approved reviews (used for the paused-page
 * "wall of reviews"); default (true) is the curated is_featured set used on
 * the homepage strip.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const featuredOnly = searchParams.get('featuredOnly') !== 'false';

    const supabase = createAdminClient();
    let query = supabase
      .from('reviews')
      .select(
        `
        id,
        reviewer_name,
        rating,
        title,
        comment,
        verified_purchase,
        created_at,
        products (
          title,
          slug
        )
      `
      )
      .eq('is_approved', true);

    if (featuredOnly) query = query.eq('is_featured', true);

    const { data: reviews, error } = await query.order('created_at', { ascending: false }).limit(limit);

    if (error) {
      console.error('Error fetching featured reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Error in featured reviews GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
