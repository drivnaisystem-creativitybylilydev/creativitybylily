# 🚀 Launch Day Checklist - Complete Configuration Guide

**Use this guide on launch day to switch from test/setup accounts to production.**

---

## 📋 Quick Overview

**What needs to change:**
1. ✅ **Email Addresses** - Switch from your test email to client's email
2. ✅ **API Keys** - Switch from test/sandbox to production
3. ✅ **Admin Account** - Create client's admin account
4. ✅ **Environment Variables** - Update in Vercel

**Estimated Time:** 1-2 hours

---

## 📧 PART 1: Email Addresses to Change

### 1.1 Contact Email on Website Pages

**Current:** `creativitybylilyco@gmail.com` (already set to client's email ✅)

**Files to check (if you need to change):**
- `src/app/contact/page.tsx` (lines 25, 71, 74, 132, 133)
- `src/app/privacy/page.tsx` (line 130)
- `src/app/terms/page.tsx` (line 153)
- `src/app/returns/page.tsx` (lines 121, 148)
- `src/app/shipping/page.tsx` (lines 39, 59, 76, 91)
- `src/app/cookies/page.tsx` (line 111)

**Action:** 
- ✅ Already set to `creativitybylilyco@gmail.com` - **No change needed**
- If client wants a different email, use Find & Replace in your editor

---

### 1.2 Resend Email Service (Transactional Emails)

**What it does:** Sends order confirmations, return emails, refund emails

**Where to change:**
1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `RESEND_FROM_EMAIL`
3. Update to client's email (e.g., `orders@creativitybylily.com` or `creativitybylilyco@gmail.com`)

**Current value:** Check your `.env.local` or Vercel dashboard

**New value:** Client's email address (must be verified in Resend)

**Steps:**
1. Client creates Resend account OR you transfer your Resend account
2. Client verifies their domain (if using custom domain) OR uses their email
3. Get new `RESEND_API_KEY` from Resend dashboard
4. Update in Vercel:
   - `RESEND_API_KEY` = New API key from client's Resend account
   - `RESEND_FROM_EMAIL` = Client's email (e.g., `creativitybylilyco@gmail.com`)
5. **Redeploy** site (or wait for auto-deploy)

**Files affected:** All transactional emails (order confirmations, returns, refunds)

---

### 1.3 Supabase SMTP Settings (Email Verification)

**What it does:** Sends password reset and email verification emails

**Where to change:**
1. Go to **Supabase Dashboard** → Your Project
2. **Settings** → **Authentication** → **Email (SMTP)**
3. Update **"Sender email address"** to client's email
4. Update **"Sender name"** to "creativity by lily" (or client's preference)
5. Click **"Save changes"**

**Current value:** Your test email

**New value:** Client's email (e.g., `creativitybylilyco@gmail.com`)

**Note:** The SMTP password should remain the Resend API key (same as `RESEND_API_KEY`)

---

### 1.4 Admin Account Email

**What it does:** Allows client to log into admin dashboard

**Where to change:**
1. **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email:** Client's email (e.g., `lily@creativitybylily.com` or `creativitybylilyco@gmail.com`)
   - **Password:** Create temporary strong password
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**
5. **Copy the User ID** (UUID) - you'll need this

6. Go to **SQL Editor** → **New Query**
7. Run this SQL (replace `USER_UUID_HERE` with the UUID from step 5):

```sql
INSERT INTO admin_users (user_id, role)
VALUES ('USER_UUID_HERE', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;
```

8. **Give client login credentials:**
   - URL: `https://your-domain.com/admin/login`
   - Email: Their email
   - Password: Temporary password (they should change it)

**Result:** Client can now log into admin dashboard at `/admin/login`

---

## 🔑 PART 2: API Keys - Test to Production

### 2.1 Square Payment Processing

**What needs to change:**

#### Environment Variables in Vercel:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Update these variables:

```bash
# Change from sandbox to production
SQUARE_ENVIRONMENT=production
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production

# Update with client's PRODUCTION credentials (not sandbox)
SQUARE_ACCESS_TOKEN=client_production_access_token
SQUARE_APPLICATION_ID=client_production_application_id
NEXT_PUBLIC_SQUARE_APPLICATION_ID=client_production_application_id
SQUARE_LOCATION_ID=client_production_location_id
```

**How to get client's production credentials:**
1. Client logs into [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select their application
3. Go to **Credentials** tab
4. Under **Production** section:
   - Copy **Access Token** → `SQUARE_ACCESS_TOKEN`
   - Copy **Application ID** → `SQUARE_APPLICATION_ID` and `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
5. Go to **Locations** tab → Copy **Location ID** → `SQUARE_LOCATION_ID`

**⚠️ CRITICAL:** 
- Make sure you're using **Production** credentials, NOT Sandbox
- `SQUARE_ENVIRONMENT` must be `production` (not `sandbox`)
- After updating, **redeploy** the site

**Files affected:**
- `src/app/api/payments/create/route.ts` (payment processing)
- `src/app/api/admin/returns/[id]/status/route.ts` (refund processing)
- `src/app/checkout/page.tsx` (payment form)

---

### 2.2 Shippo Shipping Labels

**What needs to change:**

#### Environment Variables in Vercel:

1. **Switch from Test to Live API Key:**

```bash
# Change from test key to live key
SHIPPO_API_KEY=shippo_live_xxxxxxxxxxxxx  # NOT shippo_test_...
```

**How to get client's live Shippo key:**
1. Client logs into [Shippo Dashboard](https://apps.goshippo.com/)
2. Go to **Settings** → **API**
3. Copy **Live API Token** (starts with `shippo_live_...`)
4. **NOT** the test token (starts with `shippo_test_...`)

2. **Disable Test Address Mode:**

```bash
# Change from true to false
SHIPPO_USE_TEST_ADDRESS=false
```

**⚠️ CRITICAL:**
- Must be `false` for production (was `true` for testing)
- This ensures real addresses are used, not test addresses

3. **Verify Business Address:**

```bash
# Update with client's actual business address
SHIPPO_FROM_NAME=Creativity by Lily
SHIPPO_FROM_STREET1=Client's actual street address
SHIPPO_FROM_CITY=Client's actual city
SHIPPO_FROM_STATE=Client's actual state (e.g., MA)
SHIPPO_FROM_ZIP=Client's actual ZIP code
SHIPPO_FROM_COUNTRY=US
SHIPPO_SHIPPING_MARKUP=2.50
```

**Files affected:**
- `src/app/api/admin/orders/[id]/generate-label/route.ts` (label generation)
- `src/app/api/shipping/calculate/route.ts` (shipping rates)

---

### 2.3 Resend Email Service

**Already covered in Part 1.2** - Update `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

---

## ⚙️ PART 3: Environment Variables Summary

### Complete List for Vercel

**Copy these from your `.env.local` and update in Vercel:**

```bash
# Supabase (should already be set)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Square (UPDATE TO PRODUCTION)
SQUARE_APPLICATION_ID=client_production_app_id
NEXT_PUBLIC_SQUARE_APPLICATION_ID=client_production_app_id
SQUARE_ACCESS_TOKEN=client_production_access_token
SQUARE_LOCATION_ID=client_production_location_id
SQUARE_ENVIRONMENT=production
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production

# Shippo (UPDATE TO LIVE + CLIENT'S ADDRESS)
SHIPPO_API_KEY=shippo_live_xxxxxxxxxxxxx
SHIPPO_FROM_NAME=Creativity by Lily
SHIPPO_FROM_STREET1=client_actual_street_address
SHIPPO_FROM_CITY=client_actual_city
SHIPPO_FROM_STATE=client_actual_state
SHIPPO_FROM_ZIP=client_actual_zip
SHIPPO_FROM_COUNTRY=US
SHIPPO_SHIPPING_MARKUP=2.50
SHIPPO_USE_TEST_ADDRESS=false

# Resend (UPDATE TO CLIENT'S ACCOUNT)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=creativitybylilyco@gmail.com

# Site URL (UPDATE TO PRODUCTION DOMAIN)
NEXT_PUBLIC_SITE_URL=https://creativitybylily.com
```

**How to update in Vercel:**
1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. For each variable:
   - If it exists: Click **Edit** → Update value → **Save**
   - If it doesn't exist: Click **Add New** → Enter name and value → **Save**
4. **Redeploy** the site (or wait for auto-deploy)

---

## ✅ PART 4: Final Verification Checklist

### Before Going Live:

- [ ] **Square:** All credentials are PRODUCTION (not sandbox)
- [ ] **Square:** `SQUARE_ENVIRONMENT=production`
- [ ] **Shippo:** API key is LIVE (not test)
- [ ] **Shippo:** `SHIPPO_USE_TEST_ADDRESS=false`
- [ ] **Shippo:** Business address is correct
- [ ] **Resend:** API key is from client's account
- [ ] **Resend:** `RESEND_FROM_EMAIL` is client's email
- [ ] **Supabase SMTP:** Sender email is client's email
- [ ] **Admin Account:** Client's admin account created and tested
- [ ] **Contact Email:** All pages show correct contact email
- [ ] **Site URL:** `NEXT_PUBLIC_SITE_URL` is production domain
- [ ] **Vercel:** All environment variables updated
- [ ] **Vercel:** Site redeployed after changes

### Test After Changes:

- [ ] **Test Payment:** Make a test order with Square (use test card in production mode)
- [ ] **Test Email:** Place test order, verify confirmation email sends
- [ ] **Test Shipping:** Generate test shipping label
- [ ] **Test Admin Login:** Client can log into admin dashboard
- [ ] **Test Return:** Submit test return, verify emails send
- [ ] **Test Refund:** Process test refund, verify it works

---

## 🚨 Common Issues & Solutions

### Issue: "Square payment failed"
**Solution:** 
- Check `SQUARE_ENVIRONMENT=production` (not sandbox)
- Verify using PRODUCTION access token (not sandbox)
- Check Square dashboard for API errors

### Issue: "Shippo label generation failed"
**Solution:**
- Verify `SHIPPO_USE_TEST_ADDRESS=false`
- Check Shippo account has sufficient balance
- Verify business address is correct

### Issue: "Emails not sending"
**Solution:**
- Check `RESEND_API_KEY` is correct
- Verify `RESEND_FROM_EMAIL` is verified in Resend
- Check Resend dashboard → Logs for errors
- Verify Supabase SMTP settings are correct

### Issue: "Admin can't log in"
**Solution:**
- Verify admin user was created in Supabase Auth
- Check SQL was run to grant admin privileges
- Verify user ID matches in `admin_users` table

---

## 📝 Quick Reference: Where to Find Things

### Square Production Credentials:
- **URL:** https://developer.squareup.com/apps
- **Location:** Application → Credentials tab → Production section

### Shippo Live API Key:
- **URL:** https://apps.goshippo.com/
- **Location:** Settings → API → Live API Token

### Resend API Key:
- **URL:** https://resend.com
- **Location:** API Keys → Create/View keys

### Supabase Admin Users:
- **URL:** https://app.supabase.com
- **Location:** Authentication → Users

### Vercel Environment Variables:
- **URL:** https://vercel.com
- **Location:** Your Project → Settings → Environment Variables

---

## 🎯 Launch Day Timeline

**Morning (1-2 hours before launch):**
1. ✅ Update all environment variables in Vercel
2. ✅ Create client's admin account
3. ✅ Update email addresses
4. ✅ Redeploy site

**30 minutes before launch:**
1. ✅ Run final tests (payment, email, shipping)
2. ✅ Verify admin login works
3. ✅ Check all pages load correctly

**Launch:**
1. ✅ Announce site is live
2. ✅ Monitor for any issues
3. ✅ Have client test a real order

---

## 📞 Support

If something breaks:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Check service dashboards (Square, Shippo, Resend) for errors
4. Verify all environment variables are set correctly

---

**Last Updated:** January 2025

**Remember:** Always test in production mode before announcing launch!


