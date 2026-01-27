'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface ProductRatingBadgeProps {
  productId: string;
  compact?: boolean;
}

interface RatingStats {
  average_rating: number;
  total_reviews: number;
}

export default function ProductRatingBadge({ productId, compact = false }: ProductRatingBadgeProps) {
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRating();
  }, [productId]);

  const fetchRating = async () => {
    try {
      const response = await fetch(`/api/reviews?product_id=${productId}&limit=1`);
      const data = await response.json();
      
      if (response.ok && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching product rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats || stats.total_reviews === 0) {
    return null;
  }

  return (
    <div className={compact ? 'flex items-center gap-1' : 'flex items-center gap-2'}>
      <StarRating 
        rating={stats.average_rating} 
        size={compact ? 'sm' : 'md'}
        showNumber={false}
      />
      <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
        ({stats.total_reviews})
      </span>
    </div>
  );
}
