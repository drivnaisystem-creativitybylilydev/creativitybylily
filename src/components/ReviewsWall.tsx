'use client';

import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { sunhoneySectionHeadingClass } from '@/lib/productDisplayStyle';

type WallReview = {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  verified_purchase: boolean;
  products: { title: string; slug: string } | null;
};

/**
 * Full-width "wall of reviews" — every approved review, flowing down in
 * columns, fading into the background at the bottom (there are more than
 * shown; the fade signals that without an infinite-scroll list).
 */
export default function ReviewsWall({ heading = 'Loved by our customers' }: { heading?: string }) {
  const [reviews, setReviews] = useState<WallReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews/featured?featuredOnly=false&limit=60')
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
    <div className="w-full px-4 py-10 sm:px-6 sm:py-12">
      <h2 className={`mb-2 text-center text-2xl sm:text-3xl md:text-4xl ${sunhoneySectionHeadingClass}`}>
        {heading}
      </h2>
      <p className="mb-10 text-center text-sm text-[color:var(--text-muted)] sm:mb-12">
        Loved by 600+ happy customers
      </p>

      {loading ? (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : (
        <div className="relative mx-auto max-h-[1400px] max-w-7xl overflow-hidden">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm"
              >
                <StarRating rating={review.rating} size="sm" />
                {review.title && <p className="mt-3 font-serif text-base text-gray-800">{review.title}</p>}
                <blockquote className="mt-2 text-sm leading-relaxed text-[color:var(--text-muted)]">
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

          {/* Fade the lowest reviews into the page background — signals "there's more" without infinite scroll. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/85 to-transparent" />
        </div>
      )}
    </div>
  );
}
