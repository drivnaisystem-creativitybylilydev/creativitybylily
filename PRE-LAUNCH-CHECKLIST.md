# Pre-Launch Checklist (Excluding Square & Email)

## 🔴 CRITICAL - Must Do Before Launch

### 1. **Vercel Deployment**
- [ ] Connect GitHub repo to Vercel
- [ ] Add ALL environment variables in Vercel dashboard:
  - Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
  - Shippo keys (`SHIPPO_API_KEY`, `SHIPPO_FROM_*` addresses)
  - Resend keys (after email setup)
  - Square keys (after Square setup)
- [ ] Deploy to production
- [ ] Test production site works
- [ ] Set up custom domain (if you have one)

**Time:** 30-45 minutes

---

### 2. **Production Configuration**
- [ ] Switch `SHIPPO_USE_TEST_ADDRESS=false` in `.env.local` (and Vercel)
- [ ] Test shipping label generation with real address
- [ ] Remove any test/demo banners from checkout
- [ ] Clean up test orders from database (optional but recommended)
- [ ] Verify all product images load correctly
- [ ] Test all links (navbar, footer, etc.)

**Time:** 30 minutes

---

### 3. **Environment Variables Check**
Verify these are set in both `.env.local` AND Vercel:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SHIPPO_API_KEY`
- [ ] `SHIPPO_FROM_NAME`, `SHIPPO_FROM_STREET1`, `SHIPPO_FROM_CITY`, `SHIPPO_FROM_STATE`, `SHIPPO_FROM_ZIP`, `SHIPPO_FROM_COUNTRY`
- [ ] `SHIPPO_SHIPPING_MARKUP=2.50`
- [ ] `SHIPPO_USE_TEST_ADDRESS=false` (for production)

**Time:** 10 minutes

---

## 🟡 IMPORTANT - Should Do Before Launch

### 4. **Inventory Management** (Prevents Overselling)
- [ ] Add inventory check when adding to cart
- [ ] Show "Out of Stock" badges on products
- [ ] Prevent checkout if item becomes unavailable
- [ ] Verify inventory updates when orders are created (code might already do this)

**Time:** 1-2 hours

---

### 5. **Legal Pages Review**
- [ ] Review Privacy Policy (`/privacy`) - customize with your business info
- [ ] Review Terms of Service (`/terms`) - customize with your business info
- [ ] Review Returns Policy (`/returns`) - verify 14-day window matches your policy
- [ ] Add actual business contact information
- [ ] Add business address
- [ ] Update return shipping address

**Time:** 30 minutes

---

### 6. **End-to-End Testing**
Test these complete flows:

**Customer Flow:**
- [ ] Browse products → Add to cart → Checkout → Complete order
- [ ] Search for products
- [ ] View event details
- [ ] Navigate all pages (home, products, events, cart, checkout, account, etc.)

**Admin Flow:**
- [ ] Login to admin dashboard
- [ ] View orders
- [ ] Generate shipping label
- [ ] Update order status
- [ ] Create/edit product
- [ ] Create/edit event

**Time:** 30 minutes

---

## 🟢 NICE TO HAVE - Can Do Post-Launch

- SEO enhancements (sitemap, robots.txt)
- Google Analytics
- Product reviews/ratings
- Wishlist feature
- Cart persistence across devices (for logged-in users)

---

## 📋 Quick Pre-Launch Test

**Before going live, do this:**
1. [ ] Test one complete order (browse → cart → checkout → payment)
2. [ ] Generate a shipping label from that order
3. [ ] Verify email confirmation sends (after email setup)
4. [ ] Check admin dashboard shows the order
5. [ ] Test on mobile device
6. [ ] Check all pages load without errors

---

## 🚀 Launch Day Checklist

**Morning of launch:**
- [ ] Final test of checkout flow
- [ ] Verify all environment variables in Vercel
- [ ] Test email delivery (after email setup)
- [ ] Check Square dashboard is ready (after Square setup)
- [ ] Verify domain is connected (if using custom domain)
- [ ] Test admin dashboard access
- [ ] Have client test a real order (small test purchase)

---

## ⏱️ Estimated Time

**Minimum (Critical only):**
- Vercel deployment: 30-45 min
- Production config: 30 min
- Environment check: 10 min
- Testing: 30 min
- **Total: ~2 hours**

**Recommended (includes important):**
- Add inventory management: +1-2 hours
- Legal pages review: +30 min
- **Total: ~3-4 hours**

---

**Focus on the critical items first, then add the important ones if you have time!**



