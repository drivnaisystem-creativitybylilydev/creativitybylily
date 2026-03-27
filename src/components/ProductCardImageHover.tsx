'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { normalizeProductGalleryUrls } from '@/lib/productGalleryUrls';

type ProductCardImageHoverProps = {
  imageUrl: string;
  images?: string[] | null;
  alt: string;
  sizes: string;
  /** Visually dims both layers (e.g. out of stock). */
  dimmed?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  /** Outer frame: aspect ratio, rounding, background. */
  containerClassName?: string;
  children?: React.ReactNode;
};

/**
 * Crossfades to a second product image on hover when `images` includes another URL.
 * No-op when only one URL — behaves like a single image.
 */
export default function ProductCardImageHover({
  imageUrl,
  images,
  alt,
  sizes,
  dimmed = false,
  quality = 75,
  loading = 'lazy',
  priority = false,
  containerClassName = 'relative aspect-[3/4] overflow-hidden rounded-none bg-stone-50',
  children,
}: ProductCardImageHoverProps) {
  const [hover, setHover] = useState(false);
  const urls = useMemo(() => normalizeProductGalleryUrls(imageUrl, images), [imageUrl, images]);
  const primary = urls[0];
  const secondary = urls.length > 1 ? urls[1] : null;
  const showSecond = Boolean(secondary && hover);

  const baseImg =
    'object-cover transition-[opacity,transform] duration-300 ease-out group-hover:scale-[1.02]';
  const dim = dimmed ? 'opacity-60' : '';

  if (!primary) {
    return <div className={containerClassName} aria-hidden />;
  }

  return (
    <div
      className={containerClassName}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={primary}
        alt={alt}
        fill
        className={`${baseImg} ${dim} ${showSecond ? 'opacity-0' : 'opacity-100'}`}
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : loading}
        priority={priority}
      />
      {secondary ? (
        <Image
          src={secondary}
          alt=""
          fill
          className={`absolute inset-0 ${baseImg} ${dim} ${showSecond ? 'opacity-100' : 'opacity-0'}`}
          sizes={sizes}
          quality={quality}
          loading={loading}
          aria-hidden
        />
      ) : null}
      {children}
    </div>
  );
}
