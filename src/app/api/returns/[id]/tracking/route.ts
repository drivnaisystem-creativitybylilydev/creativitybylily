import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { trackingNumber } = body;

    if (!trackingNumber || trackingNumber.trim() === '') {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Get access token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get return to verify ownership
    const adminSupabase = createAdminClient();
    const { data: returnData, error: fetchError } = await adminSupabase
      .from('returns')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !returnData) {
      return NextResponse.json(
        { error: 'Return not found' },
        { status: 404 }
      );
    }

    // Verify return belongs to user
    if (returnData.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - This return does not belong to you' },
        { status: 403 }
      );
    }

    // Verify return is approved (can only add tracking if approved)
    if (returnData.status !== 'approved') {
      return NextResponse.json(
        { error: `Cannot add tracking number. Return status must be 'approved'. Current status: ${returnData.status}` },
        { status: 400 }
      );
    }

    // Update return with tracking number and set status to 'shipped'
    const { data, error } = await adminSupabase
      .from('returns')
      .update({
        return_tracking_number: trackingNumber.trim(),
        status: 'shipped',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating return tracking:', error);
      return NextResponse.json(
        { error: 'Failed to update tracking number', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      return: data,
      message: 'Tracking number added and return status updated to shipped'
    });
  } catch (error: any) {
    console.error('Tracking update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


