'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function StartReturnButton() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleClick = () => {
    if (user) {
      router.push('/returns/start');
    } else {
      router.push('/login?redirect=/returns/start');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
    >
      Start Return
    </button>
  );
}



