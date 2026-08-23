'use client';

import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { sunhoneySectionHeadingClass } from '@/lib/productDisplayStyle';

type FeaturedReview = {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  verified_purchase: boolean;
  products: { title: string; slug: string } | null;
};

/**
 * Featured (admin-curated) reviews, shown as a horizontal scroll of quote cards.
 * Reused on the /paused idle screen and, once the store reopens, on the homepage.
 */
export default function FeaturedReviewsStrip({ heading = 'What customers are saying' }: { heading?: string }) {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews/featured?limit=80')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setReviews(data.reviews || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <h2 className={`mb-2 text-center text-2xl sm:text-3xl md:text-4xl ${sunhoneySectionHeadingClass}`}>
        {heading}
      </h2>
      <p className="mb-8 text-center text-sm text-[color:var(--text-muted)] sm:mb-10">
        Loved by 600+ happy customers
      </p>

      {loading ? (
        <div className="flex gap-5 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 w-72 shrink-0 animate-pulse rounded-2xl bg-stone-100 sm:w-80" />
          ))}
        </div>
      ) : (
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="w-72 shrink-0 snap-start rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:w-80"
            >
              <StarRating rating={review.rating} size="sm" />
              {review.title && (
                <p className="mt-3 font-serif text-base text-gray-800">{review.title}</p>
              )}
              <blockquote className="mt-2 line-clamp-5 text-sm leading-relaxed text-[color:var(--text-muted)]">
                &ldquo;{review.comment}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  {review.reviewer_name}
                  {review.verified_purchase && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                      Verified
                    </span>
                  )}
                </span>
                {review.products && (
                  <span className="truncate pl-2 text-[color:var(--sunhoney-pink)]">{review.products.title}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
