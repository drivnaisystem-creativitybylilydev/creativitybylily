'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      // Don't check auth on auth pages (login, forgot password, reset password)
      if (pathname === '/admin/login' || 
          pathname === '/admin/forgot-password' || 
          pathname === '/admin/reset-password') {
        setIsChecking(false);
        return;
      }

      try {
        // Check if user is signed in
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Check if user is admin
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (!adminCheck) {
          await supabase.auth.signOut();
          router.push('/admin/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Get current pathname dynamically (not from closure)
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/admin/login' || 
                        currentPath === '/admin/forgot-password' || 
                        currentPath === '/admin/reset-password';
      
      // Only redirect if we're not on an auth page
      if ((event === 'SIGNED_OUT' || !session) && currentPath?.startsWith('/admin') && !isAuthPage) {
        router.push('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  // Allow auth pages to render without checking
  if (pathname === '/admin/login' || 
      pathname === '/admin/forgot-password' || 
      pathname === '/admin/reset-password') {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

