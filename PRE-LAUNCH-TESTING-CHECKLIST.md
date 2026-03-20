# Pre-Launch Testing Checklist

**Website:** creativitybylilyco.com  
**Test Date:** _____________  
**Tested By:** _____________

---

## 🛒 E-Commerce Flow (Critical)

### Product Browsing
- [ ] Homepage loads without errors
- [ ] All hero images display correctly
- [ ] "Shop Collection" button works
- [ ] Products page displays all items
- [ ] Product images load properly
- [ ] Prices display correctly
- [ ] Product filtering works (if implemented)
- [ ] Search works (if implemented)

### Individual Product Pages
- [ ] Product details load
- [ ] Multiple images display in gallery
- [ ] "Add to Cart" button works
- [ ] Quantity selector works
- [ ] Price calculates correctly
- [ ] Reviews section displays
- [ ] Review form submission works
- [ ] Star ratings display correctly

### Shopping Cart
- [ ] Items appear in cart after adding
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Cart total calculates correctly
- [ ] "Proceed to Checkout" works
- [ ] Cart persists on page refresh

### Checkout Flow
- [ ] Checkout page loads
- [ ] Shipping form validation works
- [ ] Email validation works
- [ ] Phone number validation works
- [ ] Square payment form loads
- [ ] Card tokenization works
- [ ] **TEST: Complete real purchase with small amount ($1-5)**
- [ ] Payment confirmation shows
- [ ] Redirects to success page

### After Purchase
- [ ] Order confirmation email received (check inbox & spam)
- [ ] Order appears in admin dashboard
- [ ] Order has correct status ('processing')
- [ ] Order details are accurate
- [ ] Customer info is correct
- [ ] Shipping label can be generated
- [ ] Tracking email sends after label generation

---

## 💳 Payment Testing

### Successful Payments
- [ ] Test with real card (small amount, then refund)
- [ ] Verify charge appears in Square dashboard
- [ ] Verify order created in database
- [ ] Verify email sent

### Failed Payments (Use Square Test Cards)
- [ ] **Card Declined:** `4000000000000002`
  - Shows proper error message
  - Order not created
  - User can retry
- [ ] **Insufficient Funds:** `4000000000009995`
  - Shows proper error message
- [ ] **Expired Card:** Use valid card with past expiry
  - Shows proper error message

### Edge Cases
- [ ] Network interruption during payment
- [ ] Multiple rapid submissions (should not double-charge)
- [ ] Empty cart checkout (should be blocked)
- [ ] Invalid shipping address

---

## 📱 Browser & Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (if Windows available)

### Mobile Browsers
- [ ] iOS Safari (iPhone)
- [ ] Chrome (Android)
- [ ] Samsung Internet (Android, if available)

### Device Sizes
- [ ] iPhone 12/13/14 (390px width)
- [ ] iPhone Pro Max (428px width)
- [ ] iPad (768px width)
- [ ] Laptop (1366px width)
- [ ] Desktop (1920px width)

### Check on Each Device
- [ ] Navigation menu works
- [ ] Hero section displays properly
- [ ] Product grid layout looks good
- [ ] Images load and display correctly
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)
- [ ] Forms are easy to fill out
- [ ] Checkout flow is smooth
- [ ] Payment form works

---

## 🎨 Visual & UX Testing

### General
- [ ] Logo displays correctly
- [ ] Brand colors are consistent
- [ ] Fonts load properly (script font for headlines)
- [ ] No layout shifts when loading
- [ ] Images are optimized (not too large)
- [ ] No horizontal scrolling on mobile

### Interactions
- [ ] Hover effects work on desktop
- [ ] Buttons have clear active states
- [ ] Loading states show for async actions
- [ ] Error messages are clear and helpful
- [ ] Success messages are visible
- [ ] Forms show validation errors

### Content
- [ ] No typos in copy
- [ ] Product descriptions are complete
- [ ] Prices are accurate
- [ ] Shipping information is clear
- [ ] Return policy is accessible
- [ ] Contact information is correct
- [ ] Social media links work

---

## 🔐 Security Testing

### Authentication & Authorization
- [ ] Cannot access admin without login
- [ ] Cannot view other users' orders
- [ ] Cannot edit other users' data
- [ ] Admin pages redirect if not authenticated
- [ ] Session expires appropriately

### Input Validation
- [ ] XSS: Try `<script>alert('xss')</script>` in forms
- [ ] SQL Injection: Try `' OR '1'='1` in search
- [ ] HTML injection in review comments
- [ ] Special characters in names/addresses
- [ ] Very long input strings (>1000 chars)

### Payment Security
- [ ] Card details never visible in browser network tab
- [ ] Card data never sent to your server (Square handles it)
- [ ] HTTPS enforced on all pages
- [ ] No payment tokens visible in HTML

---

## ⚡ Performance Testing

### Load Times
- [ ] Homepage loads in < 3 seconds (fast connection)
- [ ] Products page loads in < 3 seconds
- [ ] Images lazy-load properly
- [ ] No render-blocking resources

