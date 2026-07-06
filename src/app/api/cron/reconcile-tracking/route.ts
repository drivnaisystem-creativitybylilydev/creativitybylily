import { NextResponse } from 'next/server';
import { reconcileShippedOrders } from '@/lib/shipping';

/**
 * Daily backstop for the Shippo webhook (real-time notifications occasionally drop). Re-checks
 * any order still "shipped" after ~1 day directly against Shippo and applies the same
 * delivered-transition logic as the webhook. Vercel Cron calls this with the standard
 * `Authorization: Bearer ${CRON_SECRET}` header — see vercel.json for the schedule.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await reconcileShippedOrders({ olderThanHours: 24 });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error reconciling tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
