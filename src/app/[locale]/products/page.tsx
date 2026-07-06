import { getProductsListing, getBestsellerProductIdSet, type ProductSortOption } from '@/lib/supabase/products';
import { getBatchRatings } from '@/lib/reviews';
import ProductsPageClient from './ProductsPageClient';

const SORT_VALUES: ProductSortOption[] = ['newest', 'price_asc', 'price_desc', 'bestseller'];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || null;
  const q = params.q || null;
  const sort: ProductSortOption = SORT_VALUES.includes(params.sort as ProductSortOption)
    ? (params.sort as ProductSortOption)
    : 'newest';

  const [initialProducts, initialBestsellerIdSet] = await Promise.all([
    getProductsListing({ category, search: q, sort }),
    getBestsellerProductIdSet(),
  ]);

  const initialRatings = await getBatchRatings(initialProducts.map((p) => p.id));

  return (
    <ProductsPageClient
      initialProducts={initialProducts}
      initialRatings={initialRatings}
      initialBestsellerIds={Array.from(initialBestsellerIdSet)}
    />
  );
}
