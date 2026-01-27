'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import type { Review } from '@/lib/supabase/types';

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export default function ReviewsList({ productId, refreshTrigger = 0 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, refreshTrigger]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reviews?product_id=${productId}&sort=${sortBy}&limit=50`
      );
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {stats && stats.total_reviews > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {stats.average_rating.toFixed(1)}
              </div>
              <StarRating rating={stats.average_rating} size="lg" />
              <p className="text-gray-600 mt-2">
                Based on {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution] || 0;
                const percentage = stats.total_reviews > 0
                  ? (count / stats.total_reviews) * 100
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-12">
                      {rating} star{rating !== 1 && 's'}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            Customer Reviews ({reviews.length})
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your thoughts about this product
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--logo-pink)] to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.reviewer_name}
                        </h4>
                        {review.verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 className="font-semibold text-gray-900 text-lg mb-2">
                  {review.title}
                </h5>
              )}

              {/* Review Comment */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Admin Response */}
              {review.admin_response && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[color:var(--logo-pink)]">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Response from Creativity by Lily
                  </p>
                  <p className="text-sm text-gray-700">
                    {review.admin_response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
