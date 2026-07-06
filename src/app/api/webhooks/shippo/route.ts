import { NextResponse } from 'next/server';
import { applyTrackingStatusUpdate } from '@/lib/shipping';

/**
 * Receives Shippo's `track_updated` webhook. Shippo doesn't sign webhooks by default, so this is
 * gated by a shared secret in the query string (set when registering the webhook URL with Shippo).
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const expectedKey = process.env.SHIPPO_WEBHOOK_SECRET;

  if (!expectedKey || key !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const track = payload?.data;
  const trackingNumber = track?.tracking_number;
  const status = track?.tracking_status?.status;
  const statusDetails = track?.tracking_status?.status_details ?? null;

  if (!trackingNumber || !status) {
    // Shippo sends a test ping with no data payload when the webhook is first registered.
    return NextResponse.json({ success: true, ignored: true });
  }

  try {
    const result = await applyTrackingStatusUpdate({ trackingNumber, status, statusDetails });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error processing Shippo webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
