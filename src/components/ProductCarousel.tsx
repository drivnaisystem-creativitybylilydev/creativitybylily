'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';

export default function ProductCarousel() {
  const [activeCategory, setActiveCategory] = useState('bracelets');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Bracelets', key: 'bracelets', description: 'Stackable and statement pieces for every wrist' },
    { name: 'Necklaces', key: 'necklaces', description: 'Elegant pieces to complete your look' },
    { name: 'Earrings', key: 'earrings', description: 'From dangle to stud, find your perfect pair' },
  ];

  const getCategoryProducts = (categoryKey: string, limit: number) => {
    return products.filter(p => p.category === categoryKey).slice(0, limit);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="font-serif text-5xl font-light text-gray-800 mb-6">
          Our Collection
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover our carefully curated selection of handcrafted jewelry,
          each piece designed to bring a touch of coastal elegance to your style.
        </p>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm ${
                activeCategory === category.key
                  ? 'bg-[color:var(--logo-pink)] text-white'
                  : 'bg-stone-100 text-[color:var(--logo-pink)] hover:bg-stone-200'
              }`}
            >
              {category.name} ({getCategoryProducts(category.key, products.length).length})
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Content */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        {categories.map((category) => (
          activeCategory === category.key && (
            <div key={category.key} className="animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div>
                  <h3 className="font-serif text-3xl text-gray-800 mb-2">{category.name} Collection</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <Link
                  href={`/products?category=${category.key}`}
                  className="bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl mt-4 md:mt-0"
                >
                  Shop {category.name}
                </Link>
              </div>
              
              {/* Clean Collage Grid */}
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading products...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {getCategoryProducts(category.key, 5).map((product, index) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-sm">
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          quality={75}
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm text-gray-800 line-clamp-2">{product.title}</h4>
                      <p className="text-sm text-[color:var(--logo-pink)] font-semibold">${product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}







