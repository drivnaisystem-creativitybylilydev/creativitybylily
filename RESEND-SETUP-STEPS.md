# Resend Setup & Testing Guide

## 📋 Quick Overview

**Resend** = Transactional emails (order confirmations, returns, shipping)
**Supabase** = Auth emails (password reset, email verification)

**You DON'T need to set up SMTP in Supabase** - Supabase handles auth emails automatically. Resend is separate and only for your custom transactional emails.

---

## 🚀 Step-by-Step Setup

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Click **"Sign Up"** (top right)
3. Enter your email and create password
4. Verify your email address (check inbox)

### Step 2: Get Your API Key
1. Once logged in, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"** button
3. Give it a name: `creativitybylily-dev` (or `production` for later)
4. **Copy the API key** - it starts with `re_` (you can only see it once!)
5. Save it somewhere safe

### Step 3: Add to Your Project
1. Open your `.env.local` file in the project root
2. Add these lines:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   RESEND_FROM_EMAIL=your-email@gmail.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. Replace `re_your_actual_api_key_here` with the actual key you copied
4. Replace `your-email@gmail.com` with your email address
5. Save the file

### Step 4: Restart Your Dev Server
1. Stop your current dev server (Ctrl+C or Cmd+C)
2. Start it again:
   ```bash
   npm run dev
   ```
3. This loads the new environment variables

---

## ✅ Testing Your Emails

### Test 1: Return Request Email
1. Go to your website: `http://localhost:3000`
2. Log in to a test account
3. Go to `/returns/start`
4. Select an order and submit a return
5. **Check your email inbox** - you should receive "Return Request Received" email
6. **Check server console** - you should see:
   ```
   📧 [DEV MODE] Return Request Received Email would be sent:
      To: customer@example.com
      Return: RET-20241206-1234
   ```
   OR if working:
   ```
   Email sent successfully
   ```

### Test 2: Return Approved Email (Admin)
1. Go to admin dashboard: `http://localhost:3000/admin`
2. Navigate to **Returns** section
3. Find the return you just created
4. Click on it to view details
5. Change status to **"Approved"**
6. **Check the customer's email inbox** - they should receive "Return Approved" email

### Test 3: Refund Processed Email (Admin)
1. In the same return detail page
2. Change status to **"Refunded"**
3. **Check the customer's email inbox** - they should receive "Refund Processed" email

### Test 4: Order Confirmation Email (Optional - Currently Disabled)
Currently commented out in the code, but you can enable it:
1. Open `/src/app/api/orders/create/route.ts`
2. Find the commented section around line 206
3. Uncomment the email sending code
4. Place a test order
5. Check email inbox

---

## 🔍 Troubleshooting

### Emails Not Sending?

**Check 1: Environment Variables**
```bash
# In your terminal, check if variables are loaded:
echo $RESEND_API_KEY  # Should show your key (or nothing if not loaded)
```
If nothing shows, restart your dev server.

**Check 2: Server Console**
Look for these messages:
- ✅ `Email sent successfully` = Working!
- ⚠️ `[DEV MODE] Email would be sent` = API key missing or invalid
- ❌ `Error sending email` = Check the error message

**Check 3: API Key Format**
- Must start with `re_`
- Should be about 50+ characters long
- No spaces or line breaks

**Check 4: Resend Dashboard**
1. Go to Resend dashboard → **Logs**
2. Check if emails are being sent
3. Look for any error messages

### Emails Going to Spam?
- This is normal when using a personal email (not a verified domain)
- Check spam/junk folder
- Once you verify your domain, deliverability improves

### "Invalid API Key" Error?
- Double-check you copied the entire key
- Make sure there are no extra spaces
- Restart your dev server after adding the key

---

## 🎯 What's Configured vs What's Not

### ✅ Already Configured (Working)
- Return Request Received email
- Return Approved email
- Refund Processed email
- All email templates are branded and ready

### ⏸️ Ready But Disabled
- Order Confirmation email (commented out, easy to enable)
- Shipping Confirmation email (needs integration point)

### 🔄 Separate System (Supabase)
- Password reset emails (handled by Supabase)
- Email verification (handled by Supabase)
- **You DON'T need to configure SMTP in Supabase** - it works automatically

---

## 📧 Email Configuration Details

### Current Setup
- **From Address**: Your email (for now)
- **Reply-To**: Not set (uses from address)
- **Subject Lines**: Auto-generated with order/return numbers

### Future Improvements (Optional)
1. **Verify Domain**: Use `orders@creativitybylily.com` instead of personal email
2. **Reply-To**: Set to `support@creativitybylily.com`
3. **Unsubscribe Links**: Add if needed for marketing emails (not needed for transactional)

---

## 🧪 Quick Test Checklist

After setup, verify:
- [ ] API key added to `.env.local`
- [ ] Dev server restarted
- [ ] Return request email received
- [ ] Return approved email received
- [ ] Refund processed email received
- [ ] All emails look branded and professional
- [ ] No errors in server console

---

## 💡 Pro Tips

1. **Keep API Key Secret**: Never commit `.env.local` to git (it's already in `.gitignore`)
2. **Use Different Keys**: Create separate keys for dev/production
3. **Monitor Usage**: Check Resend dashboard for email counts
4. **Test Regularly**: Send test emails before major launches

---

## 🆘 Need Help?

If emails aren't working:
1. Check server console for error messages
2. Verify API key in Resend dashboard
3. Check Resend dashboard → Logs for delivery status
4. Make sure `.env.local` is in project root (not in `src/`)

---

**That's it!** Once you add the API key and restart, emails should start working automatically. 🎉



