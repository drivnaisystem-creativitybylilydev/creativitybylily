import AboutUsStoryCarousel from '@/components/AboutUsStoryCarousel';
import { CoastalBackdropLayers } from '@/components/CoastalBackdrop';

/**
 * Founder story — wording is fixed; punctuation and layout only are edited for readability.
 */
export default function AboutUsSection() {
  return (
    <section
      id="about"
      className="relative py-20 lg:py-24 border-y border-stone-200/60 scroll-mt-24 md:scroll-mt-28 overflow-hidden"
      aria-labelledby="our-story-heading"
    >
      <CoastalBackdropLayers />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Grid: one row on lg — row height = taller column; carousel column stretches to match text */}
        <div className="grid min-h-0 grid-cols-1 gap-14 lg:grid-cols-2 lg:grid-rows-1 lg:items-stretch lg:gap-16 xl:gap-20">
          {/* Story left / top; carousel right / below on small screens */}
          <div
            className="min-h-0 space-y-8 text-left rounded-3xl border border-stone-200/70 shadow-lg p-8 sm:p-10 lg:p-12 backdrop-blur-[2px] lg:min-w-0"
            style={{
              backgroundColor: 'rgba(247, 240, 232, 0.92)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 10px 24px -8px rgba(90, 60, 40, 0.08)',
            }}
          >
            <div>
              <p
                className="text-sm uppercase tracking-[0.2em] text-[color:var(--logo-pink)] font-medium mb-3"
                style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
              >
                About us
              </p>
              <h2
                id="our-story-heading"
                className="text-4xl sm:text-5xl font-light text-gray-800 leading-tight"
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

            <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-[1.75]">
              <p>
                Creativity By Lily Co was founded when Lily was just 13 during COVID, turning her lifelong dream of
                owning a business into something real.
              </p>
              <p>
                Growing up with sensitive skin, she struggled to find jewelry she could wear comfortably, which
                inspired her to create pieces that are both hypoallergenic and made for everyday wear.
              </p>
              <p>
                Deeply inspired by the beauty of the Cape, the ocean, the calm, and the effortless coastal lifestyle,
                each piece is designed to reflect that same feeling.
              </p>
            </div>

            <blockquote
              className="relative pl-5 sm:pl-6 border-l-[3px] border-[color:var(--logo-pink)]/70 py-1 my-2"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              <p className="text-lg sm:text-xl text-gray-800 italic font-light leading-relaxed tracking-wide">
                Timeless, water-resistant, and meant to be lived in.
              </p>
            </blockquote>

            <div className="space-y-5 text-gray-700 text-base sm:text-lg leading-[1.75]">
              <p>
                What began as a small idea has grown into something so meaningful, and every order truly means the
                world.
              </p>
            </div>

            <blockquote
              className="relative pl-5 sm:pl-6 border-l-[3px] border-[color:var(--logo-pink)]/70 py-1 my-2"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              <p className="text-lg sm:text-xl text-gray-800 italic font-light leading-relaxed tracking-wide">
                Thank you for visiting and supporting her dream—it wouldn&apos;t be possible without you.
              </p>
            </blockquote>
          </div>

          <div className="flex min-h-0 w-full min-w-0 flex-col lg:h-full">
            <AboutUsStoryCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
