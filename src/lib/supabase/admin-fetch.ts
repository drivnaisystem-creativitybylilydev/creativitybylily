'use client';

import { adminSupabase } from './admin-client';

/**
 * fetch() wrapper for /api/admin/* calls. Attaches the admin session's
 * access token as a Bearer header so server routes can verify the caller
 * via requireAdmin() — the admin session lives in sessionStorage, so it
 * never reaches the server as a cookie on its own.
 */
export async function adminFetch(input: string, init: RequestInit = {}) {
  const { data: { session } } = await adminSupabase.auth.getSession();

  const headers = new Headers(init.headers);
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(input, { ...init, headers });
}
