import Link from 'next/link';
import AboutUsStoryCarousel from '@/components/AboutUsStoryCarousel';
import { CoastalBackdropLayers } from '@/components/CoastalBackdrop';

/**
 * Home: teaser copy + cropped carousel; full story lives at /about.
 */
export default function AboutUsSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-y border-stone-200/60 py-20 scroll-mt-24 md:scroll-mt-28 lg:py-24"
      aria-labelledby="our-story-heading"
    >
      <CoastalBackdropLayers />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid min-h-0 grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-20">
          <div
            className="min-h-0 space-y-6 rounded-3xl border border-stone-200/70 p-8 text-left shadow-lg backdrop-blur-[2px] sm:space-y-8 sm:p-10 lg:min-w-0 lg:p-12"
            style={{
              backgroundColor: 'rgba(247, 240, 232, 0.92)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 10px 24px -8px rgba(90, 60, 40, 0.08)',
            }}
          >
            <div>
              <p
                className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--logo-pink)]"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                About us
              </p>
              <h2
                id="our-story-heading"
                className="text-4xl font-light leading-tight text-gray-800 sm:text-5xl"
                style={{ fontFamily: 'var(--font-script)' }}
              >
                Our story
              </h2>
              <div
                className="mt-4 h-px w-24 rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--logo-pink), transparent)' }}
                aria-hidden
              />
            </div>

            {/* Teaser: not the full story */}
            <div className="relative">
              <div className="space-y-4 text-base leading-[1.75] text-gray-700 sm:text-lg">
                <p>
                  Creativity By Lily Co was founded when Lily was just 13 during COVID, turning her lifelong dream of
                  owning a business into something real.
                </p>
                <p className="text-gray-700/95">
                  Growing up with sensitive skin, she struggled to find jewelry she could wear comfortably — which led
                  to hypoallergenic pieces inspired by the Cape…
                </p>
              </div>
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(247,240,232,0.98)] via-[rgba(247,240,232,0.85)] to-transparent"
                aria-hidden
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--logo-pink)] px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:px-8 sm:text-base"
              >
                Read our full story
              </Link>
              <Link
                href="/about#gallery"
                className="text-center text-sm font-medium text-[color:var(--logo-pink)] underline-offset-4 transition-opacity hover:opacity-80 hover:underline sm:text-left sm:text-base"
              >
                View photo gallery →
              </Link>
            </div>
          </div>

          <div className="flex min-h-0 w-full min-w-0 flex-col">
            <AboutUsStoryCarousel variant="teaser" />
          </div>
        </div>
      </div>
    </section>
  );
}
