'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';

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

  const headingFont = { fontFamily: 'var(--font-allura), var(--font-script), cursive' } as const;

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 text-center">
        <h2 className="mb-6 text-5xl font-normal text-[color:var(--sunhoney-pink)]" style={headingFont}>
          Customer Favorites
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-[color:var(--text-muted)]">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                    quality={75}
                  />
                  {bestsellerIds.has(product.id) && <BestsellerTag />}
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium capitalize text-[color:var(--text-muted)] backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3
                    className="mb-2 line-clamp-2 text-xl font-normal text-[color:var(--sunhoney-pink)] transition-colors group-hover:opacity-90"
                    style={headingFont}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-normal text-[color:var(--sunhoney-pink)]" style={headingFont}>
                      ${product.price}
                    </p>
                    <svg
                      className="h-5 w-5 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--sunhoney-pink)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex transform items-center gap-2 rounded-full bg-[color:var(--logo-pink)] px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 hover:shadow-xl"
            >
              Shop All Products
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
