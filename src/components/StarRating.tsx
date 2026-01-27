'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const sizeClass = sizes[size];

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isPartial = index === Math.floor(rating) && rating % 1 !== 0;
          const partialPercent = isPartial ? (rating % 1) * 100 : 0;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              onClick={() => handleClick(index)}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
              disabled={!interactive}
              aria-label={`Rate ${index + 1} out of ${maxRating} stars`}
            >
              {isPartial ? (
                <div className="relative">
                  {/* Background (empty star) */}
                  <Star
                    className={`${sizeClass} text-gray-300`}
                    fill="none"
                    strokeWidth={1.5}
                  />
                  {/* Foreground (partial fill) */}
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${partialPercent}%` }}
                  >
                    <Star
                      className={`${sizeClass} text-yellow-400`}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${sizeClass} ${
                    isFilled
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  strokeWidth={1.5}
                />
              )}
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

/**
 * Star Rating Input Component (for forms)
 */
interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
  required?: boolean;
}

export function StarRatingInput({ value, onChange, error, required }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your Rating {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${rating} out of 5 stars`}
            >
              <Star
                className={`w-8 h-8 ${
                  rating <= (hoverRating || value)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        {value > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {value} out of 5
          </span>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
