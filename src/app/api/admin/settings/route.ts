import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/settings
 * Fetch site settings (store pause state + message) for the admin dashboard.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('store_paused, pause_message, updated_at')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching site settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Error in settings GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/settings
 * Update store_paused and/or pause_message.
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const update: { store_paused?: boolean; pause_message?: string | null } = {};

    if (typeof body.store_paused === 'boolean') update.store_paused = body.store_paused;
    if (typeof body.pause_message === 'string' || body.pause_message === null) {
      update.pause_message = body.pause_message;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .update(update)
      .eq('id', 1)
      .select('store_paused, pause_message, updated_at')
      .single();

    if (error) {
      console.error('Error updating site settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Error in settings PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
