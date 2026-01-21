# ✅ Square Environment Variables - CORRECTED & SECURE

## 🔒 Security Issue Fixed

**Problem:** Access tokens were incorrectly placed in public environment variables, exposing secrets to the browser.

**Solution:** Separated public (frontend) and private (backend) environment variables properly.

---

## 📋 Required Environment Variables

### Frontend (Public - Safe to expose in browser)

These variables start with `NEXT_PUBLIC_` and are embedded in the client-side JavaScript bundle:

```bash
# Square Application ID - Starts with sq0idp-...
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-your-production-app-id

# Square Environment - "production" or "sandbox"
NEXT_PUBLIC_SQUARE_ENV=production
```

### Backend (Private - Server-side only)

These variables are ONLY accessible on the server and NEVER sent to the browser:

```bash
# Square Access Token - OAuth token starting with sq0atp-...
# ⚠️ CRITICAL: This is a SECRET. NEVER put in a NEXT_PUBLIC_ variable!
SQUARE_ACCESS_TOKEN=sq0atp-your-production-oauth-token

# Square Location ID - Identifies which Square location handles payments
SQUARE_LOCATION_ID=your-location-id

# Square Environment - Must match the frontend env
SQUARE_ENV=production
```

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG - Do NOT do this:

```bash
# WRONG: Access token exposed to browser (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0atp-xxxxx  # This is an ACCESS TOKEN, not an Application ID!

# WRONG: Using legacy PAT token instead of OAuth token
SQUARE_ACCESS_TOKEN=EAAAl_xxxxx  # Legacy tokens are deprecated

# WRONG: Mixing up Application ID and Access Token
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0atp-xxxxx  # This should be sq0idp-...
SQUARE_ACCESS_TOKEN=sq0idp-xxxxx  # This should be sq0atp-...
```

### ✅ CORRECT - Do this instead:

```bash
# CORRECT: Application ID (sq0idp-...) in public variable
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-xxxxx

# CORRECT: OAuth Access Token (sq0atp-...) in private variable
SQUARE_ACCESS_TOKEN=sq0atp-xxxxx
```

---

## 🔍 How to Get the Correct Credentials

