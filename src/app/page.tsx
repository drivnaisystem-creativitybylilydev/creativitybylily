import Image from "next/image";
import Link from "next/link";
import { products, galleryItems } from "@/data/gallery";
import { Suspense } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import ProductSpotlight from "@/components/ProductSpotlight";
import CustomerFavorites from "@/components/CustomerFavorites";
import FeaturedEvents from "@/components/FeaturedEvents";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Product Image Collage Background - Optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-amber-50">
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 gap-2 p-4 opacity-20">
            {(() => {
              // Shuffle gallery items for randomization on each load
              const shuffled = [...galleryItems].sort(() => Math.random() - 0.5);
              return shuffled.slice(0, 12).map((item, index) => (
                <div 
                  key={`${item.src}-${index}`} 
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    index % 3 === 0 ? 'rotate-3' : 
                    index % 3 === 1 ? '-rotate-2' : 'rotate-1'
                  }`}
                  style={{
                    gridColumn: index % 4 === 0 ? 'span 2' : 'span 1',
                    gridRow: index % 4 === 0 ? 'span 2' : 'span 1',
                  }}
                >
                  <Image 
                    src={item.src} 
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 16vw"
                    loading="lazy"
                    quality={50}
                  />
                </div>
              ));
            })()}
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                  <h1 className="text-6xl md:text-8xl font-light leading-tight mb-8" style={{ fontFamily: 'var(--font-script)' }}>
                    <span className="block text-gray-800 drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Handcrafted
                    </span>
                    <span className="block text-[color:var(--logo-pink)] font-normal -mt-10" style={{ 
                      textShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
                      background: 'linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Jewelry
                    </span>
                    <span className="block text-2xl md:text-3xl font-normal text-gray-700 -mt-2" style={{ 
                      textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      letterSpacing: '0.02em'
                    }}>
                      from Cape Cod
                    </span>
          </h1>
                  <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-light" style={{ 
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    letterSpacing: '0.02em'
                  }}>
            Each piece is thoughtfully designed and handcrafted with love, 
            bringing you waterproof and hypoallergenic jewelry that celebrates 
            the beauty of coastal living.
          </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/products"
                      className="bg-[color:var(--logo-pink)] text-white px-10 py-5 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      style={{
                        background: 'linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)',
                        boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
                      }}
            >
              Shop Collection
            </Link>
            <Link 
              href="#about"
                      className="border-2 border-[color:var(--logo-pink)] text-[color:var(--logo-pink)] px-10 py-5 rounded-full font-medium hover:bg-[color:var(--logo-pink)] hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)'
                      }}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

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

      {/* Customer Favorites Section */}
      <section className="py-20 bg-[#faf8f5]">
        <CustomerFavorites />
      </section>

      {/* Featured Events Section - Moved Higher */}
      <Suspense fallback={null}>
        <FeaturedEvents />
      </Suspense>

      {/* Product Carousel Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <ProductCarousel />
      </section>

      {/* Contact anchor - Footer is handled by layout */}
      <section id="contact" className="py-16" style={{ backgroundColor: 'var(--soft-pink)' }}>
        {/* Contact section content can be added here if needed */}
      </section>
    </div>
  );
}
