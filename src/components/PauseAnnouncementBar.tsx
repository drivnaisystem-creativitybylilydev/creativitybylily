'use client';

import { useEffect, useState } from 'react';

/**
 * Sits inside the sticky header, directly under the nav row, so it scrolls
 * away together with the header rather than needing its own fragile
 * top-offset math. Only renders while the store is paused.
 */
export default function PauseAnnouncementBar() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/store-status')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPaused(!!data.store_paused);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!paused) return null;

  return (
    <div className="border-t border-pink-200/80 bg-[color:var(--logo-pink)] px-4 py-2 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white sm:text-xs">
        Orders paused — we&rsquo;ll be back soon
      </p>
    </div>
  );
}
