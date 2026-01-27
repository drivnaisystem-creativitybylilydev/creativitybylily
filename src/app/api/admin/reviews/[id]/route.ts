import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * PATCH /api/admin/reviews/[id]
 * Update review (approve, feature, add response)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      is_approved,
      is_featured,
      admin_response
    } = body;

    const supabase = createAdminClient();

    // Build update object
    const updateData: any = {};
    if (is_approved !== undefined) updateData.is_approved = is_approved;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (admin_response !== undefined) updateData.admin_response = admin_response;

    // Get the review first to know which product to revalidate
    const { data: review } = await supabase
      .from('reviews')
      .select('product_id, products(slug)')
      .eq('id', id)
      .single();

    // Update review
    const { data: updatedReview, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }

    // Revalidate product page if review was approved/unapproved
    if (review && (review as any).products?.slug && is_approved !== undefined) {
      revalidatePath(`/products/${(review as any).products.slug}`);
      revalidatePath('/products');
    }

    return NextResponse.json({
      success: true,
      review: updatedReview
    });
  } catch (error) {
    console.error('Error in review PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Delete a review
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Get the review first to know which product to revalidate
    const { data: review } = await supabase
      .from('reviews')
      .select('product_id, products(slug)')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }

    // Revalidate product page
    if (review && (review as any).products?.slug) {
      revalidatePath(`/products/${(review as any).products.slug}`);
      revalidatePath('/products');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in review DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
