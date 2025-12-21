# 🚀 Launch & Deployment Guide - Making Your Website Public

## Overview: How Your Website Goes Live

Your website is built with **Next.js** (a React framework) and will be hosted on **Vercel** (a hosting platform). Here's how the entire system works:

---

## 🏗️ Architecture Overview

### **Your Website Stack:**

1. **Next.js** - The framework that powers your website
   - Handles pages, API routes, and server-side rendering
   - Builds your site into optimized production files

2. **Vercel** - The hosting platform (where your site lives online)
   - Automatically builds and deploys your site
   - Provides a public URL (e.g., `creativitybylily.vercel.app`)
   - Handles HTTPS, CDN, and scaling automatically
   - **Cost**: FREE for small sites

3. **Supabase** - Your database and authentication
   - Stores products, orders, users, etc.
   - Handles user login/signup
   - **Cost**: FREE tier available

4. **Resend** - Email service
   - Sends order confirmations, shipping notifications
   - **Cost**: FREE tier (3,000 emails/month)

5. **Square** - Payment processing
   - Handles credit card payments
   - **Cost**: Transaction fees only (2.9% + 30¢)

6. **Shippo** - Shipping labels
   - Generates shipping labels for orders
   - **Cost**: Pay per label (~$0.05-0.10 per label)

---

## 📦 What is Vercel?

**Vercel** is a hosting platform specifically designed for Next.js websites. Think of it as:
- **Your website's home** - Where it lives on the internet
- **Automatic deployment** - When you push code to GitHub, Vercel automatically updates your live site
- **Free hosting** - Perfect for small businesses (free tier is generous)
- **Built by Next.js creators** - Optimized for Next.js performance

### Key Features:
- ✅ **Automatic HTTPS** - Your site is secure by default
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Automatic deployments** - Every GitHub push = new deployment
- ✅ **Preview deployments** - Test changes before going live
- ✅ **Environment variables** - Secure storage for API keys

---

## 🔄 How Deployment Works

### **The Flow:**

```
Your Computer (Local)
    ↓
    git push (to GitHub)
    ↓
GitHub Repository
    ↓
Vercel (automatically detects changes)
    ↓
Vercel builds your site
    ↓
Vercel deploys to production
    ↓
Your website is live! 🌐
```

### **Step-by-Step Process:**

1. **You make changes** on your computer
2. **You commit and push** to GitHub
3. **Vercel detects** the push automatically
4. **Vercel builds** your Next.js site:
   - Runs `npm install` (installs dependencies)
   - Runs `npm run build` (builds production files)
   - Optimizes images, bundles code, etc.
5. **Vercel deploys** the built site
6. **Your site is live** at your Vercel URL

---

## 🚀 Step-by-Step: Deploying Your Site

### **Prerequisites:**
- ✅ Your code is on GitHub
- ✅ You have a Vercel account (free)
- ✅ All environment variables are ready

### **Step 1: Create Vercel Account**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub

**Why GitHub?** This allows Vercel to automatically deploy when you push code.

---

### **Step 2: Import Your Project**

1. In Vercel dashboard, click **"Add New Project"**
2. Find your `creativitybylily` repository
3. Click **"Import"**

**Vercel will auto-detect:**
- ✅ Framework: Next.js
- ✅ Build Command: `next build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

**You don't need to change these** - Vercel knows Next.js!

---

### **Step 3: Configure Environment Variables**

**This is CRITICAL** - Your site won't work without these!

In the Vercel project setup, you'll see a section for **"Environment Variables"**. Add ALL of these:

#### **Supabase Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://haodvzulrwkucolmogkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### **Shippo Variables:**
```
SHIPPO_API_KEY=your-shippo-api-key
SHIPPO_FROM_NAME=Creativity by Lily
SHIPPO_FROM_STREET1=your-street-address
SHIPPO_FROM_CITY=your-city
SHIPPO_FROM_STATE=your-state
SHIPPO_FROM_ZIP=your-zip
SHIPPO_FROM_COUNTRY=US
SHIPPO_SHIPPING_MARKUP=2.50
SHIPPO_USE_TEST_ADDRESS=false
```

#### **Resend Variables (after email setup):**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=orders@creativitybylily.com
```

#### **Square Variables (after Square setup):**
```
SQUARE_APPLICATION_ID=your-square-app-id
SQUARE_ACCESS_TOKEN=your-square-access-token
SQUARE_LOCATION_ID=your-square-location-id
SQUARE_ENVIRONMENT=production
```

**Important:**
- Copy these EXACTLY from your `.env.local` file
- No spaces around the `=` sign
- No quotes around values
- Make sure `SHIPPO_USE_TEST_ADDRESS=false` for production

---

### **Step 4: Deploy!**

1. Click **"Deploy"** button
2. Wait 2-3 minutes while Vercel builds your site
3. You'll see a progress log showing:
   - Installing dependencies
   - Building Next.js app
   - Deploying to production

4. **Success!** You'll get a URL like:
   ```
   https://creativitybylily.vercel.app
   ```

---

### **Step 5: Test Your Live Site**

1. Visit your Vercel URL
2. Test these critical flows:
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Checkout (test with Square sandbox first!)
   - ✅ Admin login
   - ✅ Create order
   - ✅ Generate shipping label

**If something breaks:**
- Check Vercel's deployment logs
- Verify all environment variables are set
- Check browser console for errors

---

## 🔄 How Updates Work

### **Automatic Deployments:**

Once connected, **every time you push to GitHub**, Vercel automatically:
1. Detects the change
2. Builds a new version
3. Deploys it
4. Your site updates (usually within 2-3 minutes)