### Lighthouse Audit (Chrome DevTools)
Run on: Homepage, Products page, Single product page, Checkout

**Targets:**
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 95
- [ ] SEO: > 90

### Slow Network Testing
- [ ] Test on "Slow 3G" (Chrome DevTools → Network tab)
- [ ] Pages still usable
- [ ] Loading states show
- [ ] Images eventually load
- [ ] Core functionality works

---

## 📧 Email Testing

### Order Confirmation Email
- [ ] Sends immediately after purchase
- [ ] Contains order number
- [ ] Lists correct products
- [ ] Shows correct prices
- [ ] Includes shipping address
- [ ] Has support contact info
- [ ] Links work

### Shipping Notification Email
- [ ] Sends after label generation
- [ ] Contains tracking number
- [ ] Tracking link works
- [ ] Shows carrier info

### Admin Notification Email (if implemented)
- [ ] Sends to admin email
- [ ] Contains order details

### Email Deliverability
- [ ] Check inbox
- [ ] Check spam folder
- [ ] Test with Gmail
- [ ] Test with Apple Mail
- [ ] Test with Outlook (if possible)

---

## 🛠️ Admin Dashboard Testing

### Login
- [ ] Admin login page works
- [ ] Correct credentials grant access
- [ ] Wrong credentials show error
- [ ] Session persists

### Products Management
- [ ] View all products
- [ ] Create new product
- [ ] Edit existing product
  - [ ] Price change reflects immediately after save
  - [ ] Image updates work
  - [ ] Description updates work
- [ ] Deactivate product
- [ ] Product changes appear on frontend

### Orders Management
- [ ] View all orders
- [ ] Sort orders (by date, status, etc.)
- [ ] View order details
- [ ] Update order status
- [ ] Generate shipping label
  - [ ] Label downloads as PDF
  - [ ] Tracking number is captured
  - [ ] Tracking email sends
- [ ] Mark order as shipped
- [ ] Mark order as delivered

### Reviews Management
- [ ] View all reviews (approved & pending)
- [ ] Filter by status
- [ ] Approve review
  - [ ] Approved review appears on product page
- [ ] Reject/delete review
- [ ] Add admin response
  - [ ] Response appears on product page
- [ ] Toggle featured status

---

## 🔍 SEO & Metadata

### Meta Tags
- [ ] Homepage has title and description
- [ ] Product pages have unique titles
- [ ] Product pages have descriptions
- [ ] Open Graph tags for social sharing

### Structure
- [ ] Sitemap exists (if generated)
- [ ] Robots.txt allows crawling
- [ ] URLs are clean (no weird characters)
- [ ] Images have alt text

---

## 🚨 Error Handling

### Test Error Scenarios
- [ ] 404 page displays for bad URLs
- [ ] API errors show user-friendly messages
- [ ] Network errors are handled gracefully
- [ ] Database errors don't expose sensitive info
- [ ] Payment errors show clear next steps

### Console Errors
- [ ] Open browser console on all pages
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No failed network requests

---

## 📊 Post-Launch Monitoring Setup

### Before Launch
- [ ] Health check endpoint deployed (`/api/health`)
- [ ] Uptime monitor configured (Better Uptime, etc.)
- [ ] Vercel Analytics enabled
- [ ] Sentry installed (optional but recommended)
- [ ] Analytics installed (GA4 or Plausible)

### Alert Configuration
- [ ] Uptime alerts to email/SMS
- [ ] Error alerts configured
- [ ] Order notification emails working

---

## ✅ Final Checks

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Return/refund policy published
- [ ] Shipping policy published
- [ ] Contact information visible

### Content
- [ ] All product prices verified with client
- [ ] All product descriptions complete
- [ ] All product images uploaded
- [ ] About page content finalized
- [ ] Contact page info correct

### Third-Party Services
- [ ] Square: Production keys active
- [ ] Supabase: RLS policies enabled
- [ ] Shippo: Production mode enabled
- [ ] Resend: Domain verified
- [ ] Domain: DNS configured correctly

### Backups
- [ ] Database backup configured
- [ ] Code in Git repository
- [ ] Environment variables documented

---

## 🎉 Launch Readiness

**I confirm that:**
- [ ] All critical tests passed
- [ ] Payment flow works end-to-end
- [ ] Emails are sending
- [ ] Monitoring is configured
- [ ] Client has reviewed and approved
- [ ] Emergency contacts documented
- [ ] Rollback plan in place

**Sign-off:**

Name: ____________________  
Date: ____________________  
Signature: ____________________

---

## 🆘 If Something Goes Wrong

### Emergency Contacts
- **Developer:** [Your contact]
- **Client:** [Client contact]
- **Hosting:** Vercel support
- **Payment:** Square support (1-855-700-6000)

### Quick Fixes
- **Site down?** Check Vercel dashboard, roll back last deployment
- **Payments failing?** Check Square status page, verify env vars
- **Emails not sending?** Check Resend dashboard and API key

### Rollback Procedure
1. Go to Vercel dashboard
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Confirm rollback

---

**Last Updated:** February 2026
