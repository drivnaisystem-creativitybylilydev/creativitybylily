import Link from 'next/link';
import AboutUsStoryCarousel from '@/components/AboutUsStoryCarousel';
import { OurStoryContent } from '@/components/OurStoryContent';

export const metadata = {
  title: 'Our Story | Creativity by Lily',
  description: 'The story behind Creativity By Lily Co — coastal-inspired, hypoallergenic jewelry.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="mx-auto max-w-4xl px-6">
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

        <div className="mb-10 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <OurStoryContent />
        </div>

        <div id="gallery" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <h2 className="mb-2 text-center font-serif text-2xl font-light text-gray-900 sm:mb-6">Gallery</h2>
          <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
            A glimpse behind Creativity By Lily Co.
          </p>
          <AboutUsStoryCarousel variant="full" />
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
