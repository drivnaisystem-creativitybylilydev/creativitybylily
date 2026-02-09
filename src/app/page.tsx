import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";

const DynamicProductCarousel = dynamic(() => import("@/components/ProductCarousel"), { ssr: true });
const DynamicCustomerFavorites = dynamic(() => import("@/components/CustomerFavorites"), { ssr: true });
const DynamicFeaturedEvents = dynamic(() => import("@/components/FeaturedEvents"), { ssr: true });

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-light text-gray-800 mb-8">
            Handmade with Love
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Creativity by Lily is more than just jewelry—it's a celebration of coastal beauty, 
            personal expression, and the joy of handmade craftsmanship. Each piece is designed 
            and created on Cape Cod, inspired by the natural beauty that surrounds us.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--soft-pink)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-800">Handcrafted</h3>
              <p className="text-gray-600">Each piece is carefully made by hand with attention to detail</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--soft-pink)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-800">Hypoallergenic</h3>
              <p className="text-gray-600">Safe for sensitive skin with waterproof materials</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--soft-pink)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-800">Cape Cod Made</h3>
              <p className="text-gray-600">Inspired by and created in the beauty of Cape Cod</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Favorites Section - lazy loaded */}
      <section className="py-20 bg-[#faf8f5]">
        <Suspense fallback={null}>
          <DynamicCustomerFavorites />
        </Suspense>
      </section>

      {/* Featured Events Section - lazy loaded */}
      <Suspense fallback={null}>
        <DynamicFeaturedEvents />
      </Suspense>

      {/* Product Carousel Section - lazy loaded */}
      <section className="py-20" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <DynamicProductCarousel />
      </section>

      {/* Contact anchor - Footer is handled by layout */}
      <section id="contact" className="py-16" style={{ backgroundColor: 'var(--soft-pink)' }}>
        {/* Contact section content can be added here if needed */}
      </section>
    </div>
  );
}
