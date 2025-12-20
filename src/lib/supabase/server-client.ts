import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client with proper cookie handling
 * Use this in API routes to get the user's session
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Get auth cookies
  const accessToken = cookieStore.get('sb-access-token')?.value || 
                      cookieStore.get(`sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`)?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value ||
                       cookieStore.get(`sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-refresh-token`)?.value;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    },
  });

  // If we have tokens, set the session
  if (accessToken && refreshToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return client;
}



