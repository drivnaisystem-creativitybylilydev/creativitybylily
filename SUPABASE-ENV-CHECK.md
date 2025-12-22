# Fix: "No API key found in request" Error

## The Problem

The error `"No API key found in request"` means your Supabase client isn't getting the API key. This usually happens when:
1. Environment variables are missing from `.env.local`
2. Dev server wasn't restarted after adding variables
3. Variables are named incorrectly

## Quick Fix Steps

### Step 1: Check Your `.env.local` File

Open `.env.local` in your project root and make sure you have these two lines:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- They MUST start with `NEXT_PUBLIC_` (this makes them available in the browser)
- No spaces around the `=` sign
- No quotes around the values

### Step 2: Get Your Supabase Credentials

If you don't have them:

1. Go to **Supabase Dashboard** → Your project
2. Click **Settings** (gear icon) → **API**
3. You'll see:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Add to `.env.local`

Add these lines to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://haodvzulrwkucolmogkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

Replace `your-actual-anon-key-here` with the actual anon key from Supabase.

### Step 4: Restart Your Dev Server

**CRITICAL:** You MUST restart your dev server after adding/changing environment variables!

1. Stop your dev server (Ctrl+C or Cmd+C in terminal)
2. Start it again: `npm run dev`
3. Try signing up again

---

## Verify It's Working

After restarting, check the browser console:
- ❌ If you see: `⚠️ Supabase environment variables are missing` → Variables aren't loaded
- ✅ If you DON'T see that warning → Variables are loaded correctly

---

## Your `.env.local` Should Look Like:

```bash
# Resend (for transactional emails)
RESEND_API_KEY=re_j4yoLmgx_Je3PZ1o7VmH3DSprGkLNRqQ6
RESEND_FROM_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (REQUIRED for auth)
NEXT_PUBLIC_SUPABASE_URL=https://haodvzulrwkucolmogkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Still Not Working?

1. **Double-check variable names:**
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_URL`
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Case-sensitive!

2. **Check for typos:**
   - No extra spaces
   - No quotes around values
   - No line breaks in the middle of values

3. **Verify file location:**
   - `.env.local` must be in the project root (same folder as `package.json`)
   - Not in `src/` or any subfolder

4. **Restart dev server:**
   - Environment variables only load when the server starts
   - Changes require a restart

---

**After adding the Supabase variables and restarting, try signing up again!**



