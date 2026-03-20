'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

/**
 * Refetches server-rendered admin dashboard and tells client widgets (analytics, badges) to reload.
 */
export default function AdminDashboardRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    setBusy(true);
    startTransition(() => {
      router.refresh();
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin-dashboard-refresh'));
    }
    // Brief delay so transition + fetches can start
    setTimeout(() => setBusy(false), 600);
  };

  const loading = isPending || busy;

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      <svg
        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {loading ? 'Refreshing…' : 'Refresh'}
    </button>
  );
}
