'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/supabase/types';
import HomepageProductCard from '@/components/HomepageProductCard';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';
import { sunhoneySectionHeadingClass } from '@/lib/productDisplayStyle';

export default function CustomerFavorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const bestsellerIds = useBestsellerProductIds();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const allProducts = data.products || [];
        setProducts(allProducts.slice(0, 9));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-10 text-center sm:mb-12">
        <h2
          className={`mb-5 text-center text-3xl sm:mb-6 sm:text-4xl md:text-5xl ${sunhoneySectionHeadingClass}`}
        >
          Customer favorites
        </h2>
        <p className="mx-auto max-w-2xl text-base text-[color:var(--text-muted)] sm:text-lg">
          Discover our most loved pieces, handpicked by our community
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[color:var(--text-muted)]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--logo-pink)] border-t-transparent" />
          <p className="mt-4">Loading favorites...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-[color:var(--text-muted)]">
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <HomepageProductCard
                key={product.id}
                product={product}
                showBestseller={bestsellerIds.has(product.id)}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                titleHeading="h3"
              />
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Link
              href="/products"
              className="inline-flex transform items-center gap-2 rounded-full bg-[color:var(--logo-pink)] px-6 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 hover:shadow-xl sm:px-8 sm:py-4 sm:text-base"
            >
              Shop All Products
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
