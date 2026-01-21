# 🚀 Launch Checklist for Creativity by Lily

## ✅ Already Completed

- ✅ **Product Management** - Full CRUD in admin dashboard
- ✅ **Order Management** - View, update status, customer info
- ✅ **Shopping Cart** - Add/remove items, localStorage persistence
- ✅ **Checkout Flow** - Address form, shipping calculation, tax, order creation
- ✅ **Shipping Labels** - Shippo integration, PDF_4x6 format (Rollo compatible)
- ✅ **Analytics Dashboard** - KPIs, charts, order status breakdown
- ✅ **Events System** - Create, edit, display events with images
- ✅ **Search Functionality** - Collapsible search bar with autocomplete
- ✅ **Database Schema** - All tables created and configured
- ✅ **GitHub Repository** - Code pushed and ready for deployment

---

## 🔴 CRITICAL - Must Complete Before Launch

### 1. **Square Payment Integration** ⚠️ **BLOCKER**
**Status**: ❌ Not Started  
**Priority**: 🔴 **CRITICAL** - Cannot accept real payments without this

**What needs to be done:**
- [ ] Schedule call with client (use `README-SQUARE-CALL.md` as guide)
- [ ] Client already has Square account ✓ (used for in-person sales)
- [ ] Enable online payments in Square Dashboard
- [ ] Get Square API credentials:
  - `NEXT_PUBLIC_SQUARE_APPLICATION_ID` (starts with `sq0idp-...`) - client-side
  - `SQUARE_ACCESS_TOKEN` (starts with `sq0atp-...`) - server-side OAuth token
  - `SQUARE_LOCATION_ID` (identifies payment location)
- [ ] Install Square SDK: `npm install square`
- [ ] Create payment API route (`src/app/api/payments/create/route.ts`)
- [ ] Add Square Web Payments SDK to checkout page
- [ ] Create webhook handler (`src/app/api/webhooks/square/route.ts`)
- [ ] Test payment flow end-to-end
- [ ] Update orders table to store Square payment IDs

**Files to create/modify:**
- `src/app/api/payments/create/route.ts` (new)
- `src/app/api/webhooks/square/route.ts` (new)
- `src/app/checkout/page.tsx` (add Square Web Payments)
- `.env.local` (add Square keys)

**Estimated time**: 2-3 hours (after client call)

---

### 2. **Email Setup** ⚠️ **IMPORTANT**
**Status**: ⏸️ Code ready, needs API keys  
**Priority**: 🟡 **HIGH** - Customers expect order confirmations

**What needs to be done:**
- [ ] Set up Resend account (or alternative: SendGrid, Mailgun)
- [ ] Verify domain in Resend (add DNS records)
- [ ] Get `RESEND_API_KEY` from Resend dashboard
- [ ] Set `RESEND_FROM_EMAIL` in `.env.local` (e.g., `orders@creativitybylily.com`)
- [ ] Uncomment email code in `src/app/api/orders/create/route.ts` (line 4)
- [ ] Test order confirmation email
- [ ] Test email formatting and links

**Files already created:**
- ✅ `src/lib/email.ts`
- ✅ `src/emails/OrderConfirmation.tsx`
- ✅ `README-EMAIL-SETUP.md`

**Estimated time**: 30-45 minutes

---

### 3. **Environment Variables Verification** ⚠️ **REQUIRED**
**Status**: ⚠️ Need to verify all are set  
**Priority**: 🔴 **CRITICAL**

