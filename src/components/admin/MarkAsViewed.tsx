'use client';

import { useEffect } from 'react';

/**
 * Component that marks items as viewed when admin visits a page
 * Call this on list pages to mark all visible items as viewed
 */
export default function MarkAsViewed({ 
  type, 
  ids 
}: { 
  type: 'orders' | 'returns' | 'events';
  ids: string[];
}) {
  useEffect(() => {
    if (ids.length === 0) return;

    // Mark all items as viewed
    const markViewed = async () => {
      try {
        await fetch('/api/admin/mark-viewed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type, ids }),
        });
      } catch (error) {
        console.error(`Error marking ${type} as viewed:`, error);
      }
    };

    markViewed();
  }, [type, ids]);

  return null;
}
