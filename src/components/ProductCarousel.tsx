'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import { useBestsellerProductIds } from '@/hooks/useBestsellerProductIds';

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

  const headingFont = { fontFamily: 'var(--font-allura), var(--font-script), cursive' } as const;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 text-center">
        <h2
          className="mb-6 text-5xl font-normal text-[color:var(--sunhoney-pink)]"
          style={headingFont}
        >
          Our Collection
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-[color:var(--text-muted)]">
          Discover our carefully curated selection of handcrafted jewelry, each piece designed to bring a touch of
          coastal elegance to your style.
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`rounded-full px-6 py-3 font-medium shadow-sm transition-all duration-300 ${
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
            className="rounded-full border-2 border-[color:var(--logo-pink)] bg-white px-6 py-3 font-medium text-[color:var(--logo-pink)] shadow-sm transition-all duration-300 hover:bg-[color:var(--logo-pink)] hover:text-white"
          >
            Shop all
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-lg">
        {categories.map((category) =>
          activeCategory === category.key ? (
            <div key={category.key} className="animate-fade-in">
              <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                <div className="text-center md:text-left">
                  <h3 className="mb-2 text-3xl font-normal text-[color:var(--sunhoney-pink)]" style={headingFont}>
                    {category.name} Collection
                  </h3>
                  <p className="text-[color:var(--text-muted)]">{category.description}</p>
                </div>
                <Link
                  href={`/products?category=${category.key}`}
                  className="mt-4 rounded-full bg-[color:var(--logo-pink)] px-6 py-3 font-medium text-white shadow-lg transition-opacity duration-300 hover:opacity-90 hover:shadow-xl md:mt-0"
                >
                  Shop {category.name}
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-[color:var(--text-muted)]">Loading products...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {getCategoryProducts(category.key, 8).map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg shadow-sm">
                        {bestsellerIds.has(product.id) && <BestsellerTag />}
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                          loading="lazy"
                          quality={75}
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                      <h4
                        className="line-clamp-2 text-lg font-normal text-[color:var(--sunhoney-pink)]"
                        style={headingFont}
                      >
                        {product.title}
                      </h4>
                      <p className="text-base font-normal text-[color:var(--sunhoney-pink)]" style={headingFont}>
                        ${product.price}
                      </p>
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
