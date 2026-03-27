'use client';

import { useEffect, useState } from 'react';

/**
 * Product ids from sort=bestseller (API order). Used for BESTSELLER badges where applicable.
 */
export function useBestsellerProductIds() {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/products?sort=bestseller&limit=36');
        const d = await r.json();
        if (!cancelled) {
          const list = (d.products ?? []) as { id: string }[];
          setIds(new Set(list.map((p) => p.id)));
        }
      } catch {
        if (!cancelled) setIds(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return ids;
}
