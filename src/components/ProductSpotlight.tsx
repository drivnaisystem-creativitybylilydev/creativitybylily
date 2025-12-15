'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  badge?: 'Bestseller' | 'New' | 'Limited' | 'Back in Stock';
  imageSrc: string;
  imageAlt?: string;
  href: string;
};

export default function ProductSpotlight({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  // Intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('product-spotlight');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const currentProduct = products[currentIndex];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Limited':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Back in Stock':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section 
      id="product-spotlight"
      className="py-20 bg-gradient-to-br from-[#faf8f5] to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            className="text-5xl md:text-6xl font-light mb-6"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Featured Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Handpicked pieces that capture the essence of coastal elegance
          </p>
          
          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 border-2 border-white flex items-center justify-center text-xs font-semibold text-pink-700"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>500+ happy customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Main Product Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl">
              <Image
                src={currentProduct.imageSrc}
                alt={currentProduct.imageAlt || currentProduct.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Badge */}
              {currentProduct.badge && (
                <div className="absolute top-6 left-6">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getBadgeColor(currentProduct.badge)}`}>
                    {currentProduct.badge}
                  </span>
                </div>
              )}

              {/* Scarcity Indicator */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  Only {Math.floor(Math.random() * 5) + 1} left
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-3 mt-6">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                    index === currentIndex 
                      ? 'ring-2 ring-[color:var(--logo-pink)] scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt || product.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h3 className="text-3xl md:text-4xl font-light text-gray-800 mb-2">
                  {currentProduct.title}
                </h3>
                {currentProduct.subtitle && (
                  <p className="text-lg text-gray-600">{currentProduct.subtitle}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-[color:var(--logo-pink)]">
                  ${currentProduct.price}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${currentProduct.compareAtPrice}
                  </span>
                )}
                {currentProduct.compareAtPrice && (
                  <span className="text-sm font-medium text-green-600">
                    Save ${currentProduct.compareAtPrice - currentProduct.price}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Waterproof & Hypoallergenic</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Handcrafted on Cape Cod</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={currentProduct.href}
                  className="flex-1 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  View Details
                </Link>
                <Link
                  href="/products"
                  className="flex-1 border-2 border-[color:var(--logo-pink)] text-[color:var(--logo-pink)] px-8 py-4 rounded-full font-medium hover:bg-[color:var(--logo-pink)] hover:text-white transition-all duration-300 text-center"
                >
                  Shop All
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-light text-gray-800 mb-4">
              Discover More Handcrafted Treasures
            </h3>
            <p className="text-gray-600 mb-6">
              Each piece tells a story of coastal beauty and artisanal craftsmanship
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Full Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}














