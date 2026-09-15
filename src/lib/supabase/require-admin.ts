import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from './server';

/**
 * Verifies the request carries a valid Supabase session belonging to an
 * admin_users row. Expects `Authorization: Bearer <access_token>` set by
 * adminFetch() on the client (the admin session lives in sessionStorage,
 * not cookies, so it has to be forwarded explicitly).
 */
export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: NextResponse.json({ error: 'Server misconfigured' }, { status: 500 }) };
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: userError } = await authClient.auth.getUser(token);

  if (userError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const adminClient = createAdminClient();
  const { data: adminRow, error: adminError } = await adminClient
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (adminError || !adminRow) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user };
}
