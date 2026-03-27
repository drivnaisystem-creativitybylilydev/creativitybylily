'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';

const headingFont = { fontFamily: 'var(--font-allura), var(--font-script), cursive' } as const;

export default function ProductCarousel() {
  const [activeCategory, setActiveCategory] = useState('bracelets');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const bestsellerIds = useBestsellerProductIds();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Bracelets', key: 'bracelets', description: 'Stackable and statement pieces for every wrist' },
    { name: 'Necklaces', key: 'necklaces', description: 'Elegant pieces to complete your look' },
    { name: 'Earrings', key: 'earrings', description: 'From dangle to stud, find your perfect pair' },
    { name: 'Anklets', key: 'anklets', description: 'Delicate ankle pieces perfect for coastal style' },
  ];

  const getCategoryProducts = (categoryKey: string, limit: number) => {
    return products.filter((p) => p.category === categoryKey).slice(0, limit);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-10 text-center sm:mb-12">
        <h2
          className="mb-5 text-4xl font-normal text-[color:var(--sunhoney-pink)] sm:mb-6 sm:text-5xl"
          style={headingFont}
        >
          Our collection
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-base text-[color:var(--text-muted)] sm:text-lg">
          Discover our carefully curated selection of handcrafted jewelry, each piece designed to bring a touch of
          coastal elegance to your style.
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-3 sm:text-base md:gap-4">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`rounded-full px-4 py-2.5 font-medium shadow-sm transition-all duration-300 sm:px-6 sm:py-3 ${
                activeCategory === category.key
                  ? 'bg-[color:var(--logo-pink)] text-white'
                  : 'bg-stone-100 text-[color:var(--sunhoney-pink)] hover:bg-stone-200'
              }`}
            >
              {category.name} ({getCategoryProducts(category.key, products.length).length})
            </button>
          ))}
          <Link
            href="/products"
            className="rounded-full border-2 border-[color:var(--logo-pink)] bg-white px-4 py-2.5 font-medium text-[color:var(--logo-pink)] shadow-sm transition-all duration-300 hover:bg-[color:var(--logo-pink)] hover:text-white sm:px-6 sm:py-3"
          >
            Shop all
          </Link>
        </div>
      </div>

      <div className="border border-stone-200/80 bg-white p-4 shadow-lg sm:p-6 md:p-8">
        {categories.map((category) =>
          activeCategory === category.key ? (
            <div key={category.key} className="animate-fade-in">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:mb-8 md:flex-row">
                <div className="text-center md:text-left">
                  <h3
                    className="mb-2 text-2xl font-normal text-[color:var(--sunhoney-pink)] sm:text-3xl md:text-left"
                    style={headingFont}
                  >
                    {category.name} collection
                  </h3>
                  <p className="text-sm text-[color:var(--text-muted)] sm:text-base">{category.description}</p>
                </div>
                <Link
                  href={`/products?category=${category.key}`}
                  className="rounded-full bg-[color:var(--logo-pink)] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-opacity duration-300 hover:opacity-90 sm:px-6 sm:py-3 sm:text-base"
                >
                  Shop {category.name}
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-[color:var(--text-muted)]">Loading products...</div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {getCategoryProducts(category.key, 8).map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group block min-w-0">
                      <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          {bestsellerIds.has(product.id) && <BestsellerTag />}
                        </div>
                        <div className="p-4 sm:p-5">
                          <h4
                            className="mb-2 line-clamp-2 text-lg font-normal text-[color:var(--sunhoney-pink)] transition-colors group-hover:opacity-90 sm:text-xl"
                            style={headingFont}
                          >
                            {product.title}
                          </h4>
                          <p className="text-lg font-normal text-[color:var(--sunhoney-pink)] sm:text-xl" style={headingFont}>
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
