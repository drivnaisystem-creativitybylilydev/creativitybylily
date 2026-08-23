'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

/**
 * Drop into any client-only storefront page (cart, checkout) that can't do a
 * server-side redirect. Bounces to /paused if the store is currently paused.
 */
export default function StoreGateRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/store-status')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.store_paused) router.replace('/paused');
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
