# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `creativity-by-lily` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Important**: `.env.local` is already in `.gitignore` - never commit secrets!

## Step 5: Verify Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Check the console for any Supabase connection errors

## Next Steps

Once Supabase is set up, we'll:
1. ✅ Migrate existing products to the database
2. ✅ Update the website to read from Supabase
3. ✅ Build the shopping cart
4. ✅ Set up authentication
5. ✅ Create checkout flow

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists and has all three keys
- Restart your dev server after adding env variables

**Error: "relation does not exist"**
- Make sure you ran the SQL schema in Step 3
- Check the SQL Editor for any errors

**RLS (Row Level Security) blocking queries**
- The schema includes RLS policies for security
- Admin operations need the service role key
- Regular users can only access their own data








