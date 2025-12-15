import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      category,
      description,
      price,
      compare_at_price,
      image_url,
      images,
      variants,
      inventory_count,
      is_active,
    } = body;

    // Validate required fields
    if (!title || !slug || !category || !description || !price || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['earrings', 'necklaces', 'bracelets'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title,
        slug,
        category,
        description,
        price: Number(price),
        compare_at_price: compare_at_price ? Number(compare_at_price) : null,
        image_url,
        images: images || [image_url],
        variants: variants || [],
        inventory_count: Number(inventory_count) || 0,
        is_active: is_active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error in product creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








