# Fix: Email Sending Error - Domain Not Verified

## The Problem

Resend is rejecting emails because you're trying to send from `drivn.ai.system@gmail.com`, but Resend doesn't allow sending from Gmail addresses. You need to either:
1. Use Resend's test domain (for development) ✅ **EASIEST**
2. Verify your own domain (for production)

## Quick Fix: Use Resend Test Domain

### Step 1: Update Supabase SMTP Settings

1. Go to **Supabase Dashboard → Project Settings → Authentication → Email (SMTP)**
2. In **"Sender details"** section, change:
   - **Sender email address:** `onboarding@resend.dev`
   - **Sender name:** `creativity by lily` (keep this)
3. Click **"Save changes"**

### Step 2: Test Again

1. Try signing up with a test account
2. Check your email inbox
3. Emails should now send successfully! ✅

**Note:** Emails from `onboarding@resend.dev` might go to spam, but they'll work for testing.

---

## For Production: Verify Your Domain

When you're ready for production, you'll need to:

1. **Verify your domain in Resend:**
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Enter: `creativitybylily.com`
   - Add the DNS records Resend provides to your domain
   - Wait for verification

2. **Update Supabase SMTP:**
   - Change sender email to: `noreply@creativitybylily.com`
   - Save changes

3. **Better deliverability:**
   - Emails won't go to spam
   - Professional sender address
   - Better inbox placement

---

## Why This Happened

Resend requires domain verification for security and deliverability. You can't send from:
- ❌ `@gmail.com`
- ❌ `@yahoo.com`
- ❌ Any unverified domain

You CAN send from:
- ✅ `@resend.dev` (test domain, no verification needed)
- ✅ Your verified domain (after verification)

---

**Try the quick fix above and let me know if signup works now!**

