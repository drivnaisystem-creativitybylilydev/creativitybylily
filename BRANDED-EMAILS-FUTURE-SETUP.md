# Branded Emails Setup - Future Reference

**Status:** ✅ Email verification is working with Supabase default emails  
**Next Step:** Set up branded emails after domain purchase

---

## When You're Ready (After Domain Purchase)

### Step 1: Buy Domain
- Purchase `creativitybylily.com` (or your chosen domain)
- Set up DNS management

### Step 2: Verify Domain in Resend
1. Go to **Resend Dashboard → Domains**
2. Click **"Add Domain"**
3. Enter your domain: `creativitybylily.com`
4. Add the DNS records Resend provides to your domain
5. Wait for verification (5-15 minutes)

### Step 3: Enable Branded SMTP in Supabase
1. Go to **Supabase Dashboard → Project Settings → Authentication → Email (SMTP)**
2. Toggle **"Enable custom SMTP"** to **ON**
3. Enter:
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** Your Resend API key (from `.env.local`)
   - **Sender Email:** `noreply@creativitybylily.com`
   - **Sender Name:** `creativity by lily`
4. Click **"Save changes"**

### Step 4: Add Branded Email Templates
1. Go to **Supabase Dashboard → Authentication → Email Templates**
2. Copy the branded templates from `SUPABASE-BRANDED-EMAILS-SETUP.md`
3. Paste into:
   - **Confirm signup** template
   - **Reset Password** template (optional)
4. Click **"Save"**

### Step 5: Test
1. Sign up with a test account
2. Check inbox - should receive branded verification email! ✨

---

## What You Already Have Ready

✅ Branded email templates created (in `SUPABASE-BRANDED-EMAILS-SETUP.md`)  
✅ Resend API key configured  
✅ SMTP settings documented  
✅ All the code is ready to go

---

## Quick Reference Files

When you're ready, refer to:
- `SUPABASE-BRANDED-EMAILS-SETUP.md` - Full setup guide with templates
- `RESEND-DOMAIN-VERIFICATION.md` - Domain verification steps
- `BRANDED-EMAILS-QUICK-START.md` - Quick checklist

---

**You're all set for now!** The site works with unbranded emails, and you can easily switch to branded emails once you have a domain. 🎉

