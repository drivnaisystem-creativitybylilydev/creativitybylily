# Production Monitoring & Debugging Guide

## 🎯 Overview
This guide outlines the monitoring and debugging infrastructure for creativitybylilyco.com to ensure a seamless user experience and quick issue resolution.

---

## ✅ Current Setup Status

### Implemented ✓
- ✅ Vercel automatic deployments
- ✅ Git version control
- ✅ Environment variables for secrets
- ✅ Square payment processing
- ✅ Supabase database with RLS
- ✅ Shippo shipping integration
- ✅ Email notifications via Resend

### Missing ❌ (Recommended to Add)
- ❌ Error tracking (Sentry)
- ❌ User analytics (GA4 or Plausible)
- ❌ Uptime monitoring
- ❌ Performance monitoring
- ❌ User feedback mechanism
- ❌ Structured logging

---

## 🚨 Priority 1: Error Tracking with Sentry

### Why Sentry?
- **Real-time error alerts** when users encounter bugs
- **Full context**: See user actions leading to error
- **Performance monitoring** for slow pages
- **Release tracking** to identify which deployment broke something
- **Free tier**: 5,000 errors/month

### Setup Instructions

#### Step 1: Install Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Step 2: Configure Environment Variables
Add to Vercel environment variables:
```
SENTRY_DSN=<your-dsn-from-sentry.io>
NEXT_PUBLIC_SENTRY_DSN=<your-dsn-from-sentry.io>
```

#### Step 3: Test It
```javascript
// Add this to any page temporarily to test:
throw new Error("Test Sentry error tracking");
```

#### Step 4: Set Up Alerts
- Go to Sentry dashboard → Alerts
- Create alert: "Email me when error occurs"
- Set threshold: Alert on first occurrence

### What Sentry Will Catch
- ✅ JavaScript errors in browser
- ✅ API route failures
- ✅ Unhandled promise rejections
- ✅ Payment processing errors
- ✅ Database query failures
- ✅ Performance bottlenecks

---

## 📊 Priority 2: Analytics & User Behavior

### Option A: Plausible Analytics (Recommended)
**Pros:**
- Privacy-friendly (no cookies, GDPR compliant)
- Simple, beautiful dashboard
- Lightweight (< 1KB script)
- Shows key metrics: visitors, pages, sources

**Cons:**
- Paid ($9/month after trial)

**Setup:**
1. Sign up at plausible.io
2. Add script tag to `src/app/layout.tsx`:
```html
<Script
  defer
  data-domain="creativitybylilyco.com"
  src="https://plausible.io/js/script.js"
/>
```

### Option B: Google Analytics 4 (Free)
**Pros:**
- Free forever
- Powerful features
- Integration with Google Ads

**Cons:**
- Complex setup
- Privacy concerns
- Slower script

**Setup:**
1. Create GA4 property
2. Install `next/script` tracking code
3. Set up e-commerce events for checkout funnel

---

## ⏰ Priority 3: Uptime Monitoring

### Recommended: Better Uptime (Free Tier)
**What it does:**
- Checks your site every 3 minutes
- Emails/SMS you if site goes down
- Shows uptime percentage
- Monitors API endpoints

**Setup:**
1. Sign up at betteruptime.com
2. Add monitors:
   - https://creativitybylilyco.com (main site)
   - https://creativitybylilyco.com/products (shop page)
   - https://creativitybylilyco.com/api/health (create this endpoint)

### Create Health Check Endpoint
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Test database connection
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').select('count').limit(1);
    
    if (error) throw error;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

---

## 📝 Priority 4: Enhanced Logging

### Current State
- Basic `console.log` in API routes
- Some error logging in payment route

### Improvements Needed

#### 1. Structured Logging
Create a logger utility:

