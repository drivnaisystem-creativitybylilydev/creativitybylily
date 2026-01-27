import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/reviews?product_id=xxx&sort=newest
 * Fetch reviews for a product (only approved reviews for public)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sort = searchParams.get('sort') || 'newest'; // newest, oldest, highest, lowest
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!productId) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .eq('is_approved', true); // Only show approved reviews to public

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

    // Get rating statistics
    const { data: stats } = await supabase
      .rpc('get_product_rating', { product_uuid: productId });

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      stats: stats?.[0] || {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      }
    });
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Submit a new review (requires moderation before showing)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      product_id,
      order_id,
      reviewer_name,
      reviewer_email,
      rating,
      title,
      comment,
      images
    } = body;

    // Validation
    if (!product_id || !reviewer_name || !reviewer_email || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reviewer_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if order_id is provided and if it's a verified purchase
    let verifiedPurchase = false;
    if (order_id) {
      const { data: orderItem } = await supabase
        .from('order_items')
        .select('id, orders!inner(customer_email)')
        .eq('product_id', product_id)
        .eq('order_id', order_id)
        .single();

      if (orderItem) {
        // Check if email matches order email
        const orderEmail = (orderItem as any).orders?.customer_email;
        if (orderEmail && orderEmail.toLowerCase() === reviewer_email.toLowerCase()) {
          verifiedPurchase = true;
        }
      }
    }

    // Check if user has already reviewed this product (prevent spam)
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', product_id)
      .eq('reviewer_email', reviewer_email.toLowerCase())
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        product_id,
        order_id: order_id || null,
        reviewer_name: reviewer_name.trim(),
        reviewer_email: reviewer_email.toLowerCase().trim(),
        rating: Number(rating),
        title: title?.trim() || null,
        comment: comment.trim(),
        images: images || [],
        verified_purchase: verifiedPurchase,
        is_approved: false, // Requires admin approval
        is_featured: false,
        helpful_count: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating review:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review,
      message: 'Thank you! Your review has been submitted and will appear after moderation.'
    });
  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
