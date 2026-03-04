import { NextResponse } from 'next/server';
import { getProducts, getProductsByCategory } from '@/lib/supabase/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let products;
    if (category && ['earrings', 'necklaces', 'bracelets', 'anklets'].includes(category)) {
      products = await getProductsByCategory(category as 'earrings' | 'necklaces' | 'bracelets' | 'anklets');
    } else {
      products = await getProducts();
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}








