'use client';

import { Link } from '@/i18n/navigation';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/supabase/types';
import BestsellerTag from '@/components/BestsellerTag';
import ProductCardImageHover from '@/components/ProductCardImageHover';
import ScrollReveal from '@/components/ScrollReveal';
import {
  sunhoneyProductNameClass,
  sunhoneyProductPriceClass,
} from '@/lib/productDisplayStyle';
import { normalizeProductGalleryUrls } from '@/lib/productGalleryUrls';

type RelatedProductsGridProps = {
  products: Product[];
  bestsellerProductIds: string[];
};

function RelatedProductTile({
  recommendedProduct,
  isBestseller,
}: {
  recommendedProduct: Product;
  isBestseller: boolean;
}) {
  const hasAltImage = useMemo(
    () => normalizeProductGalleryUrls(recommendedProduct.image_url, recommendedProduct.images).length > 1,
    [recommendedProduct.image_url, recommendedProduct.images]
  );
  const [peek, setPeek] = useState(false);

  return (
    <Link
      href={`/products/${recommendedProduct.slug}`}
      className="group block min-w-0 touch-manipulation border border-stone-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      onMouseEnter={() => hasAltImage && setPeek(true)}
      onMouseLeave={() => setPeek(false)}
    >
      <ScrollReveal className="h-full">
        <ProductCardImageHover
          imageUrl={recommendedProduct.image_url}
          images={recommendedProduct.images}
          alt={recommendedProduct.title}
          sizes="(max-width: 640px) 50vw, 25vw"
          peekActive={hasAltImage ? peek : undefined}
        >
          {isBestseller && <BestsellerTag />}
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
  );
}

export default function RelatedProductsGrid({ products, bestsellerProductIds }: RelatedProductsGridProps) {
  const set = new Set(bestsellerProductIds);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {products.map((recommendedProduct) => (
        <RelatedProductTile
          key={recommendedProduct.id}
          recommendedProduct={recommendedProduct}
          isBestseller={set.has(recommendedProduct.id)}
        />
      ))}
    </div>
  );
}
