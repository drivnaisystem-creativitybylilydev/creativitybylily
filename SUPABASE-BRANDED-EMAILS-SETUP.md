# Branded Email Verification Setup with Resend SMTP

This guide will help you set up branded email verification emails for Supabase using Resend's SMTP service. This way, all your auth emails (signup verification, password reset, etc.) will match your beautiful branded transactional emails.

---

## 📋 Overview

**What we're doing:**
1. Get SMTP credentials from Resend
2. Configure Supabase to use Resend SMTP
3. Create branded email templates in Supabase
4. Test the setup

**Time needed:** ~15-20 minutes

---

## Step 1: Get Your Resend API Key

### 1.1 Log into Resend Dashboard
1. Go to [resend.com](https://resend.com) and log in
2. If you don't have an account, create one (it's free)

### 1.2 Get Your API Key
1. In the Resend dashboard, go to **"API Keys"** in the left sidebar
2. You should see your existing API key (starts with `re_`)
3. **If you don't see it or need a new one:**
   - Click **"Create API Key"**
   - Give it a name: `creativitybylily-supabase`
   - Copy the key immediately (you can only see it once!)

4. **Your Resend API key is your SMTP password** - you'll use it in Supabase

**SMTP Credentials for Supabase:**
- **Host:** `smtp.resend.com`
- **Port:** `465` (or `587` if 465 doesn't work)
- **Username:** `resend`
- **Password:** Your Resend API key (the `re_...` key from above)

**Note:** Resend uses your API key as the SMTP password - there's no separate SMTP password to generate.

---

## Step 2: Configure Supabase to Use Resend SMTP

### 2.1 Go to Supabase Email Settings
1. Go to your **Supabase Dashboard**
2. Navigate to **Project Settings** (gear icon in left sidebar) → **Authentication** tab
3. Scroll down to find **"SMTP Settings"** section
4. Toggle **"Enable Custom SMTP"** to ON

### 2.2 Enter SMTP Credentials
Fill in the following fields in Supabase:

**SMTP Host:**
```
smtp.resend.com
```

**SMTP Port:**
```
465
```
(If 465 doesn't work, try `587`)

**SMTP User (or Username):**
```
resend
```

**SMTP Password:**
```
[Paste your full Resend API key here - starts with re_]
```
**Important:** This is your Resend API key from Step 1.2 (the same one in your `.env.local` file as `RESEND_API_KEY`)

**Sender Email:**
```
your-email@gmail.com
```
(For now, use your personal email. After domain verification, you can use `noreply@creativitybylily.com`)

**Sender Name:**
```
creativity by lily
```

**⚠️ If you don't see a "Password" field:**
- Some Supabase UIs might label it as "SMTP Password" or "API Key"
- Look for any field that asks for authentication credentials
- If there's only a "Username" field, try putting your API key there
- Make sure "Enable Custom SMTP" toggle is ON first

### 2.3 Save and Test SMTP Connection
1. After entering all the SMTP credentials, click **"Save"** or **"Update"** at the bottom of the SMTP settings section
2. **Note:** Supabase doesn't have a built-in "Test Email" button, so we'll test it by actually sending a verification email

**To test if SMTP is working:**
1. Go to your website: `http://localhost:3000/signup`
2. Create a test account with your email address
3. Check your inbox (and spam folder) - you should receive a verification email
4. If you receive the email, SMTP is working! ✅
5. If you don't receive it, check the troubleshooting steps below

**⚠️ Troubleshooting:**
- If emails aren't sending, try port `465` instead of `587` (change it and click Save again)
- Make sure your Resend API key is correct (the full key from `.env.local`)
- Verify "Enable Custom SMTP" toggle is ON
- Check Resend Dashboard → Logs to see if emails are being sent
- Check spam folder - emails might go there initially

---

## Step 3: Create Branded Email Templates in Supabase

Now we'll create branded templates that match your existing email design.

### 3.1 Go to Email Templates
1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. You'll see several templates:
   - **Confirm signup** (this is the verification email)
   - **Magic Link**
   - **Change Email Address**
   - **Reset Password**

### 3.2 Customize "Confirm signup" Template

Click on **"Confirm signup"** and replace the template with this branded version:

**Subject:**
```
Verify your email | creativity by lily
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fefcf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fefcf9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #f8e8e8; padding: 24px; text-align: center;">
              <img src="https://creativitybylily.com/brand_logo.webp" alt="creativity by lily" width="60" height="60" style="border-radius: 50%; display: block; margin: 0 auto 12px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ff72a6; font-family: 'Dancing Script', cursive;">creativity by lily</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #2d2d2d;">Welcome to creativity by lily! ✨</h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #2d2d2d;">
                Hi there,
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #2d2d2d;">
                Thank you for signing up! We're so excited to have you join our community. To complete your account setup, please verify your email address by clicking the button below.
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background-color: #ff72a6; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #ff72a6; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #fafafa;">
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #666;">
                If you have any questions, feel free to reach out to us.
              </p>
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #666;">
                <a href="https://creativitybylily.com" style="color: #ff72a6; text-decoration: underline;">Visit our website</a>
              </p>
              <p style="margin: 24px 0 0; font-size: 16px; line-height: 24px; color: #2d2d2d; font-style: italic;">
                With love from Cape Cod,<br>
                <span style="font-family: 'Dancing Script', cursive; color: #ff72a6;">creativity by lily</span>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Plain Text Body (for email clients that don't support HTML):**
```
Welcome to creativity by lily! ✨

Hi there,

Thank you for signing up! We're so excited to have you join our community. To complete your account setup, please verify your email address by clicking the link below:

{{ .ConfirmationURL }}

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.

If you have any questions, feel free to reach out to us.

Visit our website: https://creativitybylily.com

With love from Cape Cod,
creativity by lily
```

### 3.3 Customize "Reset Password" Template (Optional but Recommended)

Click on **"Reset Password"** and use this branded version:

**Subject:**
```
Reset your password | creativity by lily
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fefcf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fefcf9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #f8e8e8; padding: 24px; text-align: center;">
              <img src="https://creativitybylily.com/brand_logo.webp" alt="creativity by lily" width="60" height="60" style="border-radius: 50%; display: block; margin: 0 auto 12px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ff72a6; font-family: 'Dancing Script', cursive;">creativity by lily</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #2d2d2d;">Reset Your Password</h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #2d2d2d;">
                Hi there,
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #2d2d2d;">
                We received a request to reset your password. Click the button below to create a new password. If you didn't request this, you can safely ignore this email.
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background-color: #ff72a6; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 16px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; line-height: 20px; color: #ff72a6; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #666;">
                This link will expire in 1 hour. For security reasons, please don't share this link with anyone.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #fafafa;">
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #666;">
                If you have any questions, feel free to reach out to us.
              </p>
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 20px; color: #666;">
                <a href="https://creativitybylily.com" style="color: #ff72a6; text-decoration: underline;">Visit our website</a>
              </p>
              <p style="margin: 24px 0 0; font-size: 16px; line-height: 24px; color: #2d2d2d; font-style: italic;">
                With love from Cape Cod,<br>
                <span style="font-family: 'Dancing Script', cursive; color: #ff72a6;">creativity by lily</span>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Plain Text Body:**
```
Reset Your Password

Hi there,

We received a request to reset your password. Click the link below to create a new password. If you didn't request this, you can safely ignore this email.

{{ .ConfirmationURL }}

This link will expire in 1 hour. For security reasons, please don't share this link with anyone.

If you have any questions, feel free to reach out to us.

Visit our website: https://creativitybylily.com

With love from Cape Cod,
creativity by lily
```

### 3.4 Save Templates
1. After pasting each template, click **"Save"** or **"Update"**
2. Repeat for any other templates you want to brand (Magic Link, Change Email, etc.)

---

## Step 4: Configure Redirect URLs

Make sure Supabase knows where to redirect users after they click the verification link:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Under **"Redirect URLs"**, make sure you have:
   ```
   http://localhost:3000/auth/confirm
   https://creativitybylily.com/auth/confirm
   ```
3. Click **"Save"**

---

## Step 5: Test the Setup

### 5.1 Test Email Verification
1. Go to your website: `http://localhost:3000/signup`
2. Create a new test account with your email
3. Check your inbox (and spam folder)
4. You should receive a **branded verification email** with:
   - Your logo
   - Pink header (#f8e8e8)
   - Branded button
   - "creativity by lily" styling
5. Click the verification link
6. You should be redirected to `/auth/confirm` and see "Email Verified!"

### 5.2 Test Password Reset (Optional)
1. Go to `/forgot-password`
2. Enter your email
3. Check your inbox for a branded password reset email
4. Click the link to reset your password

---

## 🎨 Brand Colors Reference

For consistency, here are the brand colors used in your emails:

- **Logo Pink:** `#ff72a6`
- **Soft Pink Header:** `#f8e8e8`
- **Warm Beige:** `#f7f0e8`
- **Cream Background:** `#fefcf9`
- **Text Dark:** `#2d2d2d`
- **Text Gray:** `#666`

---

## ⚠️ Important Notes

### Domain Verification (Recommended for Production)

For better deliverability and to use `noreply@creativitybylily.com`:

1. In Resend Dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter: `creativitybylily.com`
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually a few minutes)
6. Once verified, update Supabase SMTP settings:
   - **Sender Email:** `noreply@creativitybylily.com`
   - **Sender Name:** `creativity by lily`

### Development vs Production

**Development:**
- Can use personal email as sender
- Emails might go to spam (normal)
- Works immediately

**Production:**
- Should verify domain for better deliverability
- Use `noreply@creativitybylily.com`
- Better inbox placement

---

## 🔍 Troubleshooting

### Emails Not Sending?

1. **Check SMTP Settings:**
   - Verify credentials are correct
   - Try port `465` if `587` doesn't work
   - Make sure "Enable Custom SMTP" is ON

2. **Check Resend Dashboard:**
   - Go to **"Logs"** to see if emails are being sent
   - Look for any error messages

3. **Check Spam Folder:**
   - Branded emails might still go to spam initially
   - This improves with domain verification

4. **Test SMTP Connection:**
   - Use the "Send Test Email" button in Supabase
   - If test fails, double-check credentials

### Template Not Showing Correctly?

1. **Check Logo URL:**
   - Make sure `https://creativitybylily.com/brand_logo.webp` is accessible
   - Test the URL in a browser

2. **Check Template Variables:**
   - Make sure `{{ .ConfirmationURL }}` is in the template (Supabase will replace it)
   - Don't modify the variable syntax

3. **Preview in Supabase:**
   - Some email clients have preview options
   - Test with different email providers (Gmail, Outlook, etc.)

---

## ✅ Checklist

After setup, verify:

- [ ] SMTP credentials added to Supabase
- [ ] Test email sent successfully
- [ ] "Confirm signup" template customized
- [ ] "Reset Password" template customized (optional)
- [ ] Redirect URLs configured
- [ ] Test signup sends branded email
- [ ] Verification link works
- [ ] Email looks branded and professional

---

## 🎉 You're Done!

Your email verification emails are now fully branded and match your transactional emails! All auth emails (signup, password reset, etc.) will now have the same professional look as your order confirmations and return emails.

---

**Need Help?**
- Check Supabase logs: Dashboard → Logs
- Check Resend logs: Dashboard → Logs
- Verify SMTP connection in Supabase settings
- Test with different email providers

