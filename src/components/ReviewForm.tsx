'use client';

import { useState } from 'react';
import { StarRatingInput } from './StarRating';

interface ReviewFormProps {
  productId: string;
  orderId?: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 0,
    title: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reviewer_name.trim()) {
      newErrors.reviewer_name = 'Name is required';
    }

    if (!formData.reviewer_email.trim()) {
      newErrors.reviewer_email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.reviewer_email)) {
        newErrors.reviewer_email = 'Please enter a valid email address';
      }
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Review is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          order_id: orderId,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsSuccess(true);
      
      // Reset form
      setFormData({
        reviewer_name: '',
        reviewer_email: '',
        rating: 0,
        title: '',
        comment: ''
      });

      if (onSuccess) {
        onSuccess();
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Thank You for Your Review!
        </h3>
        <p className="text-gray-600">
          Your review has been submitted and will appear after moderation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Write a Review
        </h3>
        <p className="text-gray-600">
          Share your thoughts with other customers
        </p>
      </div>

      {/* Star Rating */}
      <StarRatingInput
        value={formData.rating}
        onChange={(rating) => setFormData({ ...formData, rating })}
        error={errors.rating}
        required
      />

      {/* Name */}
      <div>
        <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="reviewer_name"
          value={formData.reviewer_name}
          onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.reviewer_name ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent`}
          placeholder="John Doe"
        />
        {errors.reviewer_name && (
          <p className="mt-1 text-sm text-red-600">{errors.reviewer_name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reviewer_email" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="reviewer_email"
          value={formData.reviewer_email}
          onChange={(e) => setFormData({ ...formData, reviewer_email: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.reviewer_email ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent`}
          placeholder="john@example.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          Your email will not be published
        </p>
        {errors.reviewer_email && (
          <p className="mt-1 text-sm text-red-600">{errors.reviewer_email}</p>
        )}
      </div>

      {/* Review Title (Optional) */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent"
          placeholder="Sum up your experience in a few words"
        />
      </div>

      {/* Review Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          rows={5}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.comment ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-transparent resize-none`}
          placeholder="Tell us what you think about this product..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment ? (
            <p className="text-sm text-red-600">{errors.comment}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Minimum 10 characters
            </p>
          )}
          <p className="text-sm text-gray-400">
            {formData.comment.length} characters
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[color:var(--logo-pink)] text-white py-4 px-6 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting a review, you agree that it may be displayed on this website
      </p>
    </form>
  );
}
