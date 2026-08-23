import { createAdminClient } from '@/lib/supabase/server';

export type SiteSettings = {
  store_paused: boolean;
  pause_message: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = { store_paused: false, pause_message: null };

/** Server-only. Always reads fresh — a paused toggle should take effect on the very next request. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('store_paused, pause_message')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('getSiteSettings error:', error);
    return DEFAULT_SETTINGS;
  }
  return data as SiteSettings;
}
