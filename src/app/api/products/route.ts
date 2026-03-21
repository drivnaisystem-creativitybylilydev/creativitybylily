import { NextResponse } from 'next/server';
import { getProductsListing, type ProductSortOption } from '@/lib/supabase/products';

const SORT_VALUES: ProductSortOption[] = ['newest', 'price_asc', 'price_desc', 'bestseller'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sortParam = searchParams.get('sort');
    const sort: ProductSortOption = SORT_VALUES.includes(sortParam as ProductSortOption)
      ? (sortParam as ProductSortOption)
      : 'newest';

    const products = await getProductsListing({
      category,
      search: q,
      sort,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}








