import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET - List all events (admin only)
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, description, start_date, end_date, location, link, is_featured, image_url } = body;

    if (!title || !type || !description || !start_date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, description, start_date, location' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        type,
        description,
        start_date,
        end_date: end_date || null,
        location,
        link: link || null,
        is_featured: is_featured || false,
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}





