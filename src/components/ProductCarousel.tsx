'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/supabase/types';
import HomepageProductCard from '@/components/HomepageProductCard';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';
import { sunhoneySectionHeadingClass } from '@/lib/productDisplayStyle';

const CATEGORIES = [
  { name: 'Bracelets', key: 'bracelets' },
  { name: 'Necklaces', key: 'necklaces' },
  { name: 'Earrings', key: 'earrings' },
  { name: 'Anklets', key: 'anklets' },
] as const;

const ROW_COUNT = 4;

/** Fisher-Yates: mixes categories together so no single row reads as "all bracelets". */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function MarqueeRow({
  products,
  direction,
  bestsellerIds,
}: {
  products: Product[];
  direction: 'ltr' | 'rtl';
  bestsellerIds: Set<string>;
}) {
  if (products.length === 0) return null;
  // Duplicated once so the loop is seamless (the animation travels exactly one copy's width).
  const items = [...products, ...products];

  return (
    <div className="overflow-hidden">
      <div className={`flex gap-4 ${direction === 'ltr' ? 'animate-marquee-ltr' : 'animate-marquee-rtl'}`}>
        {items.map((product, index) => (
          <div key={`${product.id}-${index}`} className="w-40 shrink-0 sm:w-48 md:w-56">
            <HomepageProductCard
              product={product}
              showBestseller={bestsellerIds.has(product.id)}
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
              titleHeading="h3"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const bestsellerIds = useBestsellerProductIds();

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (!cancelled) setProducts(shuffle(data.products || []));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    if (products.length === 0) return [];
    const chunkSize = Math.ceil(products.length / ROW_COUNT);
    return Array.from({ length: ROW_COUNT }, (_, i) =>
      products.slice(i * chunkSize, (i + 1) * chunkSize)
    ).filter((row) => row.length > 0);
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-10 text-center sm:mb-12">
        <h2
          className={`mb-5 text-center text-3xl sm:mb-6 sm:text-4xl md:text-5xl ${sunhoneySectionHeadingClass}`}
        >
          Our collection
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-base text-[color:var(--text-muted)] sm:text-lg">
          Discover our carefully curated selection of handcrafted jewelry, each piece designed to bring a touch of
          coastal elegance to your style.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-3 sm:text-base md:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              href={`/products?category=${category.key}`}
              className="rounded-full bg-stone-100 px-4 py-2.5 font-medium text-[color:var(--sunhoney-pink)] shadow-sm transition-all duration-300 hover:bg-stone-200 sm:px-6 sm:py-3"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="rounded-full border-2 border-[color:var(--logo-pink)] bg-white px-4 py-2.5 font-medium text-[color:var(--logo-pink)] shadow-sm transition-all duration-300 hover:bg-[color:var(--logo-pink)] hover:text-white sm:px-6 sm:py-3"
          >
            Shop all
          </Link>
        </div>
      </div>

      {!loading && rows.length > 0 && (
        <div className="space-y-5 sm:space-y-6">
          {rows.map((row, index) => (
            <MarqueeRow
              key={index}
              products={row}
              direction={index % 2 === 0 ? 'ltr' : 'rtl'}
              bestsellerIds={bestsellerIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
