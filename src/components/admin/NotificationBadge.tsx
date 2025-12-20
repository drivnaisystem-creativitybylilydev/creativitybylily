'use client';

import { useEffect, useState } from 'react';

type NotificationCounts = {
  orders: number;
  returns: number;
  events: number;
};

export default function NotificationBadge({ type }: { type: 'orders' | 'returns' | 'events' }) {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/admin/notifications');
        if (response.ok) {
          const data: NotificationCounts = await response.json();
          setCount(data[type] || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [type]);

  if (isLoading || count === 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ml-2">
      {count > 99 ? '99+' : count}
    </span>
  );
}



