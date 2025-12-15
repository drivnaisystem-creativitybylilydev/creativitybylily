import { createAdminClient } from './server';
import type { Database } from './types';

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();

  return !error && data !== null;
}

/**
 * Get admin user info
 */
export async function getAdminUser(userId: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*, users(*)')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}