**Check these are set in `.env.local`:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SHIPPO_API_KEY`
- [ ] `SHIPPO_FROM_NAME`
- [ ] `SHIPPO_FROM_STREET1`
- [ ] `SHIPPO_FROM_CITY`
- [ ] `SHIPPO_FROM_STATE`
- [ ] `SHIPPO_FROM_ZIP`
- [ ] `SHIPPO_FROM_COUNTRY`
- [ ] `SHIPPO_SHIPPING_MARKUP` (should be `2.50`)
- [ ] `SHIPPO_USE_TEST_ADDRESS` (set to `false` for production)
- [ ] `RESEND_API_KEY` (after email setup)
- [ ] `RESEND_FROM_EMAIL` (after email setup)
- [ ] `NEXT_PUBLIC_SQUARE_APPLICATION_ID` (after Square setup - starts with sq0idp-...)
- [ ] `NEXT_PUBLIC_SQUARE_ENV` (production or sandbox)
- [ ] `SQUARE_ACCESS_TOKEN` (after Square setup - starts with sq0atp-...)
- [ ] `SQUARE_LOCATION_ID` (after Square setup)
- [ ] `SQUARE_ENV` (production or sandbox)

**Estimated time**: 10 minutes

---

### 4. **Production Configuration** ⚠️ **REQUIRED**
**Status**: ⚠️ Need to verify  
**Priority**: 🔴 **CRITICAL**

**Before launch:**
- [ ] Switch `SHIPPO_USE_TEST_ADDRESS=false` in `.env.local`
- [ ] Test shipping label generation with real address
- [ ] Verify all API endpoints work in production mode
- [ ] Remove any test/demo banners from checkout
- [ ] Clean up test orders from database (optional but recommended)
- [ ] Verify product images are all loading correctly
- [ ] Check all links work (navbar, footer, etc.)

**Estimated time**: 30 minutes

---

## 🟡 IMPORTANT - Should Complete Before Launch

### 5. **Vercel Deployment** ⚠️ **REQUIRED FOR LAUNCH**
**Status**: ⚠️ Repository ready, needs deployment  
**Priority**: 🟡 **HIGH**

**What needs to be done:**
- [ ] Connect GitHub repo to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Configure build settings (should auto-detect Next.js)
- [ ] Set up custom domain (if applicable)
- [ ] Deploy and test production site
- [ ] Verify all features work in production
- [ ] Set up production environment variables
- [ ] Test checkout flow in production
- [ ] Test admin dashboard in production

**Estimated time**: 30-45 minutes

**Note**: You already have the GitHub repo set up, so this should be straightforward.

---

### 6. **Inventory Management** ⚠️ **RECOMMENDED**
**Status**: ⚠️ Database has field, but not enforced  
**Priority**: 🟡 **MEDIUM** - Prevents overselling

**What needs to be done:**
- [ ] Add inventory check when adding to cart
- [ ] Show "Out of Stock" badges on products
- [ ] Prevent checkout if item becomes unavailable
- [ ] Update inventory count when orders are created
- [ ] Add inventory alerts in admin dashboard

**Files to modify:**
- `src/components/AddToCartButton.tsx`
- `src/app/checkout/page.tsx`
- `src/app/api/orders/create/route.ts`

**Estimated time**: 1-2 hours

---

## 🟢 NICE TO HAVE - Can Add Post-Launch

### 7. **User Authentication** 
**Status**: ❌ Not Started  
**Priority**: 🟢 **LOW** - Can launch with guest checkout

**Features:**
- User sign up/login
- Account page to view orders
- Password reset
- Cart persistence across devices

**Estimated time**: 3-4 hours

---

### 8. **SEO Enhancements**
**Status**: ⚠️ Partial (basic metadata done)  
**Priority**: 🟢 **LOW**

**What to add:**
- Sitemap generation
- Robots.txt optimization
- Open Graph images for products
- Structured data (JSON-LD) for products

**Estimated time**: 1-2 hours

---

### 9. **Analytics & Marketing**
**Status**: ⚠️ Basic analytics dashboard exists  
**Priority**: 🟢 **LOW**

**What to add:**
- Google Analytics integration
- Facebook Pixel (if needed)
- Newsletter signup
- Abandoned cart emails

**Estimated time**: 2-3 hours

---

## 📋 Pre-Launch Testing Checklist

Before going live, test these flows:

### Customer Flow:
- [ ] Browse products
- [ ] Add items to cart
- [ ] View cart (verify shipping calculation)
- [ ] Go through checkout
- [ ] Complete payment (test with Square sandbox or small real payment)
- [ ] Receive order confirmation email
- [ ] Search for products
- [ ] View event details
- [ ] Navigate all pages

### Admin Flow:
- [ ] Login to admin dashboard
- [ ] View orders
- [ ] Generate shipping label
- [ ] Update order status
- [ ] Create/edit product
- [ ] Create/edit event
- [ ] View analytics

---

## 🎯 Launch Timeline Estimate

**Minimum viable launch** (Critical items only):
- Square setup: 2-3 hours
- Email setup: 30-45 min
- Environment verification: 10 min
- Production config: 30 min
- Vercel deployment: 30-45 min
- **Total: ~4-5 hours**

**Recommended launch** (includes important items):
- Add inventory management: +1-2 hours
- **Total: ~5-7 hours**

---

## 🚨 Launch Day Checklist

**Morning of launch:**
- [ ] Final test of checkout flow
- [ ] Verify all environment variables are set in Vercel
- [ ] Test email delivery
- [ ] Check Square dashboard is ready
- [ ] Verify domain is connected (if using custom domain)
- [ ] Test admin dashboard access
- [ ] Have client test a real order (small test purchase)

**After launch:**
- [ ] Monitor error logs in Vercel
- [ ] Check Square dashboard for payments
- [ ] Verify emails are sending
- [ ] Monitor first few orders closely
- [ ] Be available for quick fixes if needed

---

## 📞 Support Resources

- **Square Setup**: `README-SQUARE-CALL.md`
- **Email Setup**: `README-EMAIL-SETUP.md`
- **Shippo Setup**: `README-SHIPPO-SETUP.md`
- **Vercel Deployment**: [Vercel Docs](https://vercel.com/docs)

---

**Last Updated**: Based on current codebase state  
**Next Steps**: Start with Square setup call with client

