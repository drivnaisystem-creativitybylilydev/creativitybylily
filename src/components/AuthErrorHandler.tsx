'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Component that handles Supabase auth errors, specifically invalid refresh token errors
 * This clears invalid sessions automatically to prevent console errors
 */
export default function AuthErrorHandler() {
  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // If token refresh fails, clear the invalid session
      if (event === 'TOKEN_REFRESHED' && !session) {
        try {
          // Clear invalid session
          await supabase.auth.signOut();
          // Also clear localStorage as backup
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-auth-token');
          }
        } catch (error) {
          // If signOut fails, just clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-auth-token');
          }
        }
      }
    });

    // Check for existing invalid session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        // If there's an error getting the session, clear it
        if (error && (error.message.includes('Refresh Token') || error.message.includes('refresh_token'))) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-auth-token');
          }
          await supabase.auth.signOut().catch(() => {
            // Ignore errors during cleanup
          });
        }
      } catch (error: any) {
        // If there's an error, it might be an invalid refresh token
        if (error?.message?.includes('Refresh Token') || error?.message?.includes('refresh_token')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-auth-token');
          }
          await supabase.auth.signOut().catch(() => {
            // Ignore errors during cleanup
          });
        }
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // This component doesn't render anything
  return null;
}



