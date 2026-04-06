import { Link } from '@/i18n/navigation';
import AboutUsStoryCarousel from '@/components/AboutUsStoryCarousel';
import { OurStoryContent } from '@/components/OurStoryContent';

export const metadata = {
  title: 'Our Story | Creativity by Lily',
  description: 'The story behind Creativity By Lily Co — coastal-inspired, hypoallergenic jewelry.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p
            className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--logo-pink)]"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            About us
          </p>
          <h1 className="mb-4 font-serif text-5xl font-light text-gray-900">Our story</h1>
          <p className="text-lg text-gray-600">
            Hypoallergenic jewelry inspired by Cape Cod — made to be lived in.
          </p>
        </div>

        {/* Text + gallery side by side on large screens */}
        <div className="grid min-h-0 grid-cols-1 gap-10 lg:grid-cols-2 lg:grid-rows-1 lg:items-stretch lg:gap-12">
          <div className="min-h-0 rounded-2xl bg-white p-8 shadow-sm sm:p-10 lg:h-full lg:min-h-0">
            <OurStoryContent />
          </div>

          <div
            id="gallery"
            className="flex min-h-0 flex-col lg:h-full lg:min-h-0"
            aria-label="Photo gallery"
          >
            <AboutUsStoryCarousel variant="full" fillColumn />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--logo-pink)] transition-opacity hover:opacity-80"
          >
            <span aria-hidden>←</span> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
