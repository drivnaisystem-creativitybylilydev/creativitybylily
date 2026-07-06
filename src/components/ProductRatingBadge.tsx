'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface RatingStats {
  average_rating: number;
  total_reviews: number;
}

interface ProductRatingBadgeProps {
  productId: string;
  compact?: boolean;
  /**
   * When provided (even as null while a parent batch-fetch is in flight), this component
   * renders from it instead of firing its own /api/reviews call. Pass this on any page
   * rendering many cards at once — see the products listing page for the batch fetch.
   */
  stats?: RatingStats | null;
}

export default function ProductRatingBadge({ productId, compact = false, stats: controlledStats }: ProductRatingBadgeProps) {
  const isControlled = controlledStats !== undefined;
  const [stats, setStats] = useState<RatingStats | null>(isControlled ? controlledStats ?? null : null);
  const [loading, setLoading] = useState(!isControlled);

  useEffect(() => {
    if (isControlled) {
      setStats(controlledStats ?? null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/reviews?product_id=${productId}&limit=1`);
        const data = await response.json();
        if (!cancelled && response.ok && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching product rating:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, isControlled, controlledStats]);

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
