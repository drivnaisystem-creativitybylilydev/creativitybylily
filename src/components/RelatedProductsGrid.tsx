'use client';

import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import ProductCardImageHover from '@/components/ProductCardImageHover';
import ScrollReveal from '@/components/ScrollReveal';
import {
  sunhoneyProductNameClass,
  sunhoneyProductPriceClass,
} from '@/lib/productDisplayStyle';

type RelatedProductsGridProps = {
  products: Product[];
  bestsellerProductIds: string[];
};

export default function RelatedProductsGrid({ products, bestsellerProductIds }: RelatedProductsGridProps) {
  const set = new Set(bestsellerProductIds);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((recommendedProduct) => (
        <Link
          key={recommendedProduct.id}
          href={`/products/${recommendedProduct.slug}`}
          className="group block min-w-0 border border-stone-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <ScrollReveal className="h-full">
            <ProductCardImageHover
              imageUrl={recommendedProduct.image_url}
              images={recommendedProduct.images}
              alt={recommendedProduct.title}
              sizes="(max-width: 640px) 50vw, 25vw"
            >
              {set.has(recommendedProduct.id) && <BestsellerTag />}
              <div className="pointer-events-none absolute left-1.5 top-1.5 z-[3] sm:left-2 sm:top-2">
                <span className="rounded-none border border-stone-200/80 bg-white/95 px-1.5 py-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-[color:var(--text-muted)] backdrop-blur-sm sm:px-2 sm:py-1 sm:text-[10px]">
                  {recommendedProduct.category}
                </span>
              </div>
            </ProductCardImageHover>
          </ScrollReveal>
          <div className="space-y-1.5 border-t border-stone-200/80 px-2 py-3 text-center sm:space-y-2 sm:px-3 sm:py-4">
            <h3 className={`${sunhoneyProductNameClass} line-clamp-4`}>{recommendedProduct.title}</h3>
            <p className={sunhoneyProductPriceClass}>${recommendedProduct.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
