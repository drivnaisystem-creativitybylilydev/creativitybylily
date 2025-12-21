# Branded Email Verification - Quick Start

## 🚀 5-Minute Setup

### Step 1: Get Your Resend API Key
1. Go to [resend.com](https://resend.com) → Log in
2. Go to **"API Keys"** in sidebar
3. Copy your API key (starts with `re_...`) - OR get it from `.env.local` as `RESEND_API_KEY`
4. **This API key is your SMTP password!**

**SMTP Credentials:**
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (or `587` if 465 doesn't work)
   - **Username:** `resend`
   - **Password:** Your Resend API key (the full `re_...` string) 

### Step 2: Configure Supabase SMTP
1. Go to **Supabase Dashboard** → **Project Settings** (gear icon) → **Authentication** tab
2. Scroll down to **"SMTP Settings"** section
3. Toggle **"Enable Custom SMTP"** to ON
4. Fill in these fields:
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 465
   SMTP User/Username: resend
   SMTP Password: [paste your full Resend API key - the re_... string]
   Sender Email: your-email@gmail.com
   Sender Name: creativity by lily
   ```
   
   **Where to find your API key:**
   - Option 1: Resend Dashboard → API Keys
   - Option 2: Your `.env.local` file → look for `RESEND_API_KEY=re_...`
   
   **⚠️ If you don't see a "Password" field:**
   - Make sure "Enable Custom SMTP" is toggled ON first
   - Look for "SMTP Password", "API Key", or any authentication field
   - The field might be labeled differently in your Supabase version
   
5. Click **"Save"** at the bottom

### Step 3: Add Branded Templates
1. Go to **Authentication** → **Email Templates**
2. Click **"Confirm signup"**
3. Copy the HTML template from `SUPABASE-BRANDED-EMAILS-SETUP.md`
4. Paste into Supabase template editor
5. Click **"Save"**
6. Repeat for **"Reset Password"** (optional)

### Step 4: Test
1. Go to `/signup` on your site
2. Create a test account
3. Check email inbox
4. You should see a branded verification email! ✨

---

## 📝 Full Guide

See `SUPABASE-BRANDED-EMAILS-SETUP.md` for:
- Complete step-by-step instructions
- Full HTML templates
- Troubleshooting tips
- Domain verification guide

---

## ⚡ Quick Troubleshooting

**Email not sending?**
- Try port `465` instead of `587`
- Check Resend API key is correct
- Verify SMTP is enabled in Supabase

**Template looks broken?**
- Make sure logo URL is correct: `https://creativitybylily.com/brand_logo.webp`
- Don't modify `{{ .ConfirmationURL }}` variable
- Test in different email clients

**Emails in spam?**
- Normal for unverified domains
- Verify domain in Resend for better deliverability
- Use `noreply@creativitybylily.com` after verification

