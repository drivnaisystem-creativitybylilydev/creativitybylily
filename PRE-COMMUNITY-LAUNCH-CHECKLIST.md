# 🚀 Pre-Community Launch Checklist
## Ready to Present to Client's Community

**Goal**: Ensure website is polished, professional, and ready for public traffic before promoting to your client's community.

---

## ✅ **Already Completed & Working**

- ✅ **Square Payments**: Production payments working (real charges)
- ✅ **Shippo Shipping**: Real USPS labels with tracking
- ✅ **Order Management**: Full order tracking and management
- ✅ **Product Catalog**: Products uploaded and displayed
- ✅ **Shopping Cart**: Add/remove items, persistence
- ✅ **Checkout Flow**: Complete checkout with address, shipping, tax
- ✅ **Admin Dashboard**: Full order and product management
- ✅ **Database**: All tables and relationships working
- ✅ **Analytics**: Order and sales tracking

---

## 🔴 **CRITICAL - Must Verify Before Public Launch**

### 1. ✅ **Payment Processing** (VERIFIED - WORKING)
- [x] Square payments processing in production
- [x] Real credit card charges working
- [x] Payment confirmation emails sending
- [x] Orders created successfully after payment
- [ ] **Action**: Test one more end-to-end purchase to be 100% sure

**Status**: ✅ **READY** (you just tested this!)

---

### 2. 🔴 **Shipping Labels & Tracking** (NEEDS VERIFICATION)

#### What to Verify:
- [ ] **Generate a test label** from admin dashboard
  - Go to Admin → Orders → Select an order → "Generate Shipping Label"
