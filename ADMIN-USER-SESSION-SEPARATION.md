# Admin & User Session Separation

## Problem Solved
Previously, admin and regular user sessions conflicted because they both used the same Supabase auth session stored in localStorage. When you logged in as one, it would replace the other's session.

## Solution
Created separate Supabase clients with different storage mechanisms:

### Regular Users (`src/lib/supabase/client.ts`)
- Uses **localStorage** for persistent sessions
- Storage key: `user-auth-token`
- Sessions persist across browser restarts

### Admin Users (`src/lib/supabase/admin-client.ts`)
- Uses **sessionStorage** with `admin_` prefix
- Storage key: `admin-auth-token`
- Sessions clear when tab closes (more secure for admin)
- Completely separate from regular user sessions

## How It Works

1. **Separate Storage**: Admin sessions stored in `sessionStorage` with `admin_` prefix, regular users in `localStorage`
2. **Different Storage Keys**: `admin-auth-token` vs `user-auth-token`
3. **Independent Sessions**: You can now be logged in as both admin and regular user simultaneously in different tabs

## Benefits

✅ **No More Conflicts**: Admin and regular user sessions don't interfere with each other
✅ **Security**: Admin sessions clear when tab closes (sessionStorage)
✅ **Convenience**: Regular user sessions persist (localStorage)
✅ **Simultaneous Login**: Can test both admin and user features at the same time

## Updated Files

- `src/lib/supabase/admin-client.ts` - New admin-specific client
- `src/lib/supabase/client.ts` - Updated with separate storage key
- `src/app/admin/login/page.tsx` - Uses `adminSupabase`
- `src/components/admin/AdminAuthWrapper.tsx` - Uses `adminSupabase`
- `src/components/admin/AdminLogoutButton.tsx` - Uses `adminSupabase`

## Testing

1. **Log in as regular user** → Session persists in localStorage
2. **Open new tab, log in as admin** → Session stored in sessionStorage
3. **Refresh both tabs** → Both stay logged in independently
4. **Close admin tab** → Admin session clears (sessionStorage)
5. **Regular user tab** → Still logged in (localStorage)

## Notes

- Admin sessions are less persistent (clear on tab close) for security
- Regular user sessions persist for better UX
- Both can be active simultaneously in different tabs
- No more auto-login conflicts!
