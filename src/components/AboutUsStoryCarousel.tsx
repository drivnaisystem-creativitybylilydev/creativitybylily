'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ABOUT_CAROUSEL_FILES } from '@/lib/aboutCarousel';

/** Shown on the first slide only (overlay + richer alt text). */
export const ABOUT_FIRST_SLIDE_CAPTION = 'Lily Matthews - Founder and CEO';

/** How many empty slots to show when no files are configured yet */
const PLACEHOLDER_SLOT_COUNT = 4;

type Slide = { src: string | null; alt: string };

function buildSlides(): Slide[] {
  if (ABOUT_CAROUSEL_FILES.length > 0) {
    return ABOUT_CAROUSEL_FILES.map((file, i) => ({
      src: `/about-carousel/${file}`,
      alt:
        i === 0
          ? `${ABOUT_FIRST_SLIDE_CAPTION}, Creativity By Lily`
          : `About us photo ${i + 1}`,
    }));
  }
  return Array.from({ length: PLACEHOLDER_SLOT_COUNT }, (_, i) => ({
    src: null,
    alt: `Photo placeholder ${i + 1}`,
  }));
}

export type AboutUsStoryCarouselVariant = 'full' | 'teaser';

type Props = {
  /** `teaser`: cropped peek on the home page. `full`: full carousel on /about. */
  variant?: AboutUsStoryCarouselVariant;
  /** When true, carousel fills the grid cell height on large screens (e.g. /about two-column layout). */
  fillColumn?: boolean;
};

export default function AboutUsStoryCarousel({ variant = 'full', fillColumn = false }: Props) {
  const slides = buildSlides();
  const [index, setIndex] = useState(0);
  const isTeaser = variant === 'teaser';

  const len = Math.max(slides.length, 1);
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len);
    },
    [len]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => go(1), 5200);
    return () => clearInterval(t);
  }, [slides.length, go]);

  const active = slides[index] ?? slides[0];
  const isPlaceholder = !active?.src;
  const showFounderCaption = Boolean(active?.src && index === 0);

  const outerClass = isTeaser
    ? 'mx-auto flex h-full min-h-0 w-full min-w-0 max-w-xl flex-col lg:max-w-none lg:min-h-0'
    : fillColumn
      ? 'mx-auto flex h-full min-h-0 w-full min-w-0 max-w-lg flex-col sm:max-w-none'
      : 'mx-auto flex w-full min-w-0 max-w-lg flex-col sm:max-w-xl';

  /* Teaser: on lg+, flex column fills grid cell. Full + fillColumn: same for /about layout. */
  const frameClass = isTeaser
    ? `relative w-full min-h-[17.5rem] overflow-hidden rounded-[2rem] bg-stone-100 transition-shadow duration-500 shadow-lg ring-1 ring-black/5 aspect-[4/5] sm:min-h-[20rem] lg:aspect-auto lg:h-full lg:min-h-0 lg:flex-1 ${
        isPlaceholder ? 'ring-2 ring-[color:var(--logo-pink)]/45' : ''
      }`
    : fillColumn
      ? `relative w-full min-h-[20rem] overflow-hidden rounded-[2rem] bg-stone-100 transition-shadow duration-500 shadow-xl ring-1 ring-black/5 aspect-[4/5] sm:min-h-[22rem] lg:aspect-auto lg:h-full lg:min-h-0 lg:max-h-none lg:flex-1 ${
          isPlaceholder ? 'ring-2 ring-[color:var(--logo-pink)]/45' : ''
        }`
      : `relative w-full overflow-hidden rounded-[2rem] bg-stone-100 transition-shadow duration-500 aspect-[4/5] max-h-[min(85vh,40rem)] ${
          isPlaceholder ? 'ring-2 ring-[color:var(--logo-pink)]/45' : 'shadow-xl ring-1 ring-black/5'
        }`;

  const frameStyle = isPlaceholder
    ? {
        boxShadow:
          '0 0 0 1px rgba(255, 114, 166, 0.35), 0 0 28px 10px rgba(255, 114, 166, 0.22), 0 0 48px 14px rgba(255, 180, 205, 0.18), 0 20px 40px -12px rgba(0,0,0,0.1)',
      }
    : isTeaser
      ? { boxShadow: '0 12px 28px -8px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,114,166,0.08)' }
      : { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,114,166,0.08)' };

  return (
    <div className={outerClass}>
      <div className={frameClass} style={frameStyle}>
        <div className="about-carousel-fade absolute inset-0" key={index}>
          {active?.src ? (
            <>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-cover"
                sizes={
                  isTeaser
                    ? '(max-width: 1024px) 100vw, 45vw'
                    : fillColumn
                      ? '(max-width: 1024px) 100vw, 50vw'
                      : '(max-width: 640px) 100vw, 480px'
                }
                priority={index === 0}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(45,45,45,0.5) 0%, transparent 55%), linear-gradient(135deg, rgba(255,114,166,0.12) 0%, transparent 45%)',
                }}
              />
              {isTeaser && (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
                  aria-hidden
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-50 to-stone-200/60 px-8">
              <span className="sr-only">{active?.alt}</span>
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300/90 bg-white/40"
                aria-hidden
              >
                <svg className="h-9 w-9 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.25}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-center text-sm font-medium tracking-wide text-stone-400">Image {index + 1}</p>
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-stone-600 shadow-md transition-colors hover:border-[color:var(--logo-pink)]/30 hover:text-[color:var(--logo-pink)] sm:left-3 sm:h-10 sm:w-10"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200/80 bg-white/90 text-stone-600 shadow-md transition-colors hover:border-[color:var(--logo-pink)]/30 hover:text-[color:var(--logo-pink)] sm:right-3 sm:h-10 sm:w-10"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {showFounderCaption && (
          <div className="pointer-events-none absolute bottom-12 left-0 right-0 z-[18] px-4 sm:bottom-14">
            <p
              className="text-center text-sm font-semibold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-base"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {ABOUT_FIRST_SLIDE_CAPTION}
            </p>
          </div>
        )}

        {slides.length > 1 && (
          <div className="pointer-events-auto absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 px-4">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-[color:var(--logo-pink)]' : 'w-2 bg-white/90 ring-1 ring-stone-300/80 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile: single CTA below teaser carousel (desktop uses button in text column) */}
      {isTeaser && (
        <div className="mt-5 flex justify-center sm:mt-6 lg:hidden">
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--logo-pink)] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:px-8 sm:py-3 sm:text-base"
          >
            Read our full story
          </Link>
        </div>
      )}
    </div>
  );
}