### Step 1: Log into Square Developer Dashboard
Visit: [developer.squareup.com/apps](https://developer.squareup.com/apps)

### Step 2: Select Your Application
Click on your application (or create one if needed)

### Step 3: Get Production Application ID
1. On the main application page, you'll see the **Application ID**
2. It should start with `sq0idp-...`
3. This goes in: `NEXT_PUBLIC_SQUARE_APPLICATION_ID`

### Step 4: Get Production Access Token
1. Go to the **Credentials** tab
2. Under **Production** section (NOT Sandbox):
   - Find or generate the **Production Access Token**
   - It MUST start with `sq0atp-...` (OAuth token)
   - If you see a token starting with `EAAA...`, that's a legacy PAT - don't use it
3. This goes in: `SQUARE_ACCESS_TOKEN` (server-only, NO `NEXT_PUBLIC_` prefix!)

### Step 5: Get Location ID
1. Go to the **Locations** tab in the Developer Dashboard
2. Or visit [Square Dashboard → Settings → Locations](https://squareup.com/dashboard/locations)
3. Copy the Location ID (usually starts with `L...`)
4. This goes in: `SQUARE_LOCATION_ID`

---

## 📝 Complete .env.local Template

Copy this into your `.env.local` file:

```bash
# =============================================================================
# SQUARE PAYMENT PROCESSING (PRODUCTION)
# =============================================================================

# Frontend (Public) - Application ID for Square Web Payments SDK
# This value is embedded in the browser JavaScript and is safe to be public
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-your-production-app-id
NEXT_PUBLIC_SQUARE_ENV=production

# Backend (Private) - Access Token and Location ID
# These values are ONLY used on the server and NEVER sent to the browser
SQUARE_ACCESS_TOKEN=sq0atp-your-production-oauth-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENV=production

# =============================================================================
# IMPORTANT NOTES:
# - Application ID starts with: sq0idp-...
# - Access Token starts with: sq0atp-... (OAuth token, NOT legacy EAAA...)
# - Location ID usually starts with: L...
# - NEVER put access tokens in NEXT_PUBLIC_ variables!
# =============================================================================
```

---

## 🧪 Verification Checklist

After updating your environment variables, verify everything is correct:

### 1. Check for Legacy Tokens
```bash
# Run this in your terminal - should return NO results
grep -r "EAAA" . --include="*.ts" --include="*.tsx" --include="*.md"
```

### 2. Check for Exposed Secrets
```bash
# Check that no access tokens are in NEXT_PUBLIC variables
grep -r "NEXT_PUBLIC.*sq0atp" .env.local
# Should return NOTHING (empty result)

# Check that Application ID is in NEXT_PUBLIC
grep -r "NEXT_PUBLIC_SQUARE_APPLICATION_ID.*sq0idp" .env.local
# Should return 1 match
```

### 3. Verify Token Formats
Open your `.env.local` and verify:
- [ ] `NEXT_PUBLIC_SQUARE_APPLICATION_ID` starts with `sq0idp-`
- [ ] `SQUARE_ACCESS_TOKEN` starts with `sq0atp-`
- [ ] `SQUARE_ACCESS_TOKEN` is NOT in any `NEXT_PUBLIC_` variable
- [ ] No tokens starting with `EAAA` anywhere

### 4. Test in Browser DevTools
1. Start your dev server: `npm run dev`
2. Open your site in browser
3. Open DevTools → Console
4. Type: `Object.keys(process.env).filter(k => k.includes('SQUARE'))`
5. You should ONLY see:
   - `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
   - `NEXT_PUBLIC_SQUARE_ENV`
6. You should NOT see:
   - `SQUARE_ACCESS_TOKEN` (this would mean it's leaked!)

### 5. Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Square payment form should load
5. Enter test card: `4111 1111 1111 1111`
6. Submit payment
7. Check server logs for any errors
8. Payment should process successfully

### 6. Check Square Dashboard
After a test payment:
1. Log into [Square Dashboard](https://squareup.com/dashboard)
2. Go to **Transactions**
3. Verify the test payment appears
4. If using sandbox, switch to sandbox view
5. If using production, verify it's a real charge

---

## 🚀 Deploying to Vercel

When deploying to Vercel, you must set these environment variables in the Vercel Dashboard:

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:

```bash
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-your-production-app-id
NEXT_PUBLIC_SQUARE_ENV=production
SQUARE_ACCESS_TOKEN=sq0atp-your-production-oauth-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENV=production
```

**Important:**
- Make sure to set these for **Production**, **Preview**, and **Development** environments
- After adding/updating variables, you MUST **Redeploy** your site
- Never commit `.env.local` to git (it's in `.gitignore`)

---

## 🆘 Troubleshooting

### Error: "401 UNAUTHORIZED"
**Cause:** Wrong access token or environment mismatch

**Fix:**
1. Verify `SQUARE_ACCESS_TOKEN` starts with `sq0atp-`
2. Verify you're using **Production** token with `SQUARE_ENV=production`
3. Verify token is from the correct application
4. Try generating a new access token in Square Dashboard

### Error: "Payment form not loading"
**Cause:** Missing or incorrect Application ID

**Fix:**
1. Verify `NEXT_PUBLIC_SQUARE_APPLICATION_ID` is set
2. Verify it starts with `sq0idp-`
3. Check browser console for errors
4. Restart dev server after changing env vars

### Error: "This request could not be authorized"
**Cause:** Access token in wrong environment variable

**Fix:**
1. Make sure access token (`sq0atp-...`) is in `SQUARE_ACCESS_TOKEN`, NOT in any `NEXT_PUBLIC_` variable
2. Make sure Application ID (`sq0idp-...`) is in `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
3. Never put the access token in the frontend

---

## 📚 Files Modified

The following code files were updated to use the correct environment variables:

1. **src/app/api/payments/create/route.ts**
   - Changed `SQUARE_ENVIRONMENT` → `SQUARE_ENV`
   - Uses `SQUARE_ACCESS_TOKEN` (server-side only)

2. **src/app/api/admin/returns/[id]/status/route.ts**
   - Changed `SQUARE_ENVIRONMENT` → `SQUARE_ENV`
   - Uses `SQUARE_ACCESS_TOKEN` (server-side only)

3. **src/app/checkout/page.tsx**
   - Changed `NEXT_PUBLIC_SQUARE_ENVIRONMENT` → `NEXT_PUBLIC_SQUARE_ENV`
   - Uses `NEXT_PUBLIC_SQUARE_APPLICATION_ID` (client-side)

---

## ✅ Summary

**What was wrong:**
- Access tokens were potentially in public environment variables
- Legacy PAT tokens were being referenced in documentation
- Inconsistent naming (`SQUARE_ENVIRONMENT` vs `SQUARE_ENV`)

**What was fixed:**
- All access tokens are now server-only (no `NEXT_PUBLIC_` prefix)
- Removed all references to legacy `EAAA...` tokens
- Standardized on `SQUARE_ENV` and `NEXT_PUBLIC_SQUARE_ENV`
- Updated all documentation with correct patterns
- Added security checks and verification steps

**Next steps:**
1. Update your `.env.local` with the correct values
2. Restart your dev server
3. Run the verification checklist above
4. Test a payment end-to-end
5. Update Vercel environment variables
6. Redeploy your site

---

**Last Updated:** January 18, 2026
**Status:** ✅ Security Issue Resolved
