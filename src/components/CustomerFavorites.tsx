'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';

export default function CustomerFavorites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Get first 9 products (or all if less than 9)
        const allProducts = data.products || [];
        // For now, we'll use the first 9 products as "bestsellers"
        // Later, you can add a "bestseller" field to the database
        setProducts(allProducts.slice(0, 9));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 
          className="text-5xl font-light text-gray-800 mb-6"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Customer Favorites
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our most loved pieces, handpicked by our community
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <div className="inline-block w-8 h-8 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Loading favorites...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                    loading="lazy"
                    quality={75}
                  />
                  
                  {/* Bestseller Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="bg-[color:var(--logo-pink)] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)',
                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
                      }}
                    >
                      Bestseller
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-700 capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-[color:var(--logo-pink)] transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p 
                      className="text-xl font-semibold"
                      style={{ color: 'var(--logo-pink)' }}
                    >
                      ${product.price}
                    </p>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-[color:var(--logo-pink)] transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, var(--logo-pink) 0%, #ec4899 100%)',
                boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
              }}
            >
              Shop All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}








