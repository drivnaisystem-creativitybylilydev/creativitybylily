import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

/**
 * GET /api/store-status
 * Public. Used by client-only pages (cart, checkout) to redirect to /paused
 * when the store is paused, since a server-side redirect isn't available there.
 */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
