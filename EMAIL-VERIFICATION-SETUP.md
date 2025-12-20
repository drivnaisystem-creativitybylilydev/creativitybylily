# Email Verification Setup Guide

## ✅ Current Status

**Email verification IS configured in the code**, but you need to enable it in Supabase settings.

## How It Works

1. User signs up → Supabase sends verification email (if enabled)
2. User clicks link in email → Redirects to `/auth/confirm`
3. Email is verified → User can log in

## 🔧 Setup Steps

### Step 1: Enable Email Confirmation in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. Go to **Authentication** → **Settings**
4. Under **"Email Auth"**, check:
   - ✅ **"Enable email confirmations"** (this is the key setting!)
   - ✅ **"Secure email change"** (optional but recommended)

### Step 2: Configure Redirect URLs

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Under **"Redirect URLs"**, add:
   ```
   http://localhost:3000/auth/confirm
   https://creativitybylily.com/auth/confirm
   ```
3. Click **"Save"**

### Step 3: Test Email Verification

1. Sign up with a test email
2. Check your email inbox (and spam folder)
3. Click the verification link
4. You should be redirected to `/auth/confirm` and see "Email Verified!"

## 📧 Email Templates (Optional)

Supabase uses default email templates. You can customize them:

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Customize:
   - **Confirm signup** - Email sent when user signs up
   - **Magic Link** - For passwordless login
   - **Change Email Address** - When user changes email
   - **Reset Password** - Password reset emails

## ⚠️ Important Notes

### Development vs Production

**Development:**
- Supabase sends emails from their default domain
- Emails might go to spam
- Works immediately, no domain verification needed

**Production:**
- Consider using a custom SMTP provider for better deliverability
- Or use Supabase's email service (works but may have rate limits)
- Custom domain emails require SMTP setup

### If Emails Aren't Sending

1. **Check Supabase Dashboard** → **Authentication** → **Users**
   - Look for the user you just created
   - Check if `email_confirmed_at` is `null` (means email not verified yet)
   - Check if `confirmation_sent_at` has a timestamp (means email was sent)

2. **Check Spam Folder**
   - Supabase emails sometimes go to spam

3. **Check Email Confirmation Setting**
   - Make sure "Enable email confirmations" is ON in Supabase settings

4. **Test with Different Email**
   - Some email providers block Supabase emails
   - Try Gmail or another provider

### Disable Email Confirmation (For Testing)

If you want to skip email verification during development:

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Uncheck **"Enable email confirmations"**
3. Users can log in immediately after signup

**⚠️ Warning:** Don't disable this in production! It's a security risk.

## 🔄 Current Code Behavior

- ✅ Signup page includes `emailRedirectTo` option
- ✅ Confirmation page (`/auth/confirm`) handles email verification
- ✅ User sees success/error messages
- ✅ Auto-redirects to login after verification

## 📝 Testing Checklist

- [ ] Enable email confirmations in Supabase
- [ ] Add redirect URLs to Supabase
- [ ] Test signup with real email
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] Verify redirect to `/auth/confirm` works
- [ ] Verify user can log in after confirmation

---

**Status**: ✅ Code is ready. Just need to enable email confirmations in Supabase Dashboard.


