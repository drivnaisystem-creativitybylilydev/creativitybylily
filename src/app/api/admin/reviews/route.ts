import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/reviews
 * Fetch all reviews (including pending) for admin
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // all, pending, approved
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createAdminClient();

    // Build query with product join
    let query = supabase
      .from('reviews')
      .select(`
        *,
        products (
          id,
          title,
          image_url,
          slug
        )
      `, { count: 'exact' });

    // Filter by status
    if (status === 'pending') {
      query = query.eq('is_approved', false);
    } else if (status === 'approved') {
      query = query.eq('is_approved', true);
    }

    // Apply sorting
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'highest':
        query = query.order('rating', { ascending: false });
        break;
      case 'lowest':
        query = query.order('rating', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0
    });
  } catch (error) {
    console.error('Error in admin reviews GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
