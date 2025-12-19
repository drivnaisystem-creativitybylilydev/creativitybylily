import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing. Auth features will not work.');
}

/**
 * Admin-specific Supabase client
 * Uses sessionStorage instead of localStorage to keep admin sessions separate from regular user sessions
 * This allows admin and regular users to be logged in simultaneously in different tabs
 */
export const adminSupabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? {
          getItem: (key: string) => {
            // Use sessionStorage with admin prefix
            return window.sessionStorage.getItem(`admin_${key}`);
          },
          setItem: (key: string, value: string) => {
            window.sessionStorage.setItem(`admin_${key}`, value);
          },
          removeItem: (key: string) => {
            window.sessionStorage.removeItem(`admin_${key}`);
          },
        } : undefined,
        storageKey: 'admin-auth-token', // Different storage key
      },
    })
  : createClient('https://dummy.supabase.co', 'dummy-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
