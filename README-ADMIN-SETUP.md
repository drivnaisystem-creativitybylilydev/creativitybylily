# Admin Dashboard Setup Guide

## Step 1: Create Admin User Account

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** or **"Invite user"**
4. Fill in:
   - **Email**: Your admin email (e.g., `admin@creativitybylily.com`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ (check this)
5. Click **"Create user"**
6. **Copy the User ID** (UUID) - you'll need this for the next step

## Step 2: Fix Foreign Key (One-time setup)

**IMPORTANT**: Run this SQL first if you haven't already. This fixes the foreign key constraint to allow admin users to be created directly from `auth.users`.

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste this SQL:

```sql
ALTER TABLE admin_users 
DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

4. Click **"Run"**
5. You should see "Success. No rows returned"

## Step 3: Grant Admin Privileges

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste ONLY the SQL below (replace `USER_UUID_HERE` with the UUID from Step 1):
   - **IMPORTANT**: Copy only the SQL code, NOT the markdown code block markers (```sql and ```)

```sql
INSERT INTO admin_users (user_id, role)
VALUES ('USER_UUID_HERE', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;
```

4. Click **"Run"**
5. You should see "Success. 1 row inserted"

## Step 4: Test Login

1. Go to `localhost:3000/admin/login`
2. Enter your email and password
3. You should be redirected to `/admin` dashboard

## Adding More Admins

To add additional admin users:

1. Create user in Supabase Auth (Step 1)
2. Run the SQL from Step 2 with their UUID
3. They can now log in at `/admin/login`

## Step 5: Configure Password Reset Redirect URL

**IMPORTANT**: For password reset emails to work, you must configure the redirect URL in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Under **"Redirect URLs"**, add:
   ```
   http://localhost:3000/admin/reset-password
   ```
   (For production, also add: `https://yourdomain.com/admin/reset-password`)
4. Click **"Save"**

Without this, password reset links won't work properly!

## Troubleshooting

**"Access denied" error:**
- Make sure you ran the SQL to add the user to `admin_users` table
- Check that the UUID matches exactly

**Can't log in:**
- Verify the user exists in Supabase Auth → Users
- Make sure "Auto Confirm User" was checked when creating the user
- Try resetting the password in Supabase Auth

**"No reset token found" error:**
- Make sure you configured the redirect URL in Step 5 above
- Check that you're using the link from the email (don't copy/paste - click it directly)
- The link should look like: `http://localhost:3000/admin/reset-password#access_token=...&type=recovery`
- If the link doesn't have `#access_token=...`, the redirect URL isn't configured correctly

**Session expires:**
- This is normal - just log in again
- Sessions last 1 hour by default

