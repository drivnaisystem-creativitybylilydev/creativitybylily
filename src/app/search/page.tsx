'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/supabase/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setProducts(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-light text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
              />
              <button
                type="submit"
                className="bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : query ? (
          products.length > 0 ? (
            <>
              <p className="text-gray-600 mb-8">
                Found {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative aspect-square w-full bg-gray-100">
                      <Image
                        src={product.image_url || '/placeholder.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 capitalize">{product.category}</p>
                      <p className="text-xl font-bold text-[color:var(--logo-pink)]">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">We couldn't find any products matching "{query}"</p>
              <Link
                href="/products"
                className="inline-block bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Browse All Products
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start Searching</h2>
            <p className="text-gray-600 mb-6">Enter a search term above to find products</p>
            <Link
              href="/products"
              className="inline-block bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8f5] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-12 h-12 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

