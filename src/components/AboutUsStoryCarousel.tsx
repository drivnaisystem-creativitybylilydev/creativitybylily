'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Add image files under `public/about-carousel/` and list filenames here in slide order.
 * While this stays empty, the carousel shows blank placeholder slots (same frame & controls).
 *
 * @example ['1.webp', '2.jpg', 'behind-the-scenes.webp']
 */
const ABOUT_CAROUSEL_FILES: readonly string[] = [];

/** How many empty slots to show when no files are configured yet */
const PLACEHOLDER_SLOT_COUNT = 4;

type Slide = { src: string | null; alt: string };

function buildSlides(): Slide[] {
  if (ABOUT_CAROUSEL_FILES.length > 0) {
    return ABOUT_CAROUSEL_FILES.map((file, i) => ({
      src: `/about-carousel/${file}`,
      alt: `About us photo ${i + 1}`,
    }));
  }
  return Array.from({ length: PLACEHOLDER_SLOT_COUNT }, (_, i) => ({
    src: null,
    alt: `Photo placeholder ${i + 1}`,
  }));
}

export default function AboutUsStoryCarousel() {
  const slides = buildSlides();
  const [index, setIndex] = useState(0);

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

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl min-w-0 flex-col lg:h-full lg:min-h-0 lg:flex-1 lg:max-w-none">
      {/*
        Mobile: aspect-ratio gives height (slides are absolute).
        lg: parent grid cell has real height — frame uses flex-1 + h-full to match text column.
      */}
      <div
        className={`relative w-full min-h-[17.5rem] max-h-[85vh] overflow-hidden rounded-[2rem] bg-stone-100 transition-shadow duration-500 sm:min-h-[20rem] aspect-[4/5] lg:aspect-auto lg:max-h-none lg:h-full lg:min-h-0 lg:flex-1 ${
          isPlaceholder
            ? 'ring-2 ring-[color:var(--logo-pink)]/45'
            : 'shadow-xl ring-1 ring-black/5'
        }`}
        style={
          isPlaceholder
            ? {
                boxShadow:
                  '0 0 0 1px rgba(255, 114, 166, 0.35), 0 0 28px 10px rgba(255, 114, 166, 0.22), 0 0 48px 14px rgba(255, 180, 205, 0.18), 0 20px 40px -12px rgba(0,0,0,0.1)',
              }
            : {
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,114,166,0.08)',
              }
        }
      >
        <div className="absolute inset-0 about-carousel-fade" key={index}>
          {active?.src ? (
            <>
              <Image
                src={active.src}
                alt={active.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(45,45,45,0.35) 0%, transparent 45%), linear-gradient(135deg, rgba(255,114,166,0.12) 0%, transparent 50%)',
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 bg-gradient-to-br from-stone-50 to-stone-200/60">
              <span className="sr-only">{active?.alt}</span>
              <div
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-stone-300/90 flex items-center justify-center bg-white/40"
                aria-hidden
              >
                <svg
                  className="w-9 h-9 text-stone-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.25}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-stone-400 font-medium tracking-wide">Image {index + 1}</p>
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 shadow-md border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-[color:var(--logo-pink)] hover:border-[color:var(--logo-pink)]/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 shadow-md border border-stone-200/80 flex items-center justify-center text-stone-600 hover:text-[color:var(--logo-pink)] hover:border-[color:var(--logo-pink)]/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots inside frame so outer box matches beige panel height (no gap below image) */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2 pointer-events-auto px-4">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-[color:var(--logo-pink)]' : 'w-2 bg-white/90 ring-1 ring-stone-300/80 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