- [ ] **Check the label includes**:
  - ✅ Correct business address (your client's address)
  - ✅ Customer's shipping address
  - ✅ USPS tracking barcode
  - ✅ Tracking number (visible on label)
  - ✅ Correct postage/service level
- [ ] **Print test** (if you have access to printer):
  - Print to PDF to verify it's 4x6 inches
  - Check barcode is scannable (use phone camera)
  - Verify addresses are legible
- [ ] **Check tracking works**:
  - Copy tracking number from generated label
  - Go to USPS.com and paste tracking number
  - Verify tracking page loads (it may show "pre-shipment" until actually shipped)

#### Environment Variables to Verify:
```bash
# Check these in Vercel Dashboard → Settings → Environment Variables
SHIPPO_API_KEY=shippo_live_xxxxx  # Must be LIVE key (not test)
SHIPPO_USE_TEST_ADDRESS=false  # Must be false for production
SHIPPO_FROM_NAME=Creativity by Lily
SHIPPO_FROM_STREET1=<client's actual street>
SHIPPO_FROM_CITY=<client's actual city>
SHIPPO_FROM_STATE=MA (or whatever state)
SHIPPO_FROM_ZIP=<client's actual ZIP>
SHIPPO_FROM_COUNTRY=US
SHIPPO_SHIPPING_MARKUP=2.50
```

**Status**: ⚠️ **NEEDS VERIFICATION** (generate one test label)

---

### 3. 🔴 **Email Notifications** (NEEDS VERIFICATION)

#### What to Test:
- [ ] **Order Confirmation Email**:
  - Place a test order
  - Check customer receives email with:
    - ✅ Order number
    - ✅ Items ordered
    - ✅ Shipping address
    - ✅ Total amount
    - ✅ Contact information
- [ ] **Admin Notification Email**:
  - Verify client receives notification of new orders
- [ ] **Return Request Email**:
  - Test return submission
  - Verify both customer and admin get emails

#### Environment Variables to Verify:
```bash
RESEND_API_KEY=re_xxxxx  # Must be set
RESEND_FROM_EMAIL=creativitybylilyco@gmail.com  # Or client's email
```

**Status**: ⚠️ **NEEDS VERIFICATION**

---

### 4. 🔴 **Vercel Environment Variables** (CRITICAL)

#### Check ALL Variables Are Set:
Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Supabase:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**Square (Production):**
- [ ] `NEXT_PUBLIC_SQUARE_APPLICATION_ID` (starts with `sq0idp-...`)
- [ ] `NEXT_PUBLIC_SQUARE_ENV=production`
- [ ] `SQUARE_ACCESS_TOKEN` (your working token)
- [ ] `SQUARE_LOCATION_ID`
- [ ] `SQUARE_ENV=production`

**Shippo (Production):**
- [ ] `SHIPPO_API_KEY` (must be LIVE key)
- [ ] `SHIPPO_FROM_NAME`
- [ ] `SHIPPO_FROM_STREET1`
- [ ] `SHIPPO_FROM_CITY`
- [ ] `SHIPPO_FROM_STATE`
- [ ] `SHIPPO_FROM_ZIP`
- [ ] `SHIPPO_FROM_COUNTRY`
- [ ] `SHIPPO_SHIPPING_MARKUP=2.50`
- [ ] `SHIPPO_USE_TEST_ADDRESS=false`

**Resend (Email):**
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`

**Site:**
- [ ] `NEXT_PUBLIC_SITE_URL` (your production domain)

**Status**: ⚠️ **MUST VERIFY**

---

## 🟡 **IMPORTANT - Content & User Experience**

### 5. 📦 **Product Information Review**

- [ ] **All products have**:
  - High-quality images (no pixelation)
  - Accurate descriptions
  - Correct prices
  - Current inventory counts
  - Appropriate categories/tags
- [ ] **Product images load fast** (check on mobile)
- [ ] **No test/placeholder products** visible
- [ ] **Sold out items** are either removed or marked clearly

**Time**: 30 minutes  
**Status**: ⚠️ **NEEDS REVIEW**

---

### 6. 🏪 **Store Policies & Legal**

- [ ] **Review `/privacy` page**:
  - Update with actual business name
  - Add contact information
  - Verify data collection details
- [ ] **Review `/terms` page**:
  - Update with business name
  - Add business address
  - Verify terms match actual business practices
- [ ] **Review `/returns` page**:
  - Verify 14-day return window is correct
  - Update return shipping address
  - Add any specific return conditions
- [ ] **Update contact information** everywhere:
  - Footer
  - Contact page (if exists)
  - Return policy
  - Email templates
- [ ] **Verify business address** is correct in:
  - Shippo settings (return address)
  - Legal pages
  - Email templates

**Time**: 30-45 minutes  
**Status**: ⚠️ **MUST REVIEW**

---

### 7. 🎨 **UI/UX Polish**

#### Homepage:
- [ ] Hero section loads properly
- [ ] Featured products display correctly
- [ ] All images load
- [ ] Call-to-action buttons work
- [ ] Navigation is intuitive

#### Product Pages:
- [ ] Product images are high-resolution
- [ ] "Add to Cart" button works consistently
- [ ] Price displays correctly
- [ ] Product details are readable
- [ ] Mobile view looks good

#### Checkout:
- [ ] Shipping calculator works
- [ ] Tax calculation is correct (if applicable)
- [ ] Form validation shows helpful errors
- [ ] Payment form is secure and professional
- [ ] Loading states are clear
- [ ] Success page shows order confirmation

#### Admin Dashboard:
- [ ] Client can access and navigate easily
- [ ] Order management is intuitive
- [ ] Label generation is simple
- [ ] Analytics display correctly

**Time**: 1 hour  
**Status**: ⚠️ **NEEDS POLISH**

---

### 8. 📱 **Mobile Responsiveness**

Test on actual mobile devices (or browser dev tools):

- [ ] **Homepage** looks good on mobile
- [ ] **Product grid** displays correctly (1-2 columns)
- [ ] **Cart** is usable on mobile
- [ ] **Checkout form** is mobile-friendly
- [ ] **Navigation menu** works (hamburger menu?)
- [ ] **Images** load properly on mobile
- [ ] **Buttons** are large enough to tap
- [ ] **Forms** don't have zoom issues on iOS
- [ ] **Admin dashboard** is usable on tablet (if needed)

**Time**: 30 minutes  
**Status**: ⚠️ **MUST TEST**

---

### 9. 🔐 **Security & Performance**

- [ ] **No API keys exposed** in frontend code
  - Check browser DevTools → Network tab
  - Verify no `SQUARE_ACCESS_TOKEN` or `SUPABASE_SERVICE_ROLE_KEY` visible
- [ ] **All pages load in <3 seconds**
- [ ] **Images are optimized** (using Next.js Image component)
- [ ] **HTTPS enabled** (Vercel does this automatically)
- [ ] **Admin routes protected** (require authentication)
- [ ] **No console errors** in browser

**Time**: 20 minutes  
**Status**: ⚠️ **MUST VERIFY**

---

## 🟢 **RECOMMENDED - Before Community Launch**

### 10. 📊 **Analytics Setup**

- [ ] **Set up Google Analytics** (optional but recommended)
  - Track page views
  - Track purchases
  - Monitor traffic sources
- [ ] **Facebook Pixel** (if client uses Facebook ads)
- [ ] **Track conversions** for marketing

**Time**: 30 minutes  
**Status**: 🟢 **OPTIONAL**

---

### 11. 📈 **SEO Basics**

- [ ] **Page titles** are descriptive and unique
- [ ] **Meta descriptions** for main pages
- [ ] **Alt text** on all product images
- [ ] **Sitemap** generated (optional)
- [ ] **Robots.txt** configured (Vercel handles this)
- [ ] **Open Graph images** for social sharing

**Time**: 45 minutes  
**Status**: 🟢 **OPTIONAL**

---

### 12. 🎁 **Launch Prep**

- [ ] **Create launch announcement** (for client to share)
- [ ] **Prepare social media posts** (images of products)
- [ ] **Set up promo code** for launch day (if desired)
- [ ] **Write welcome email** template
- [ ] **Plan customer support** (who answers questions?)
- [ ] **Prepare FAQ** document
- [ ] **Test customer service email** responses

**Time**: 1-2 hours  
**Status**: 🟢 **NICE TO HAVE**

---

## 🧪 **FINAL END-TO-END TESTS**

### Test #1: Complete Customer Purchase
Do this yourself or with client:

1. [ ] Browse to homepage
2. [ ] Search for a product
3. [ ] Add product to cart
4. [ ] View cart, verify price/shipping
5. [ ] Go to checkout
6. [ ] Fill in shipping address
7. [ ] Complete payment (use real card)
8. [ ] Verify order confirmation page shows
9. [ ] Check email for confirmation
10. [ ] Verify order appears in admin dashboard
11. [ ] Generate shipping label from admin
12. [ ] Print label (if possible)
13. [ ] Verify tracking number works on USPS.com

**Status**: ⚠️ **DO THIS TODAY**

---

### Test #2: Mobile Purchase
Repeat Test #1 on a mobile device:

- [ ] Complete purchase flow on iPhone/Android
- [ ] Verify checkout works smoothly
- [ ] Check email confirmation on mobile

**Status**: ⚠️ **DO THIS TODAY**

---

### Test #3: Return Flow
- [ ] Submit a return request from Order Confirmation page
- [ ] Verify return request appears in admin dashboard
- [ ] Check return email sends to customer
- [ ] Check notification email sends to admin/client

**Status**: 🟢 **OPTIONAL**

---

## 📋 **LAUNCH DAY CHECKLIST**

### Morning of Community Announcement:

- [ ] **Do one final test purchase** (small amount)
- [ ] **Verify all environment variables** in Vercel
- [ ] **Check Square dashboard** is accessible
- [ ] **Check Shippo dashboard** is accessible
- [ ] **Test admin login** (client should test too)
- [ ] **Monitor error logs** in Vercel dashboard
- [ ] **Have client's contact info** ready for support questions
- [ ] **Be available** for quick fixes if needed

### During Launch:

- [ ] **Monitor orders** in real-time
- [ ] **Check for errors** in Vercel logs
- [ ] **Respond quickly** to any customer issues
- [ ] **Watch Square dashboard** for payments
- [ ] **Verify emails sending** for each order

### After Launch (First 24 Hours):

- [ ] **Review first 5-10 orders** closely
- [ ] **Check for any patterns** in issues
- [ ] **Document any bugs** to fix
- [ ] **Celebrate! 🎉**

---

## ⏱️ **Time Estimates**

### Minimum Launch Prep (Critical Only):
- Verify payment: 15 min ✅ (already done)
- Test shipping labels: 30 min
- Verify environment variables: 15 min
- Test emails: 15 min
- Review product info: 30 min
- Update legal pages: 30 min
- Mobile testing: 30 min
- End-to-end test: 30 min
- **Total: ~3 hours**

### Recommended Launch Prep (includes polish):
- Add UI/UX polish: +1 hour
- Security check: +20 min
- SEO basics: +45 min
- **Total: ~5 hours**

---

## 🚨 **BLOCKERS** (Must Fix Before Launch)

1. ⚠️ **Shippo Environment Variables** - Verify `SHIPPO_USE_TEST_ADDRESS=false` in Vercel
2. ⚠️ **Generate & Print Test Label** - Confirm labels are actually usable
3. ⚠️ **Legal Pages** - Must update with actual business info (liability)
4. ⚠️ **Mobile Testing** - 50%+ of traffic will be mobile
5. ⚠️ **End-to-End Purchase Test** - Must work perfectly before going public

---

## 📞 **Emergency Contacts & Resources**

### If Something Breaks:

**Square Issues:**
- Square Dashboard: https://squareup.com/dashboard
- Square Support: https://squareup.com/help

**Shippo Issues:**
- Shippo Dashboard: https://apps.goshippo.com/
- Shippo Support: https://goshippo.com/docs

**Vercel Issues:**
- Vercel Dashboard: https://vercel.com/dashboard
- Deployment Logs: Check for errors
- Environment Variables: Settings → Environment Variables

**Database Issues:**
- Supabase Dashboard: https://supabase.com/dashboard
- Check logs for errors

---

## ✅ **QUICK START - Do This First**

**If you only have 2-3 hours before launch, do these in order:**

1. ✅ **Test one complete purchase** (30 min) - CRITICAL
2. ⚠️ **Generate shipping label** (15 min) - CRITICAL
3. ⚠️ **Verify Vercel environment variables** (15 min) - CRITICAL
4. ⚠️ **Update legal pages** (30 min) - CRITICAL
5. ⚠️ **Test on mobile** (20 min) - CRITICAL
6. 🟢 **Polish UI** (30 min) - RECOMMENDED
7. 🟢 **Final test** (15 min) - RECOMMENDED

**Total: 2.5 hours for critical path**

---

## 🎯 **Success Criteria**

Your site is ready to present to the community when:

- ✅ Payments process successfully
- ✅ Shipping labels generate and print correctly
- ✅ Emails send for all order events
- ✅ Mobile experience is smooth
- ✅ Legal pages are updated
- ✅ No console errors
- ✅ Admin dashboard accessible
- ✅ Client can manage orders independently

---

**Last Updated**: January 26, 2026  
**Status**: Payment processing working! Shipping & polish needed before community launch.

