'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowForm(false);
  };

  return (
    <div className="mt-20 space-y-12">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-light text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Hear what our customers have to say about this product
        </p>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div>
          <ReviewForm 
            productId={productId} 
            onSuccess={handleReviewSubmitted}
          />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 text-gray-600 hover:text-gray-900 text-sm font-medium underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Reviews List */}
      <ReviewsList productId={productId} refreshTrigger={refreshTrigger} />
    </div>
  );
}
