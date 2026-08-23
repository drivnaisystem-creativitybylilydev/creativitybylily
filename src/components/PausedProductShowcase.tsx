'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/supabase/types';
import { sunhoneyProductNameClass } from '@/lib/productDisplayStyle';

/**
 * Non-interactive "look what's coming back" strip for the /paused idle screen.
 * Deliberately not clickable — every storefront route bounces back to /paused
 * while the store is closed, so a Link here would just be a dead loop.
 */
export default function PausedProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products?sort=newest&limit=16')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (products.length === 0) return null;

  const items = [...products, ...products];

  return (
    <div className="overflow-hidden py-2">
      <div className="flex animate-marquee-ltr gap-4 will-change-transform">
        {items.map((product, index) => (
          <div key={`${product.id}-${index}`} className="w-40 shrink-0 sm:w-48 md:w-56">
            <div className="relative aspect-[3/4] overflow-hidden rounded-none border border-stone-200/80 bg-stone-50">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                className="object-cover"
              />
            </div>
            <p className={`${sunhoneyProductNameClass} mt-2 line-clamp-2 leading-relaxed`}>{product.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
