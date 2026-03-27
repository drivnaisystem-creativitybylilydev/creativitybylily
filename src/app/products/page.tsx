'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, Suspense, type CSSProperties } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Product } from '@/lib/supabase/types';
import { useCart } from '@/contexts/CartContext';
import ProductRatingBadge from '@/components/ProductRatingBadge';
import { CoastalBackdropLayers } from '@/components/CoastalBackdrop';
import { Filter } from 'lucide-react';
import BestsellerTag from '@/components/BestsellerTag';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Most sold' },
] as const;

/** Same glow stack as “Our Collection” title (hero-style white + pink halos) */
const SHOP_COLLECTION_TITLE_GLOW =
  '0 1px 2px rgba(0, 0, 0, 0.15), 0 0 15px rgba(255, 105, 180, 0.55), 0 0 35px rgba(255, 105, 180, 0.45), 0 0 55px rgba(255, 105, 180, 0.35), 0 0 85px rgba(255, 105, 180, 0.25), 0 0 120px rgba(255, 105, 180, 0.15), 0 0 160px rgba(255, 105, 180, 0.08)';

/** Title underline: white stroke + identical glow to the heading */
const SHOP_TITLE_UNDERLINE_STYLE: CSSProperties = {
  background:
    'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 6%, #ffffff 14%, #ffffff 86%, rgba(255, 255, 255, 0.45) 94%, transparent 100%)',
  boxShadow: SHOP_COLLECTION_TITLE_GLOW,
};

/** Glowy pink rule — section separator (hero → products) */
const SHOP_PINK_GLOW_RULE_STYLE: CSSProperties = {
  background:
    'linear-gradient(90deg, transparent 0%, rgba(255, 114, 166, 0.35) 15%, #ff72a6 50%, rgba(255, 114, 166, 0.35) 85%, transparent 100%)',
  boxShadow:
    '0 0 14px 3px rgba(255, 114, 166, 0.55), 0 0 28px 8px rgba(255, 114, 166, 0.25), 0 0 48px 12px rgba(255, 180, 205, 0.2)',
};

