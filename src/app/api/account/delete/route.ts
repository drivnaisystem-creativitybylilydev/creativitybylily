import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

/**
 * DELETE /api/account/delete
 * Delete the current user's account
 * This will delete the user from auth.users, which cascades to public.users
 */
export async function DELETE(request: Request) {
  try {
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

    const userId = user.id;

    // Use admin client to delete the user from auth.users
    // This will cascade delete from public.users and related tables
    const adminSupabase = createAdminClient();

    // Delete the user from auth.users (this cascades to public.users)
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in delete account:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}


