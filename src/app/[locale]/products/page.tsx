import {
  getProductsListing,
  getProductsListingCount,
  getBestsellerProductIdSet,
  type ProductSortOption,
} from '@/lib/supabase/products';
import { getBatchRatings } from '@/lib/reviews';
import ProductsPageClient from './ProductsPageClient';

const SORT_VALUES: ProductSortOption[] = ['newest', 'price_asc', 'price_desc', 'bestseller'];

/** First page renders server-side; the rest loads via "Load more" so the initial HTML/DOM
 * stays light instead of shipping the whole catalog on every visit. */
export const PAGE_SIZE = 12;

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

  const initialProducts = await getProductsListing({ category, search: q, sort, limit: PAGE_SIZE, offset: 0 });

  // These three are independent of each other (ratings only needs the ids we already have),
  // so run them together instead of one-after-another to keep the critical path to two round trips.
  const [total, initialBestsellerIdSet, initialRatings] = await Promise.all([
    getProductsListingCount({ category, search: q }),
    getBestsellerProductIdSet(),
    getBatchRatings(initialProducts.map((p) => p.id)),
  ]);

  return (
    <ProductsPageClient
      initialProducts={initialProducts}
      initialRatings={initialRatings}
      initialBestsellerIds={Array.from(initialBestsellerIdSet)}
      initialTotal={total}
      pageSize={PAGE_SIZE}
    />
  );
}