const SHOP_HERO_META_STYLE: CSSProperties = {
  color: 'rgba(255, 254, 252, 0.95)',
  textShadow:
    '0 1px 2px rgba(0, 0, 0, 0.45), 0 0 10px rgba(255, 105, 180, 0.45), 0 0 22px rgba(255, 105, 180, 0.25)',
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ProductsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category') || 'all';
  const urlSort = searchParams.get('sort') || 'newest';
  const urlQ = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(urlQ);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const { addItem } = useCart();
  const bestsellerIds = useBestsellerProductIds();

  const selectedCategory = ['all', 'earrings', 'necklaces', 'bracelets', 'anklets'].includes(urlCategory)
    ? urlCategory
    : 'all';

  const sortValue = SORT_OPTIONS.some((o) => o.value === urlSort) ? urlSort : 'newest';

  useEffect(() => {
    setSearchInput(urlQ);
  }, [urlQ]);

  /** Keep ?q= in sync when debounced search changes (merge with category/sort in URL). */
  useEffect(() => {
    const nextQ = debouncedSearch.trim();
    const currentQ = searchParams.get('q') || '';
    if (nextQ === currentQ) return;

    const p = new URLSearchParams(searchParams.toString());
    if (nextQ) p.set('q', nextQ);
    else p.delete('q');
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (selectedCategory !== 'all') p.set('category', selectedCategory);
        if (sortValue !== 'newest') p.set('sort', sortValue);
        if (debouncedSearch.trim()) p.set('q', debouncedSearch.trim());

        const response = await fetch(`/api/products?${p.toString()}`);
        const data = await response.json();
        if (!cancelled) setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, sortValue, debouncedSearch]);

  const setCategory = (category: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (category === 'all') p.delete('category');
    else p.set('category', category);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const setSort = (sort: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (sort === 'newest') p.delete('sort');
    else p.set('sort', sort);
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const categories = ['all', 'earrings', 'necklaces', 'bracelets', 'anklets'];

  const pagePad = 'px-4 sm:px-6 lg:px-8 xl:px-10';

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Coastal background only above the product grid */}
      <section className={`relative overflow-hidden pt-16 pb-12 ${pagePad}`}>
        <CoastalBackdropLayers />
        <div className="relative z-10 mx-auto w-full max-w-none">
          <div className="text-center">
            <div className="relative z-[1] mx-auto mb-6 w-full max-w-3xl px-2 sm:px-4">
              <h1
                className="font-normal leading-[1.05] text-center text-balance"
                style={{
                  fontFamily: 'var(--font-script)',
                  color: '#fff',
                  /* Fluid size: nearly full width of subtext column (max-w-3xl) */
                  fontSize: 'clamp(3rem, 13vw, 6.75rem)',
                  textShadow: SHOP_COLLECTION_TITLE_GLOW,
                }}
              >
                Our Collection
              </h1>
              <div className="mx-auto mt-1 w-full px-2 sm:px-6" aria-hidden>
                <div className="h-[3px] w-full rounded-full" style={SHOP_TITLE_UNDERLINE_STYLE} />
              </div>
            </div>
            <p
              className="relative z-[1] mx-auto mb-8 max-w-3xl text-balance text-center text-base font-normal leading-relaxed sm:text-lg md:text-xl"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#fff',
                letterSpacing: '0.03em',
                textShadow: SHOP_COLLECTION_TITLE_GLOW,
              }}
            >
              Discover our carefully curated selection of handcrafted jewelry, each piece designed to bring a touch of
              coastal elegance to your style.
            </p>

            {/* Filter icon (sort) + category chips — filter sits left of All Products */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
            <div
              className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:border-[color:var(--logo-pink)]/40 hover:text-[color:var(--logo-pink)] focus-within:ring-2 focus-within:ring-[color:var(--logo-pink)]/25 focus-within:border-[color:var(--logo-pink)] ${
                sortValue !== 'newest'
                  ? 'border-[color:var(--logo-pink)]/60 text-[color:var(--logo-pink)]'
                  : 'border-stone-200 text-gray-600'
              }`}
            >
              <span className="pointer-events-none" aria-hidden>
                <Filter className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <label htmlFor="shop-sort" className="sr-only">
                Sort and filter products
              </label>
              <select
                id="shop-sort"
                value={sortValue}
                onChange={(e) => setSort(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0 w-full h-full rounded-full"
                title="Sort by"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[color:var(--logo-pink)] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

            {/* Search — below categories */}
            <div className="max-w-xl mx-auto mb-8">
            <label htmlFor="shop-search" className="sr-only">
              Search products by name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                id="shop-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by product name…"
                autoComplete="off"
                className="w-full rounded-full border border-stone-200 bg-white py-3.5 pl-12 pr-5 text-gray-800 placeholder:text-stone-400 shadow-sm focus:border-[color:var(--logo-pink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)]/25"
              />
            </div>
            </div>

            <p className="text-center text-sm font-medium tracking-wide" style={SHOP_HERO_META_STYLE}>
              Showing {products.length} product{products.length === 1 ? '' : 's'}
              {debouncedSearch.trim() ? ` matching “${debouncedSearch.trim()}”` : ''}
            </p>
          </div>
        </div>
      </section>

      {/* Glowy pink rule between hero and products — edge to edge */}
      <div className="relative w-full pb-2" aria-hidden>
        <div className="h-[3px] w-full rounded-none" style={SHOP_PINK_GLOW_RULE_STYLE} />
      </div>

      <div className={`mx-auto w-full max-w-none pb-16 pt-6 ${pagePad}`}>
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group min-w-0 w-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] ${
                        (product.inventory_count || 0) === 0 ? 'opacity-60' : ''
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {bestsellerIds.has(product.id) && <BestsellerTag />}
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium capitalize text-[color:var(--text-muted)] backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>
                    {(product.inventory_count || 0) === 0 && (
                      <div className="absolute right-3 top-3">
                        <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/products/${product.slug}`}>
                    <h2
                      className="mb-2 line-clamp-2 text-xl font-normal leading-snug tracking-wide text-[color:var(--sunhoney-pink)] transition-colors hover:opacity-90"
                      style={{ fontFamily: 'var(--font-allura), var(--font-script), cursive' }}
                    >
                      {product.title}
                    </h2>
                    <p className="mb-2 text-sm text-[color:var(--text-muted)]">Handcrafted on Cape Cod</p>
                  </Link>
                  <div className="mb-4">
                    <ProductRatingBadge productId={product.id} compact />
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="text-2xl font-normal text-[color:var(--sunhoney-pink)]"
                      style={{ fontFamily: 'var(--font-allura), var(--font-script), cursive' }}
                    >
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 text-center text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity text-sm font-medium py-2"
                    >
                      View Details →
                    </Link>
                    {(product.inventory_count || 0) > 0 ? (
                      <button
                        type="button"
                        onClick={() => addItem(product, 1)}
                        className="flex-1 bg-[color:var(--logo-pink)] text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found. Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] py-24">
          <p className="text-gray-500">Loading shop…</p>
        </div>
      }
    >
      <ProductsPageInner />
    </Suspense>
  );
}