**No manual steps needed!** Just:
```bash
git add .
git commit -m "Update products"
git push
```

### **Preview Deployments:**

Vercel also creates **preview deployments** for:
- Pull requests (test changes before merging)
- Feature branches (test new features)

These get unique URLs like:
```
https://creativitybylily-git-feature-branch.vercel.app
```

---

## 🌐 Custom Domain Setup (Optional)

If you have a domain (e.g., `creativitybylily.com`):

### **Step 1: Add Domain in Vercel**

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `creativitybylily.com`
4. Click **"Add"**

### **Step 2: Configure DNS**

Vercel will show you DNS records to add. Go to your domain registrar (Namecheap, GoDaddy, etc.) and add:

**Type A Record:**
```
Name: @
Value: 76.76.21.21
```

**Type CNAME Record:**
```
Name: www
Value: cname.vercel-dns.com
```

**Wait 24-48 hours** for DNS to propagate, then your domain will work!

---

## 🔍 Monitoring Your Site

### **Vercel Dashboard Shows:**

1. **Deployments** - History of all deployments
2. **Analytics** - Page views, visitors (if enabled)
3. **Logs** - Server logs, errors, API calls
4. **Functions** - API route performance
5. **Environment Variables** - Manage secrets

### **Key Metrics to Watch:**

- **Build time** - Should be 2-5 minutes
- **Deployment status** - Should be "Ready"
- **Error rate** - Should be 0% (check logs if not)
- **Response time** - Should be < 200ms

---

## 🛠️ Troubleshooting Common Issues

### **Issue: Build Fails**

**Symptoms:** Deployment shows "Build Failed"

**Common Causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Fix:**
1. Check build logs in Vercel
2. Fix errors locally first (`npm run build`)
3. Verify all environment variables are set

---

### **Issue: Site Works Locally, Not on Vercel**

**Symptoms:** Site loads but features don't work

**Common Causes:**
- Environment variables not set in Vercel
- API routes failing
- Database connection issues

**Fix:**
1. Verify ALL environment variables are in Vercel
2. Check Vercel function logs
3. Test API routes directly

---

### **Issue: Slow Deployments**

**Symptoms:** Builds take > 5 minutes

**Common Causes:**
- Large dependencies
- Too many files
- Network issues

**Fix:**
- Usually not a problem (Vercel is fast)
- Check build logs for bottlenecks
- Consider optimizing images/assets

---

## 📋 Pre-Deployment Checklist

Before your first deployment, verify:

- [ ] All environment variables are ready
- [ ] `SHIPPO_USE_TEST_ADDRESS=false` (for production)
- [ ] Square credentials are set (or use sandbox for testing)
- [ ] Resend API key is set (or emails will fail silently)
- [ ] Test build locally: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Product images are uploaded
- [ ] Legal pages are customized

---

## 🔐 Security Best Practices

### **Environment Variables:**
- ✅ **Never commit** `.env.local` to GitHub
- ✅ **Always use** Vercel's environment variable UI
- ✅ **Rotate keys** if exposed
- ✅ **Use different keys** for development vs production

### **API Keys:**
- ✅ **Service role keys** should NEVER be in client-side code
- ✅ **Public keys** (NEXT_PUBLIC_*) are safe to expose
- ✅ **Square tokens** must be server-side only

---

## 📊 What Happens After Launch

### **Immediate:**
1. Your site is live at Vercel URL
2. Customers can browse and purchase
3. Orders go to Supabase database
4. Admin can manage orders in dashboard

### **Ongoing:**
1. **Monitor Vercel logs** for errors
2. **Check Square dashboard** for payments
3. **Review Supabase** for new orders
4. **Test email delivery** (order confirmations)

### **Maintenance:**
- Updates are automatic (just push to GitHub)
- Vercel handles scaling automatically
- No server management needed

---

## 💰 Cost Breakdown

### **Free Tier (What You Get):**
- ✅ **Vercel**: Free (100GB bandwidth/month)
- ✅ **Supabase**: Free (500MB database, 50K users/month)
- ✅ **Resend**: Free (3,000 emails/month)

### **Pay-As-You-Go:**
- **Square**: 2.9% + 30¢ per transaction
- **Shippo**: ~$0.05-0.10 per label

### **When You Need to Upgrade:**
- Vercel Pro ($20/month) - If you exceed 100GB bandwidth
- Supabase Pro ($25/month) - If you exceed free tier limits
- Resend Pro ($20/month) - If you send > 3,000 emails/month

**For a small business, you'll likely stay on free tiers!**

---

## 🎯 Quick Reference

### **Deploy Command:**
```bash
# Just push to GitHub - Vercel handles the rest!
git add .
git commit -m "Your changes"
git push
```

### **Check Deployment Status:**
- Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
- Click your project
- View "Deployments" tab

### **View Logs:**
- Vercel Dashboard → Your Project → "Logs" tab
- Or: Vercel Dashboard → Your Project → Specific Deployment → "View Function Logs"

### **Redeploy:**
- Click "Redeploy" button in Vercel dashboard
- Or: Make a new commit and push

---

## 📚 Additional Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

## ✅ Summary

**To make your website public:**

1. ✅ Push code to GitHub
2. ✅ Connect GitHub to Vercel
3. ✅ Add environment variables in Vercel
4. ✅ Click "Deploy"
5. ✅ Test your live site
6. ✅ (Optional) Add custom domain

**That's it!** Your site is now live and will automatically update whenever you push code to GitHub.

---

**Last Updated**: Based on current codebase  
**Next Step**: Set up Vercel account and deploy!

