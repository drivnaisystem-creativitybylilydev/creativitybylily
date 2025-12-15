import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase/products';

/**
 * Get all product images for gallery/collage display
 */
export async function GET() {
  try {
    const products = await getProducts();
    
    // Extract all images from products
    const images = products.flatMap(product => {
      const allImages = [product.image_url, ...(product.images || [])];
      return allImages
        .filter(Boolean)
        .map(imageUrl => ({
          src: imageUrl,
          title: product.title,
          collection: product.title,
          category: product.category,
        }));
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}