```typescript
// src/lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  orderId?: string;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack,
    });
  },
  debug: (message: string, context?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, context);
    }
  },
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Console output (Vercel captures this)
  console[level === 'debug' ? 'log' : level](JSON.stringify(entry));

  // Could also send to external service like Logtail, Axiom, etc.
}
```

#### 2. Critical Events to Log
- ✅ Payment attempts (success/failure)
- ✅ Order creation
- ✅ Shipping label generation
- ✅ Email sends
- ✅ Admin actions (product updates, etc.)
- ✅ Authentication failures
- ✅ Rate limit hits

---

## 🐛 Priority 5: User Feedback Mechanism

### Option 1: Simple "Report a Problem" Button
Add to footer or contact page:

```typescript
// src/components/ReportIssue.tsx
'use client';

export default function ReportIssue() {
  const handleReport = () => {
    const url = `mailto:support@creativitybylilyco.com?subject=Website Issue&body=${encodeURIComponent(
      `Issue URL: ${window.location.href}\n` +
      `Browser: ${navigator.userAgent}\n` +
      `Time: ${new Date().toISOString()}\n\n` +
      `Please describe the issue:\n`
    )}`;
    window.location.href = url;
  };

  return (
    <button onClick={handleReport} className="text-sm text-gray-500 hover:text-gray-700">
      Report a Problem
    </button>
  );
}
```

### Option 2: Feedback Widget (e.g., Canny, UserVoice)
Let users suggest features and vote on them.

---

## 📋 Pre-Launch Testing Checklist

### E-Commerce Flow Testing
- [ ] Browse products as guest
- [ ] Add to cart and update quantities
- [ ] Proceed to checkout
- [ ] **Test real payment** with small amount (then refund in Square)
- [ ] Verify order confirmation email received
- [ ] Check order appears in admin dashboard
- [ ] Verify order appears in database
- [ ] Test shipping label generation
- [ ] Check customer receives tracking email

### Browser Testing
Test on:
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)
- [ ] Samsung Internet (Android)

### Device Testing
- [ ] iPhone (various sizes)
- [ ] Android phone
- [ ] iPad
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)

### Payment Edge Cases
- [ ] Declined card (use Square test card: 4000000000000002)
- [ ] Network error during payment
- [ ] Insufficient funds
- [ ] Expired card
- [ ] Cancel payment flow

### Performance Testing
- [ ] Test on slow 3G connection
- [ ] Check Lighthouse score (aim for 90+)
- [ ] Verify images load properly
- [ ] Check page load times (< 3 seconds)

### Security Testing
- [ ] Try XSS in form inputs
- [ ] Test SQL injection in search
- [ ] Attempt to access admin without login
- [ ] Try to modify other users' orders
- [ ] Test HTTPS is enforced
- [ ] Verify payment card data never touches your server

### Admin Testing
- [ ] Create product
- [ ] Edit product
- [ ] Delete (deactivate) product
- [ ] View orders
- [ ] Update order status
- [ ] Generate shipping labels
- [ ] Moderate reviews
- [ ] Respond to reviews

---

## 🔄 Monitoring Dashboard Setup

### Vercel Dashboard
Monitor:
- Deployment status
- Build logs
- Function execution logs
- Error rates
- Response times

**Where:** vercel.com/dashboard

### Sentry Dashboard
Monitor:
- Error frequency
- New vs. recurring errors
- Affected users
- Error trends
- Performance issues

**Where:** sentry.io/organizations/[your-org]/issues/

### Square Dashboard
Monitor:
- Payment success rate
- Refunds
- Chargebacks
- Failed payments

**Where:** squareup.com/dashboard

### Supabase Dashboard
Monitor:
- Database size
- API calls
- Query performance
- Active connections

**Where:** supabase.com/dashboard/project/[your-project]

---

## 📱 Alert Configuration

### Critical Alerts (Page Immediately)
- Site is down (uptime monitor)
- Payment processing failing (>3 failures in 5 min)
- Database connection lost
- API error rate > 10%

