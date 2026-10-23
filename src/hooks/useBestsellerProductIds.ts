'use client';

import { useEffect, useState } from 'react';

// One request per page load, shared by every component that asks (the homepage uses this hook twice).
let inflight: Promise<string[]> | null = null;

function fetchBestsellerIds(): Promise<string[]> {
  if (!inflight) {
    inflight = fetch('/api/products?sort=bestseller&limit=36')
      .then((r) => r.json())
      .then((d) => ((d.products ?? []) as { id: string }[]).map((p) => p.id))
      .catch(() => {
        inflight = null;
        return [];
      });
  }
  return inflight;
}

/**
 * Product ids from sort=bestseller (API order). Used for BESTSELLER badges where applicable.
 */
export function useBestsellerProductIds() {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetchBestsellerIds().then((list) => {
      if (!cancelled) setIds(new Set(list));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ids;
}
