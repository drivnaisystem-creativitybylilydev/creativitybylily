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
 * Swaps to a second product image on hover when `images` includes another URL.
 * Uses z-index + visibility so the hidden layer never bleeds through during transitions.
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

  /* No opacity transition — instant swap avoids two semi-transparent layers bleeding together */
  const imgBase =
    'absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]';
  const dim = dimmed ? 'opacity-60' : '';

  if (!primary) {
    return <div className={containerClassName} aria-hidden />;
  }

  return (
    <div
      className={['isolate', containerClassName].filter(Boolean).join(' ')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={primary}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : loading}
        priority={priority}
        className={`${imgBase} ${dim} ${
          showSecond
            ? 'z-[1] opacity-0 invisible pointer-events-none'
            : 'z-[2] opacity-100 visible'
        }`}
      />
      {secondary ? (
        <Image
          src={secondary}
          alt=""
          fill
          sizes={sizes}
          quality={quality}
          loading={loading}
          aria-hidden
          className={`${imgBase} ${dim} ${
            showSecond
              ? 'z-[2] opacity-100 visible'
              : 'z-[1] opacity-0 invisible pointer-events-none'
          }`}
        />
      ) : null}
      {children}
    </div>
  );
}
