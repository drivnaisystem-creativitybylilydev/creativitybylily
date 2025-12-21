import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing. Auth features will not work.');
}

/**
 * Regular user Supabase client
 * Uses localStorage for persistent sessions
 * This is separate from admin sessions to allow simultaneous login
 */
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'user-auth-token', // Different storage key from admin
      },
    })
  : createClient('https://dummy.supabase.co', 'dummy-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });









