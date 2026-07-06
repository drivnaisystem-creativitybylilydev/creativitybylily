import { NextResponse } from 'next/server';
import { getProductsListing, getProductsListingCount, type ProductSortOption } from '@/lib/supabase/products';

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

    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    const products = await getProductsListing({
      category,
      search: q,
      sort,
      limit,
      offset,
    });

    // Only pagination callers ("load more") need the total; skip the extra count query otherwise.
    const total = typeof limit === 'number' ? await getProductsListingCount({ category, search: q }) : undefined;

    return NextResponse.json({ products, total });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
