'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import ProductCardImageHover from '@/components/ProductCardImageHover';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';

const headingFont = { fontFamily: 'var(--font-allura), var(--font-script), cursive' } as const;

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
          className="mb-5 text-4xl font-normal text-[color:var(--sunhoney-pink)] sm:mb-6 sm:text-5xl"
          style={headingFont}
        >
          Customer Favorites
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
              <div
                key={product.id}
                className="group min-w-0 w-full overflow-hidden rounded-none border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <ProductCardImageHover
                    imageUrl={product.image_url}
                    images={product.images}
                    alt={product.title}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  >
                    {bestsellerIds.has(product.id) && <BestsellerTag />}
                    <div className="pointer-events-none absolute bottom-1.5 left-1.5 z-[3] sm:bottom-2 sm:left-2">
                      <span className="bg-white/95 px-1.5 py-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-[color:var(--text-muted)] sm:px-2 sm:text-[10px]">
                        {product.category}
                      </span>
                    </div>
                  </ProductCardImageHover>
                </Link>

                <div className="border-t border-stone-100 px-2.5 pb-4 pt-3.5 sm:px-4 sm:pb-5 sm:pt-4">
                  <Link href={`/products/${product.slug}`} className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="mb-1 line-clamp-2 text-sm font-normal text-[color:var(--sunhoney-pink)] transition-colors group-hover:opacity-90 sm:mb-1.5 sm:text-base"
                        style={headingFont}
                      >
                        {product.title}
                      </h3>
                      <p className="text-sm font-normal text-[color:var(--sunhoney-pink)] sm:text-base" style={headingFont}>
                        ${product.price}
                      </p>
                    </div>
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--sunhoney-pink)] sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
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
