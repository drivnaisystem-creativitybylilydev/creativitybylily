'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { galleryItems } from '@/data/gallery';
import type { Product } from '@/lib/supabase/types';

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shellProduct, setShellProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch shell earrings product
  useEffect(() => {
    async function fetchShellProduct() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Find shell earrings product
        const shell = data.products?.find((p: Product) => 
          p.title.toLowerCase().includes('shell') && 
          p.category === 'earrings'
        );
        setShellProduct(shell || null);
      } catch (error) {
        console.error('Error fetching shell product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchShellProduct();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2); // 2 slides total
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slide 1: Original Hero */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        {/* Product Image Collage Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-amber-50">
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 gap-2 p-4 opacity-20">
            {(() => {
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
      </div>

      {/* Slide 2: Shell Earrings Product Highlight */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-amber-50 to-pink-100">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, var(--logo-pink) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>

        {loading ? (
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : shellProduct ? (
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Product Image */}
              <div className="relative">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white p-8">
                  <Image
                    src={shellProduct.image_url}
                    alt={shellProduct.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    quality={90}
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[color:var(--logo-pink)] rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-2xl"></div>
              </div>

              {/* Product Info */}
              <div className="text-center md:text-left space-y-6">
                <div>
                  <span 
                    className="inline-block text-sm font-semibold text-[color:var(--logo-pink)] mb-3 tracking-wider uppercase"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    New Arrival
                  </span>
                  <h1 
                    className="text-5xl md:text-6xl font-light text-gray-800 mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-script)' }}
                  >
                    {shellProduct.title}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {shellProduct.description}
                  </p>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                  <span 
                    className="text-4xl font-semibold"
                    style={{ color: 'var(--logo-pink)' }}
                  >
                    ${shellProduct.price}
                  </span>
                  {shellProduct.compare_at_price && (
                    <span className="text-2xl text-gray-400 line-through">
                      ${shellProduct.compare_at_price}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/products/${shellProduct.slug}`}
                    className="bg-[color:var(--logo-pink)] text-white px-10 py-5 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)',
                      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
                    }}
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/products?category=earrings"
                    className="border-2 border-[color:var(--logo-pink)] text-[color:var(--logo-pink)] px-10 py-5 rounded-full font-medium hover:bg-[color:var(--logo-pink)] hover:text-white transition-all duration-300 transform hover:-translate-y-1 text-center"
                    style={{
                      boxShadow: '0 4px 15px rgba(236, 72, 153, 0.2)'
                    }}
                  >
                    View All Earrings
                  </Link>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[color:var(--soft-pink)] flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">Hypoallergenic</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[color:var(--soft-pink)] flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">Waterproof</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[color:var(--soft-pink)] flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6" style={{ color: 'var(--logo-pink)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">Handcrafted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center min-h-screen flex items-center justify-center">
            <div>
              <h1 className="text-5xl font-light text-gray-800 mb-4">Shell Earrings</h1>
              <p className="text-xl text-gray-600 mb-8">Product details coming soon...</p>
              <Link
                href="/products?category=earrings"
                className="inline-block bg-[color:var(--logo-pink)] text-white px-10 py-5 rounded-full font-medium hover:opacity-90 transition-all duration-300"
              >
                Shop Earrings
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        <button
          onClick={() => goToSlide(0)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === 0 
              ? 'bg-[color:var(--logo-pink)] w-8' 
              : 'bg-white/50 hover:bg-white/75'
          }`}
          aria-label="Go to slide 1"
        />
        <button
          onClick={() => goToSlide(1)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === 1 
              ? 'bg-[color:var(--logo-pink)] w-8' 
              : 'bg-white/50 hover:bg-white/75'
          }`}
          aria-label="Go to slide 2"
        />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + 2) % 2)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-gray-700 group-hover:text-[color:var(--logo-pink)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % 2)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg flex items-center justify-center group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-gray-700 group-hover:text-[color:var(--logo-pink)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}