### Important Alerts (Email)
- New Sentry error
- Order placed (for first few weeks)
- Low stock on products
- Negative review submitted

### Informational (Daily Digest)
- Daily sales summary
- Traffic statistics
- New user signups (if you add this)

---

## 🧪 Post-Launch Monitoring Routine

### First 24 Hours
- [ ] Check Sentry every 2 hours
- [ ] Monitor Vercel logs continuously
- [ ] Test complete purchase flow every 4 hours
- [ ] Check email deliverability
- [ ] Monitor uptime

### First Week
- [ ] Check Sentry daily
- [ ] Review Vercel error logs
- [ ] Analyze GA4/Plausible traffic
- [ ] Test checkout flow daily
- [ ] Review customer feedback

### Ongoing
- [ ] Weekly Sentry review
- [ ] Weekly analytics review
- [ ] Monthly performance audit
- [ ] Quarterly security review

---

## 🛠️ Debugging Process When Issue Occurs

### Step 1: Identify the Issue
**Sources:**
- Sentry error notification
- Customer email/complaint
- Uptime monitor alert
- Your own testing

### Step 2: Gather Context
Check:
- **Sentry:** Full error stack trace, user actions
- **Vercel Logs:** Function logs, build logs
- **Database:** Check Supabase logs
- **Browser DevTools:** If client-side issue

### Step 3: Reproduce
- Try to recreate the exact scenario
- Check if it's browser-specific
- Test on multiple devices
- Try different user accounts

### Step 4: Fix & Deploy
1. Create fix locally
2. Test thoroughly
3. Push to GitHub
4. Vercel auto-deploys
5. Verify fix in production

### Step 5: Monitor
- Watch Sentry for 24h to confirm fix
- Check if error recurs
- Update documentation if needed

---

## 💰 Cost Summary

### Free Tier (Recommended to Start)
- ✅ Sentry: 5K errors/month
- ✅ Vercel Analytics: Basic metrics
- ✅ Better Uptime: 10 monitors
- ✅ Google Analytics 4: Unlimited
- ✅ Supabase: 500MB database
- ✅ Square: No monthly fee
- ✅ Resend: 100 emails/day

**Total: $0/month**

### Paid Upgrade Path (When Scaling)
- Plausible: $9/month (if you prefer over GA4)
- Sentry Team: $26/month (10K errors)
- Better Uptime Pro: $18/month (more checks)
- Supabase Pro: $25/month (8GB database)

**Total: ~$80/month (only when needed)**

---

## 🎬 Next Steps

### Immediate (Do Now)
1. **Create health check endpoint** (see code above)
2. **Set up uptime monitoring** (5 minutes)
3. **Enable Vercel Analytics** (1 click)

### This Week
4. **Install Sentry** (15 minutes)
5. **Set up Google Analytics or Plausible** (30 minutes)
6. **Run through testing checklist** (2 hours)

### Before Launch
7. **Test complete purchase flow 5 times**
8. **Get 3 friends to test site**
9. **Set up alert notifications**
10. **Review all monitoring dashboards**

---

## 📞 Emergency Contacts

### If Site Goes Down
1. Check Vercel status page: vercel-status.com
2. Check Supabase status: status.supabase.com
3. Check domain registrar/DNS
4. Roll back last deployment in Vercel dashboard

### If Payments Failing
1. Check Square status: status.squareup.com
2. Review Square dashboard for errors
3. Check Sentry for payment API errors
4. Verify environment variables in Vercel

### If Emails Not Sending
1. Check Resend dashboard
2. Verify Resend API key
3. Check email in spam folder
4. Review Resend logs

---

## 📚 Additional Resources

- [Vercel Monitoring Docs](https://vercel.com/docs/concepts/observability)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Vercel Logs](https://vercel.com/docs/concepts/observability/runtime-logs)

---

**Last Updated:** February 2026
**Maintained By:** Development Team
