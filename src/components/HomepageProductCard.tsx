'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/supabase/types';
import ProductCardImageHover from '@/components/ProductCardImageHover';
import BestsellerTag from '@/components/BestsellerTag';
import { normalizeProductGalleryUrls } from '@/lib/productGalleryUrls';

const headingFont = { fontFamily: 'var(--font-allura), var(--font-script), cursive' } as const;

type HomepageProductCardProps = {
  product: Product;
  showBestseller: boolean;
  sizes: string;
  /** Section heading level for the product title (favorites: h3, collection grid: h4). */
  titleHeading: 'h3' | 'h4';
};

/**
 * Single homepage product tile — matches shop-style chrome + Allura copy; full-card hover/touch for alt image.
 */
export default function HomepageProductCard({
  product,
  showBestseller,
  sizes,
  titleHeading,
}: HomepageProductCardProps) {
  const hasAltImage = useMemo(
    () => normalizeProductGalleryUrls(product.image_url, product.images).length > 1,
    [product.image_url, product.images]
  );
  const [peek, setPeek] = useState(false);

  const titleClassName =
    'mb-2 line-clamp-2 text-base font-normal text-[color:var(--sunhoney-pink)] transition-colors group-hover:opacity-90 sm:text-lg';

  const title = (
    <Link href={`/products/${product.slug}`} className="block touch-manipulation">
      {titleHeading === 'h3' ? (
        <h3 className={titleClassName} style={headingFont}>
          {product.title}
        </h3>
      ) : (
        <h4 className={titleClassName} style={headingFont}>
          {product.title}
        </h4>
      )}
    </Link>
  );

  return (
    <div
      className="group min-w-0 w-full overflow-hidden rounded-none border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md touch-manipulation"
      onMouseEnter={() => hasAltImage && setPeek(true)}
      onMouseLeave={() => setPeek(false)}
      onTouchStart={() => hasAltImage && setPeek(true)}
      onTouchEnd={() => setPeek(false)}
      onTouchCancel={() => setPeek(false)}
    >
      <Link href={`/products/${product.slug}`} className="block touch-manipulation">
        <ProductCardImageHover
          imageUrl={product.image_url}
          images={product.images}
          alt={product.title}
          sizes={sizes}
          peekActive={hasAltImage ? peek : undefined}
        >
          {showBestseller && <BestsellerTag />}
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 z-[3] sm:bottom-2 sm:left-2">
            <span className="bg-white/95 px-1.5 py-0.5 text-[9px] font-medium uppercase leading-tight tracking-wider text-[color:var(--text-muted)] sm:px-2 sm:text-[10px]">
              {product.category}
            </span>
          </div>
        </ProductCardImageHover>
      </Link>
      <div className="border-t border-stone-100 px-2.5 pb-4 pt-3.5 sm:px-4 sm:pb-5 sm:pt-4">
        {title}
        <p className="text-base font-normal text-[color:var(--sunhoney-pink)] sm:text-lg" style={headingFont}>
          ${product.price}
        </p>
      </div>
    </div>
  );
}
