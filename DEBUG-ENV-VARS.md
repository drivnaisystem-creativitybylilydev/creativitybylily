# Debug: "No API key found" Error

## Quick Fix Steps

### Step 1: Restart Dev Server (CRITICAL)

Environment variables only load when the server starts. You MUST restart:

1. **Stop your dev server:**
   - In terminal, press `Ctrl+C` (or `Cmd+C` on Mac)
   - Wait for it to fully stop

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Step 2: Verify Variables Are Loaded

After restarting, check the browser console:
- Open DevTools (F12) → Console tab
- Look for: `⚠️ Supabase environment variables are missing`
  - ❌ If you see this → Variables aren't loading
  - ✅ If you DON'T see this → Variables are loaded

### Step 3: Check Variable Format

Open `.env.local` and verify the format is EXACTLY:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://haodvzulrwkucolmogkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhb2R2enVscndrdWNvbG1vZ2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MjE2MDAsImV4cCI6MjA1MDM5NzYwMH0.xxxxx
```

**Common mistakes:**
- ❌ `SUPABASE_URL=` (missing `NEXT_PUBLIC_`)
- ❌ `NEXT_PUBLIC_SUPABASE_URL = https://...` (spaces around `=`)
- ❌ `NEXT_PUBLIC_SUPABASE_URL="https://..."` (quotes around value)
- ❌ Line breaks in the middle of values
- ✅ `NEXT_PUBLIC_SUPABASE_URL=https://...` (correct)

### Step 4: Verify File Location

`.env.local` must be in the **project root** (same folder as `package.json`):

```
creativitybylily/
  ├── .env.local          ← HERE
  ├── package.json
  ├── next.config.ts
  └── src/
```

**NOT in:**
- ❌ `src/.env.local`
- ❌ `src/app/.env.local`
- ❌ Any subfolder

---

## Still Not Working?

### Option 1: Add Debug Logging

Temporarily add this to see if variables are loading:

In `src/lib/supabase/client.ts`, add after line 5:

```typescript
console.log('🔍 Debug - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('🔍 Debug - Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
```

Then check browser console after restarting.

### Option 2: Check for Typos

1. Open `.env.local`
2. Copy the exact variable names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure they match EXACTLY (case-sensitive, no typos)

### Option 3: Try Hard Refresh

1. Stop dev server
2. Delete `.next` folder: `rm -rf .next`
3. Restart: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

---

## What Should Happen

After fixing:
1. ✅ No warning in browser console about missing variables
2. ✅ Signup should work
3. ✅ Email should be sent (if SMTP is configured)
4. ✅ No "No API key found" errors

---

**Try restarting the dev server first - that fixes it 90% of the time!**








