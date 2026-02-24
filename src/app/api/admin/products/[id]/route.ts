import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const supabase = createAdminClient();

    // Check if slug is being changed and if it conflicts
    if (slug) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (compare_at_price !== undefined) updateData.compare_at_price = compare_at_price ? Number(compare_at_price) : null;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (images !== undefined) updateData.images = images;
    if (variants !== undefined) updateData.variants = variants;
    if (inventory_count !== undefined) updateData.inventory_count = Number(inventory_count);
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    // Revalidate the admin products page cache so changes appear immediately
    revalidatePath('/admin/products');
    revalidatePath('/products'); // Also revalidate customer-facing products page

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error in product update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch the product first so we can clean up its images from storage
    const { data: product } = await supabase
      .from('products')
      .select('images, image_url')
      .eq('id', id)
      .single();

    // Delete the product from the database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Clean up images from Supabase Storage (best-effort, don't fail if this errors)
    if (product) {
      const allUrls: string[] = [
        ...(Array.isArray(product.images) ? product.images : []),
        product.image_url,
      ].filter(Boolean);

      const storagePaths = allUrls
        .map((url: string) => {
          // Extract path after /product-images/ from the Supabase Storage URL
          const match = url.match(/\/product-images\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      if (storagePaths.length > 0) {
        await supabase.storage.from('product-images').remove(storagePaths);
      }
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in product deletion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








