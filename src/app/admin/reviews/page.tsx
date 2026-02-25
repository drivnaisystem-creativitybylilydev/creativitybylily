'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StarRating from '@/components/StarRating';

interface ReviewWithProduct {
  id: string;
  product_id: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  title: string | null;
  comment: string;
  is_approved: boolean;
  is_featured: boolean;
  admin_response: string | null;
  verified_purchase: boolean;
  created_at: string;
  products: {
    id: string;
    title: string;
    slug: string;
    image_url: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<ReviewWithProduct | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews?status=${statusFilter}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_approved: !currentStatus
        }),
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleFeature = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_featured: !currentStatus
        }),
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error featuring review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews();
        if (selectedReview?.id === reviewId) {
          setSelectedReview(null);
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !adminResponse.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_response: adminResponse.trim()
        }),
      });

      if (response.ok) {
        setAdminResponse('');
        setSelectedReview(null);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCount = reviews.filter(r => !r.is_approved).length;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-600">
            Moderate customer reviews and respond to feedback
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
            {pendingCount} Pending Review{pendingCount !== 1 && 's'}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          {['all', 'pending', 'approved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`pb-3 px-2 font-medium capitalize transition-colors ${
                statusFilter === filter
                  ? 'text-[color:var(--logo-pink)] border-b-2 border-[color:var(--logo-pink)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter}
              {filter === 'pending' && pendingCount > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--logo-pink)]"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                <img
                  src={review.products.image_url}
                  alt={review.products.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <Link
                    href={`/products/${review.products.slug}`}
                    className="font-semibold text-gray-900 hover:text-[color:var(--logo-pink)]"
                  >
                    {review.products.title}
                  </Link>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                </div>
                {!review.is_approved && (
                  <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Pending
                  </span>
                )}
                {review.is_featured && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {review.reviewer_name}
                      </h4>
                      {review.verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{review.reviewer_email}</p>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>

                {review.title && (
                  <h5 className="font-semibold text-gray-900">{review.title}</h5>
                )}

                <p className="text-gray-700">{review.comment}</p>

                {review.admin_response && (
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[color:var(--logo-pink)]">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Your Response
                    </p>
                    <p className="text-sm text-gray-700">{review.admin_response}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(review.id, review.is_approved)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    review.is_approved
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {review.is_approved ? 'Unapprove' : 'Approve'}
                </button>

                <button
                  onClick={() => handleFeature(review.id, review.is_featured)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    review.is_featured
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {review.is_featured ? 'Unfeature' : 'Feature'}
                </button>

                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setAdminResponse(review.admin_response || '');
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  {review.admin_response ? 'Edit Response' : 'Respond'}
                </button>

                <button
                  onClick={() => handleDelete(review.id)}
                  className="px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Respond to Review
            </h3>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {selectedReview.reviewer_name}'s Review
              </p>
              <StarRating rating={selectedReview.rating} size="sm" />
              <p className="text-gray-700 mt-2">{selectedReview.comment}</p>
            </div>

            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Write your response..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent resize-none"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !adminResponse.trim()}
                className="flex-1 bg-[color:var(--logo-pink)] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setAdminResponse('');
                }}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
