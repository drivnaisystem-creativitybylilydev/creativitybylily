'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: string;
  title: string;
  image_url: string;
  category: string;
  price: number;
}

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setShowResults(false);
        setSearchQuery('');
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  // Search products with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsExpanded(false);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = () => {
    setIsExpanded(false);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <div ref={searchContainerRef} className="relative">
      {/* Search Icon / Collapsed State */}
      {!isExpanded && (
        <button
          onClick={handleExpand}
          className="text-[color:var(--logo-pink)] hover:opacity-80 transition-opacity p-2"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}

      {/* Expanded Search Bar */}
      {isExpanded && (
        <div className="absolute right-0 top-0 z-50 w-80 md:w-96">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-white rounded-lg shadow-xl border-2 border-[color:var(--logo-pink)] overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 bg-[color:var(--logo-pink)] text-white hover:opacity-90 transition-opacity"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Close search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="border-t border-gray-200 max-h-96 overflow-y-auto bg-white">
                  {results.length > 0 ? (
                    <div className="py-2">
                      {results.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={product.image_url || '/placeholder.jpg'}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product.title}</p>
                            <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                            <p className="text-sm font-semibold text-[color:var(--logo-pink)]">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                      {results.length > 5 && (
                        <div className="px-3 py-2 border-t border-gray-200">
                          <button
                            type="submit"
                            className="text-sm text-[color:var(--logo-pink)] hover:opacity-80 font-medium w-full text-left"
                          >
                            View all {results.length} results →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : searchQuery.trim() && !isSearching ? (
                    <div className="p-6 text-center text-gray-500">
                      <p>No products found</p>
                      <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

