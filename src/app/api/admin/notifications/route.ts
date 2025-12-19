import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Get notification counts for admin dashboard
 * Returns counts of unviewed items (orders, returns, events)
 */
export async function GET() {
  try {
    const supabase = createAdminClient();

    // Count unviewed orders (admin_viewed_at IS NULL)
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .is('admin_viewed_at', null);

    // Count unviewed returns (admin_viewed_at IS NULL)
    const { count: returnsCount } = await supabase
      .from('returns')
      .select('*', { count: 'exact', head: true })
      .is('admin_viewed_at', null);

    // Count unviewed events (admin_viewed_at IS NULL) - if events table exists
    let eventsCount = 0;
    try {
      const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .is('admin_viewed_at', null);
      eventsCount = count || 0;
    } catch (error) {
      // Events table might not exist, ignore
      console.log('Events table not found, skipping events count');
    }

    return NextResponse.json({
      orders: ordersCount || 0,
      returns: returnsCount || 0,
      events: eventsCount || 0,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}
