# Email Verification Troubleshooting Guide

## 🔍 What to Check When Verification Fails

### 1. Check Supabase Redirect URL Configuration

**Location**: Supabase Dashboard → Authentication → URL Configuration

**What to check:**
- Is `http://localhost:3000/auth/confirm` in the Redirect URLs list?
- Is `https://creativitybylily.com/auth/confirm` in the list (for production)?
- Make sure there are NO trailing slashes
- Make sure the URL matches EXACTLY (including http vs https)

**How to fix:**
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Under **"Redirect URLs"**, add:
   ```
   http://localhost:3000/auth/confirm
   ```
4. Click **"Save"**
5. Try the verification link again

---

### 2. Check Email Confirmation Settings

**Location**: Supabase Dashboard → Authentication → Settings

**What to check:**
- Is **"Enable email confirmations"** checked?
- What is the **"Site URL"** set to? (should be your app URL)

**How to fix:**
1. Go to **Authentication** → **Settings**
2. Make sure **"Enable email confirmations"** is ✅ checked
3. Set **"Site URL"** to: `http://localhost:3000` (for dev) or `https://creativitybylily.com` (for prod)
4. Save changes

---

### 3. Check the Email Link Format

**What the link should look like:**
```
http://localhost:3000/auth/confirm#access_token=xxx&type=signup&expires_in=3600
```

**OR** (if using query params):
```
http://localhost:3000/auth/confirm?token_hash=xxx&type=email
```

**What to check:**
- Does the link start with your Site URL?
- Does it have `#access_token=` or `?token_hash=`?
- Is the `type` parameter present?

**If the link looks wrong:**
- Check your email template in Supabase
- Go to **Authentication** → **Email Templates** → **Confirm signup**
- Make sure it uses: `{{ .ConfirmationURL }}` or includes `{{ .SiteURL }}/auth/confirm`

---

### 4. Check Token Expiration

**Issue**: Tokens expire after a certain time (usually 1 hour)

**What to check:**
- How long ago did you receive the email?
- Did you click the link immediately or wait?

**How to fix:**
- Request a new verification email
- Or disable email confirmation temporarily for testing

---

### 5. Check Browser Console

**What to check:**
- Open browser DevTools (F12)
- Go to Console tab
- Look for any errors when clicking the verification link
- Check Network tab to see if requests are failing

**Common errors:**
- `Email link is invalid or has expired` → Token expired or wrong format
- `Invalid redirect URL` → URL not in Supabase allowed list
- `Token hash is invalid` → Token format issue

---

### 6. Test with Different Methods

**Option A: Disable Email Confirmation (For Testing)**
1. Go to Supabase Dashboard → Authentication → Settings
2. Uncheck **"Enable email confirmations"**
3. Users can log in immediately after signup
4. ⚠️ **Only for development/testing!**

**Option B: Manually Confirm User**
1. Go to Supabase Dashboard → Authentication → Users
2. Find your test user
3. Click on the user
4. Click **"Confirm email"** button
5. User can now log in

---

### 7. Check Supabase Logs

**Location**: Supabase Dashboard → Logs → Auth Logs

**What to check:**
- Look for errors related to email verification
- Check if emails are being sent
- Look for token validation errors

---

## 🔧 Quick Fixes

### Fix 1: Update Redirect URL
```bash
# In Supabase Dashboard:
Authentication → URL Configuration → Add:
http://localhost:3000/auth/confirm
```

### Fix 2: Check Site URL
```bash
# In Supabase Dashboard:
Authentication → Settings → Site URL:
http://localhost:3000  (for development)
```

### Fix 3: Request New Verification Email
If the link expired, you can:
1. Try logging in (might prompt to resend verification)
2. Or manually confirm in Supabase Dashboard

---

## ✅ Verification Checklist

Before testing, make sure:
- [ ] Redirect URL is added in Supabase
- [ ] Site URL is set correctly
- [ ] Email confirmations are enabled
- [ ] Email template uses correct URL format
- [ ] You're using the link from the email (not copying/pasting)
- [ ] Link hasn't expired (click within 1 hour)

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Email link is invalid" | Check redirect URL is in Supabase allowed list |
| "Token expired" | Request new verification email |
| "Invalid redirect URL" | Add URL to Supabase redirect URLs |
| Link doesn't work | Make sure you click the link directly (don't copy/paste) |
| No email received | Check spam folder, verify email in Supabase settings |

---

**If none of these work**, the issue might be with Supabase's email service. Consider:
- Using a custom SMTP provider
- Or disabling email confirmation for development
