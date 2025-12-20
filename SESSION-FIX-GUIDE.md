# Session Persistence Fix Guide

## Issues Fixed

1. **Session not persisting** - Updated client to use localStorage properly
2. **Unauthorized errors** - Fixed API route to accept token in Authorization header
3. **Auto-signin to admin** - This was likely due to cached session, now fixed

## What Changed

### 1. Client Configuration (`src/lib/supabase/client.ts`)
- Added `persistSession: true` to save sessions in localStorage
- Added `autoRefreshToken: true` to keep sessions alive
- Added `detectSessionInUrl: true` for email verification

### 2. API Route (`src/app/api/returns/create/route.ts`)
- Now accepts `Authorization: Bearer <token>` header
- Client sends access token with each request
- More reliable than cookie-based auth

### 3. Return Form (`src/app/returns/start/page.tsx`)
- Gets session token before submitting
- Sends token in Authorization header
- Better error handling

## Testing Steps

1. **Clear browser data** (important!):
   - Open DevTools (F12)
   - Go to Application tab → Storage
   - Clear Site Data (or just Local Storage)
   - This removes any cached admin session

2. **Test regular user login**:
   - Go to `/login`
   - Log in with your test account
   - Refresh the page - you should stay logged in
   - Go to `/account` - should see your account

3. **Test return submission**:
   - Go to `/returns/start`
   - Select order and items
   - Submit return
   - Should work without "Unauthorized" error

4. **Check returns in admin**:
   - Log out of regular account
   - Go to `/admin/login`
   - Log in as admin
   - Go to `/admin/returns`
   - Should see the return you just created

## If Still Having Issues

### Check Browser Console
1. Open DevTools (F12) → Console
2. Look for any errors when:
   - Logging in
   - Submitting return
   - Refreshing page

### Check Network Tab
1. Open DevTools (F12) → Network
2. Submit a return
3. Click on the `/api/returns/create` request
4. Check:
   - Request Headers → Should have `Authorization: Bearer ...`
   - Response → Should be 200 OK (not 401)

### Clear All Sessions
If you're still auto-signing into admin:

1. **In Browser**:
   - Clear all cookies for localhost
   - Clear localStorage
   - Clear sessionStorage

2. **In Supabase**:
   - Go to Authentication → Users
   - Find your test user
   - Click "Sign out" (if available)
   - Or manually delete the session

3. **Try again**:
   - Close all browser tabs
   - Open fresh tab
   - Go to `/login`
   - Log in with test account

## Expected Behavior

✅ **Regular User**:
- Logs in → Session persists in localStorage
- Refreshes page → Stays logged in
- Can submit returns → Token sent in header
- Returns appear in database

✅ **Admin User**:
- Logs in at `/admin/login` → Separate session
- Can view all returns at `/admin/returns`
- Can update return status

---

**If issues persist**, check:
1. Are you logged in as the correct user? (Check `/account` page)
2. Is the returns table created? (Run the SQL if not)
3. Check browser console for specific error messages


