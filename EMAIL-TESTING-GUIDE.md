# Email Testing Guide

## 🚀 Quick Start Checklist

Before testing, make sure:
- [ ] API key added to `.env.local`
- [ ] `RESEND_FROM_EMAIL=onboarding@resend.dev` in `.env.local`
- [ ] Dev server restarted (`npm run dev`)
- [ ] You have a test user account (or can create one)
- [ ] You have at least one test order in the system

---

## 📧 Test 1: Return Request Received Email

**What it tests**: Customer submits a return request

### Steps:
1. **Log in as a regular user**
   - Go to: `http://localhost:3000/login`
   - Use a test account that has orders

2. **Navigate to returns**
   - Go to: `http://localhost:3000/returns/start`
   - OR click "Start Return" from the Returns page

3. **Submit a return**
   - Select an order from the dropdown
   - Select items to return
   - Enter a reason
   - Click "Submit Return Request"

4. **Check for email**
   - ✅ **Check inbox** of the email address used for the order
   - ✅ **Check spam folder** (emails from `onboarding@resend.dev` may go to spam)
   - ✅ **Check server console** - should see email sent confirmation

### Expected Result:
- Email titled: "Return Request Received - RET-XXXXX | creativity by lily"
- Shows return number, order number, items, and refund amount
- Branded with pink colors and logo

---

## 📧 Test 2: Return Approved Email

**What it tests**: Admin approves a return request

### Steps:
1. **Log in as admin**
   - Go to: `http://localhost:3000/admin/login`
   - Use admin credentials

2. **Navigate to Returns**
   - Go to: `http://localhost:3000/admin/returns`
   - Find the return you just created (should show as "pending")

3. **View return details**
   - Click on the return to view details

4. **Approve the return**
   - Change status dropdown to **"Approved"**
   - Click "Update Status" or save

5. **Check for email**
   - ✅ **Check inbox** of the customer's email (the one who submitted the return)
   - ✅ **Check spam folder**
   - ✅ **Check server console**

### Expected Result:
- Email titled: "Return Approved - RET-XXXXX | creativity by lily"
- Shows return address for shipping
- Shows refund amount
- Includes return instructions

---

## 📧 Test 3: Refund Processed Email

**What it tests**: Admin processes refund after receiving return

### Steps:
1. **Still in admin dashboard**
   - On the same return detail page

2. **Mark return as received**
   - Change status to **"Received"** (if not already)
   - Then change to **"Refunded"**

3. **Check for email**
   - ✅ **Check inbox** of the customer's email
   - ✅ **Check spam folder**
   - ✅ **Check server console**

### Expected Result:
- Email titled: "Refund Processed - RET-XXXXX | creativity by lily"
- Shows refund amount
- Explains processing time (5-7 business days)

---

## 🔍 How to Verify Emails Are Working

### Method 1: Check Server Console
Look for these messages in your terminal:

**✅ Working:**
```
Email sent successfully
```

**⚠️ Dev Mode (API key missing):**
```
📧 [DEV MODE] Return Request Received Email would be sent:
   To: customer@example.com
   Return: RET-20241206-1234
```

**❌ Error:**
```
Error sending email: [error details]
```

### Method 2: Check Resend Dashboard
1. Go to [resend.com](https://resend.com) → Log in
2. Click **"Logs"** in sidebar
3. You should see all sent emails with status:
   - ✅ Delivered
   - ⚠️ Pending
   - ❌ Failed (with error message)

### Method 3: Check Email Inbox
- Check the **TO** email address (customer's email)
- Check **spam/junk folder** (common for test emails)
- Look for emails from `onboarding@resend.dev`

---

## 🧪 Full Test Scenario

### Complete User Journey Test:

1. **Create test order** (if you don't have one)
   - Add products to cart
   - Checkout and complete order
   - Note the customer email used

2. **Submit return** (as customer)
   - Log in with customer account
   - Go to `/returns/start`
   - Submit return for the test order
   - ✅ **Verify**: "Return Request Received" email arrives

3. **Approve return** (as admin)
   - Log in as admin
   - Go to `/admin/returns`
   - Approve the return
   - ✅ **Verify**: "Return Approved" email arrives

4. **Process refund** (as admin)
   - Still in admin dashboard
   - Mark return as "Refunded"
   - ✅ **Verify**: "Refund Processed" email arrives

---

## 🐛 Troubleshooting

### No emails received?

**Check 1: Environment Variables**
```bash
# Make sure these are in .env.local:
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Check 2: Server Restart**
- Did you restart the dev server after adding env variables?
- Stop server (Ctrl+C) and run `npm run dev` again

**Check 3: API Key Valid**
- Go to Resend dashboard → API Keys
- Make sure the key is active
- Try creating a new key if needed

**Check 4: Email Address**
- Make sure the customer email in the order is valid
- Check spam folder
- Try with your own email address first

**Check 5: Server Console**
- Look for error messages
- Check if it says "[DEV MODE]" (means API key not loaded)
- Check for any error stack traces

### Emails in spam?

**This is normal** for `onboarding@resend.dev`:
- Check spam/junk folder
- Mark as "Not Spam" to train your email client
- Later, verify your domain for better deliverability

### "DEV MODE" in console?

This means:
- API key not found, OR
- `RESEND_FROM_EMAIL` not set

**Fix:**
1. Check `.env.local` has both variables
2. Restart dev server
3. Check file is in project root (not in `src/`)

---

## ✅ Success Checklist

After testing, you should have:
- [ ] Received "Return Request Received" email
- [ ] Received "Return Approved" email  
- [ ] Received "Refund Processed" email
- [ ] All emails show branded design (pink colors, logo)
- [ ] All emails have correct order/return numbers
- [ ] No errors in server console
- [ ] Emails appear in Resend dashboard logs

---

## 🎯 Next Steps After Testing

Once everything works:
1. ✅ You're ready to use in production!
2. Consider verifying your domain for better deliverability
3. Monitor Resend dashboard for email counts
4. Test with real customer scenarios

---

**That's it!** Follow these steps to test all your email functionality. 🎉


