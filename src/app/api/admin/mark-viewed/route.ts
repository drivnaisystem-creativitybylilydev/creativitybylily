import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Mark items as viewed by admin
 * POST body: { type: 'orders' | 'returns' | 'events', ids: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ids } = body;

    if (!type || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Type and ids array are required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    let tableName: string;
    if (type === 'orders') {
      tableName = 'orders';
    } else if (type === 'returns') {
      tableName = 'returns';
    } else if (type === 'events') {
      tableName = 'events';
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be orders, returns, or events' },
        { status: 400 }
      );
    }

    // Update all items to mark as viewed
    const { error } = await supabase
      .from(tableName)
      .update({ admin_viewed_at: now })
      .in('id', ids);

    if (error) {
      console.error(`Error marking ${type} as viewed:`, error);
      return NextResponse.json(
        { error: `Failed to mark ${type} as viewed`, details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in mark-viewed:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


