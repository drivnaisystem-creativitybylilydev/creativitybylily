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

      {/* Product Carousel Section */}
      <section className="py-20 bg-[#faf8f5]">
        <ProductCarousel />
      </section>

      {/* Featured Events Section */}
      <Suspense fallback={null}>
        <FeaturedEvents />
      </Suspense>

      {/* Footer */}
      <footer id="contact" className="py-16" style={{ backgroundColor: 'var(--soft-pink)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-serif text-2xl text-[color:var(--logo-pink)] mb-4">Creativity by Lily</h3>
              <p className="text-gray-600 leading-relaxed">
                Handcrafted jewelry inspired by the beauty of Cape Cod. 
                Each piece is made with love and attention to detail.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors">Shop</Link></li>
                <li><Link href="#about" className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors">About</Link></li>
                <li><Link href="#contact" className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-800">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/creativitybylily.co/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#" 
                  className="text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-17v10l8-5-8-5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-pink-200 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Creativity by Lily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
