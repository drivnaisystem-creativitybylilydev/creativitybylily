# Email Verification Setup - Complete Checklist

Use this checklist to verify everything is configured correctly for sending verification emails.

---

## ✅ Step 1: Supabase SMTP Settings

Go to: **Supabase Dashboard → Project Settings → Authentication → Email (SMTP)**

### Enable Custom SMTP
- [ ] **"Enable custom SMTP"** toggle is **ON** (green/enabled)
- [ ] Page has been refreshed after enabling

### Sender Details
- [ ] **Sender email address:** Entered (e.g., `your-email@gmail.com`)
- [ ] **Sender name:** Entered (e.g., `creativity by lily`)

### SMTP Provider Settings
- [ ] **Host:** `smtp.resend.com` (exactly, no spaces)
- [ ] **Port number:** `465` (or try `587` if 465 doesn't work)
- [ ] **Username:** `resend` (lowercase, exactly)
- [ ] **Password:** Your full Resend API key (starts with `re_...`)
  - [ ] No extra spaces before/after the key
  - [ ] Full key is pasted (should be ~50+ characters)
  - [ ] Key matches the one in your `.env.local` file
- [ ] **Minimum interval per user:** Set (default 20 seconds is fine)

### Save Settings
- [ ] Clicked **"Save changes"** button (green button, bottom right)
- [ ] Saw a success message after saving
- [ ] No error messages displayed

---

## ✅ Step 2: Resend API Key Verification

### Get Your API Key
- [ ] Go to **Resend Dashboard → API Keys**
- [ ] Found your API key (starts with `re_...`)
- [ ] OR found it in `.env.local` as `RESEND_API_KEY=re_...`
- [ ] Copied the **entire** key (everything after `RESEND_API_KEY=`)

### Verify Key is Correct
- [ ] Key starts with `re_`
- [ ] Key is ~50+ characters long
- [ ] No spaces or line breaks in the key
- [ ] Same key used in both:
  - [ ] Supabase SMTP Password field
  - [ ] `.env.local` file (for transactional emails)

---

## ✅ Step 3: Supabase Email Confirmation Settings

Go to: **Supabase Dashboard → Authentication → Settings**

### Email Auth Settings
- [ ] **"Enable email confirmations"** is **ON** (checked/enabled)
- [ ] **"Secure email change"** is ON (optional but recommended)

### URL Configuration
Go to: **Supabase Dashboard → Authentication → URL Configuration**

- [ ] **Site URL:** Set to `http://localhost:3000` (for dev) or `https://creativitybylily.com` (for prod)
- [ ] **Redirect URLs** includes:
  - [ ] `http://localhost:3000/auth/confirm`
  - [ ] `https://creativitybylily.com/auth/confirm`
- [ ] Clicked **"Save"** after adding URLs

---

## ✅ Step 4: Check for Error Messages

### In Supabase Dashboard
- [ ] Go to **Supabase Dashboard → Logs**
- [ ] Look for any error messages related to:
  - SMTP connection
  - Email sending
  - Authentication errors
- [ ] Check the timestamp - are errors happening when you try to sign up?

### In Browser Console
- [ ] Open browser DevTools (F12)
- [ ] Go to **Console** tab
- [ ] Try signing up again
- [ ] Look for any red error messages
- [ ] Copy any error messages you see

### In Resend Dashboard
- [ ] Go to **Resend Dashboard → Logs**
- [ ] Check if emails are being sent
- [ ] Look for any error messages
- [ ] Check if emails are being blocked/rejected

---

## ✅ Step 5: Test the Configuration

### Test Signup
1. [ ] Go to `http://localhost:3000/signup`
2. [ ] Enter a test email address
3. [ ] Enter a password
4. [ ] Click "Create Account"
5. [ ] Check what happens:
   - [ ] Do you see an error message? (What does it say?)
   - [ ] Does it redirect to confirmation page?
   - [ ] Does it show "Account created" message?

### Check Email
- [ ] Check inbox of the email you used
- [ ] Check spam/junk folder
- [ ] Wait 1-2 minutes (emails can be delayed)
- [ ] Check Resend Dashboard → Logs to see if email was sent

---

## ✅ Step 6: Common Issues to Check

### SMTP Connection Issues
- [ ] Try changing port from `465` to `587` (or vice versa)
- [ ] Verify username is exactly `resend` (not `Resend` or `RESEND`)
- [ ] Make sure there are no extra spaces in any fields
- [ ] Try disabling and re-enabling "Enable custom SMTP"

### API Key Issues
- [ ] Verify API key is active in Resend (not revoked/deleted)
- [ ] Check if API key has proper permissions
- [ ] Try creating a new API key in Resend and using that

### Email Address Issues
- [ ] Sender email in Supabase matches an email you can access
- [ ] If using Gmail, make sure it's a valid Gmail address
- [ ] For production, verify domain in Resend first

### Network/Firewall Issues
- [ ] Try from a different network (mobile hotspot, etc.)
- [ ] Check if firewall is blocking SMTP ports (465, 587)
- [ ] Try from a different browser

---

## ✅ Step 7: Alternative Test Methods

### Test SMTP Connection Directly
If you have access to a terminal, you can test SMTP directly:
```bash
# This tests if SMTP connection works
# (You might not have this tool, that's okay)
```

### Use Supabase's Default Email (Temporary)
If SMTP still doesn't work:
- [ ] Go to Supabase → Authentication → Settings
- [ ] Turn OFF "Enable custom SMTP"
- [ ] Make sure "Enable email confirmations" is still ON
- [ ] Try signing up again
- [ ] This will use Supabase's default email service (unbranded but functional)
- [ ] If this works, the issue is with SMTP configuration
- [ ] If this doesn't work, the issue is with Supabase email settings in general

---

## 🔍 What Error Are You Seeing?

When you try to sign up, what exactly happens?

**Option A: Error message appears**
- [ ] What is the exact error message? (Copy it here)
- [ ] Does it appear immediately or after a delay?
- [ ] Is it in the browser or in Supabase logs?

**Option B: No error, but no email received**
- [ ] Does the signup page say "Account created"?
- [ ] Do you get redirected to confirmation page?
- [ ] Check Resend logs - is email being sent?
- [ ] Check spam folder

**Option C: Something else**
- [ ] Describe what happens

---

## 📋 Quick Verification Commands

If you have terminal access, you can verify your API key:

```bash
# Check if API key is in .env.local
cat .env.local | grep RESEND_API_KEY

# Should show: RESEND_API_KEY=re_...
```

---

## 🆘 Still Not Working?

If you've checked everything above and it's still not working:

1. **Take screenshots of:**
   - Supabase SMTP settings page (all fields visible)
   - Supabase Logs (any errors)
   - Resend Logs (email sending status)
   - Browser console errors (if any)

2. **Note down:**
   - Exact error message you see
   - When the error occurs (during signup? after signup?)
   - What email address you're using for testing

3. **Try the fallback:**
   - Disable custom SMTP
   - Use Supabase's default email service
   - This will at least let you test the rest of the flow

---

## ✅ Success Indicators

You'll know it's working when:
- [ ] Signup completes without errors
- [ ] You receive verification email in inbox
- [ ] Email is branded (if templates are set up)
- [ ] Clicking verification link works
- [ ] Resend logs show "delivered" status

---

**Next Steps:** Go through this checklist item by item and check each box. Note which items are missing or incorrect, and we can fix those specific issues!



