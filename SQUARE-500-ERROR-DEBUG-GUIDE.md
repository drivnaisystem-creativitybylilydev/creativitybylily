# 🔧 Square Payments 500 Error - Debug Guide

## ✅ What I Just Fixed

### Enhanced Error Handling in `/api/payments/create`

**Added comprehensive debug logging that will now show you:**
- ✅ Square environment configuration on each request
- ✅ Incoming payment request details (safe - no card data)
- ✅ Amount conversion (dollars → cents)
- ✅ Full Square API error structure when failures occur
- ✅ Success logging with payment ID and status

**Improved error responses:**
- ✅ Now surfaces Square's actual error messages (not generic 500)
- ✅ Returns error category and code from Square
- ✅ Properly extracts errors from Square SDK structure
- ✅ Added amount validation before sending to Square

---

## 🔍 How to Debug Your 500 Error

### STEP 1: Check Your Server Logs

After deploying the updated code, try a test payment and **immediately check your logs**:

#### On Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **"Deployments"**
4. Click the latest deployment
5. Click **"Runtime Logs"** or **"Functions"**
6. Look for the emojis: 🔧 💳 📤 ⏳ ✅ or ❌

#### Locally:
1. Run `npm run dev`
2. Try a test payment
3. Watch terminal output for the debug logs

---

### STEP 2: Identify the Error Category

Look for these patterns in the logs:

#### Pattern A: Environment Variable Missing
```
❌ Square credentials not configured
SQUARE_ACCESS_TOKEN present: false
SQUARE_LOCATION_ID present: false
```
**FIX:** See "Environment Variables Checklist" below

#### Pattern B: Invalid Credentials (401)
```
❌ Payment processing exception caught:
Status Code: 401
Category: AUTHENTICATION_ERROR
Code: UNAUTHORIZED
```
**FIX:** See "Credential Validation" below

#### Pattern C: Invalid Amount or Parameters
```
❌ Square payment failed!
Category: INVALID_REQUEST_ERROR
Code: BAD_REQUEST
Detail: "amount_money.amount must be positive"
```
**FIX:** Check amount calculation in frontend

#### Pattern D: Location ID Mismatch
```
❌ Square payment failed!
Category: INVALID_REQUEST_ERROR
Code: LOCATION_NOT_FOUND
Detail: "Location not found"
```
**FIX:** Verify Location ID matches the Access Token's merchant

#### Pattern E: Sandbox/Production Mismatch
```
❌ Square payment failed!
Category: AUTHENTICATION_ERROR
Detail: "Sandbox credentials cannot be used with production"
```
**FIX:** See "Environment Mismatch" below

---

## ✅ Environment Variables Checklist

### On Vercel (Production):

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

**Verify these exist:**

```bash
# Frontend (Public) - Used in browser
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXXX
NEXT_PUBLIC_SQUARE_ENV=production

# Backend (Private) - Server-only
SQUARE_ACCESS_TOKEN=sq0atp-XXXXXXXXXX  (or EAAAl_XXXXXXXXXX)
SQUARE_LOCATION_ID=LXXXXXXXXXX
SQUARE_ENV=production
```

**CRITICAL CHECKS:**

- [ ] `NEXT_PUBLIC_SQUARE_APPLICATION_ID` starts with `sq0idp-`
- [ ] `SQUARE_ACCESS_TOKEN` starts with `sq0atp-` or `EAAAl_`
- [ ] `SQUARE_ACCESS_TOKEN` is NOT in any `NEXT_PUBLIC_` variable
- [ ] `NEXT_PUBLIC_SQUARE_ENV` matches `SQUARE_ENV` (both "production")
- [ ] No `NEXT_PUBLIC_SQUARE_LOCATION_ID` (Location ID must be server-only!)

### On Local (.env.local):

```bash
# Frontend (Public) - Used in browser
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXXX
NEXT_PUBLIC_SQUARE_ENV=production

# Backend (Private) - Server-only
SQUARE_ACCESS_TOKEN=sq0atp-XXXXXXXXXX  (or EAAAl_XXXXXXXXXX)
SQUARE_LOCATION_ID=LXXXXXXXXXX
SQUARE_ENV=production
```

---

## 🔐 Credential Validation

### Verify Your Square Credentials Are Correct:

1. **Go to:** [developer.squareup.com/apps](https://developer.squareup.com/apps)
2. **Select your application**
3. **Go to Credentials tab**
4. **Verify Production section:**

| What You Have | What It Should Be | Where It Goes |
|---------------|-------------------|---------------|
| Application ID | `sq0idp-XXXXXXXXXX` | `NEXT_PUBLIC_SQUARE_APPLICATION_ID` |
| Access Token | `sq0atp-XXXXXXXXXX` | `SQUARE_ACCESS_TOKEN` |
| Location ID | `LXXXXXXXXXX` | `SQUARE_LOCATION_ID` |

### Common Credential Mistakes:

❌ **WRONG:**
```bash
# Access token in Application ID variable
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0atp-xxxxx

# Application ID in Access Token variable
SQUARE_ACCESS_TOKEN=sq0idp-xxxxx

# Using sandbox token with production environment
SQUARE_ACCESS_TOKEN=sq0atp-sandbox-token
SQUARE_ENV=production
```

✅ **CORRECT:**
```bash
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-xxxxx  # App ID
SQUARE_ACCESS_TOKEN=sq0atp-xxxxx                # Access Token
SQUARE_ENV=production                           # Must match token
```

---

## 🔄 Environment Mismatch Issues

### Problem: Sandbox vs Production Confusion

**Symptoms:**
- Payment works locally but fails on Vercel (or vice versa)
- 401 Authentication errors
- "Invalid credentials" messages

**Diagnosis:**

Run this check in your browser console (on checkout page):

```javascript
console.log('Frontend Env:', process.env.NEXT_PUBLIC_SQUARE_ENV);
```

Should show: `"production"`

**Then check your Vercel logs for:**
```
🔧 Square Environment Config:
  Environment: production
```

**Both must match!**

**Fix:**
1. Verify `NEXT_PUBLIC_SQUARE_ENV=production` on Vercel
2. Verify `SQUARE_ENV=production` on Vercel
3. Verify your Access Token is from the **Production** section (not Sandbox)
4. Redeploy after changing env vars

---

## 🧪 Testing Checklist

### Test 1: Local Development

1. Make sure `.env.local` has all 5 variables
2. Restart dev server: `npm run dev`
3. Open checkout: `http://localhost:3000/checkout`
4. Open browser DevTools → Console
5. Add items to cart, go to checkout
6. Fill in address
7. Enter test card: `4111 1111 1111 1111`
8. Watch terminal logs for 🔧 💳 📤 emojis
9. Submit payment
10. Check for ✅ success or ❌ error with details

### Test 2: Vercel Production

1. Deploy updated code to Vercel
2. Wait for deployment to complete
3. Test payment on live site
4. **Immediately** check Vercel Runtime Logs
5. Look for the debug emojis and error details
6. Screenshot any errors for reference

---

## 📊 Common 500 Error Causes & Fixes

| Error Pattern | Cause | Fix |
|---------------|-------|-----|
| "Payment processing not configured" | Missing env vars | Add all 5 env vars to Vercel |
| "AUTHENTICATION_ERROR" / 401 | Wrong credentials or env mismatch | Verify tokens are production, not sandbox |
| "LOCATION_NOT_FOUND" | Location ID doesn't match merchant | Get Location ID from same application |
| "amount_money.amount must be positive" | Amount calculation error | Check frontend sends positive number |
| "Invalid card data" | Tokenization failed | Check Application ID is correct |
| Generic 500 with no details | Exception before reaching Square | Check env vars are loaded |

---

## 🚀 Deployment Checklist

Before going live, verify:

### On Vercel:

- [ ] All 5 environment variables are set
- [ ] Variables are set for "Production" environment
- [ ] `SQUARE_ACCESS_TOKEN` does NOT start with `NEXT_PUBLIC_`
- [ ] Deployed latest code with enhanced error handling
- [ ] Test payment shows detailed logs (not generic 500)
- [ ] Can see Square API response in logs

### After Deployment:

- [ ] Test payment end-to-end
- [ ] Check Vercel Runtime Logs show debug emojis
- [ ] Verify payment appears in Square Dashboard
- [ ] Save screenshots of successful payment logs

---

## 🆘 Troubleshooting Steps

### If You Still Get 500 Error:

1. **Check Vercel Logs First**
   - Look for the debug logs I added
   - Find the ❌ error with full details
   - Note the error category and code

2. **Verify Token Format**
   ```bash
   # In Vercel dashboard, check your SQUARE_ACCESS_TOKEN
   # Should start with: sq0atp- or EAAAl_
   # Should NOT start with: sq0idp-
   ```

3. **Test Token Manually** (Advanced)
   - Use Square's API Explorer: [developer.squareup.com/explorer](https://developer.squareup.com/explorer)
   - Try GET /v2/locations with your Access Token
   - If it fails, token is invalid/revoked

4. **Regenerate Token**
   - Go to Square Developer Dashboard
   - Credentials tab → Production
   - Click "Regenerate" on Access Token
   - Update Vercel env vars
   - Redeploy

5. **Check Amount Calculation**
   - In browser console on checkout:
   ```javascript
   // Check the total being sent
   console.log('Total:', total);
   // Should be a positive number like 25.50
   ```

6. **Verify Location ID**
   - Must be from the SAME Square application
   - Go to Locations tab in Developer Dashboard
   - Copy the Location ID exactly

---

## 📞 What to Tell Square Support (If Needed)

If you need to contact Square Support (1-855-700-6000):

**Provide them:**
1. Your Application ID (safe to share)
2. The error logs from Vercel showing:
   - Status code
   - Error category
   - Error code
   - Error detail
3. Timestamp of failed payment
4. Whether you're using Production or Sandbox
5. "I'm getting [ERROR_CODE] when calling paymentsApi.createPayment"

**DO NOT share:** Your Access Token (keep it secret!)

---

## ✅ Success Indicators

You'll know it's working when you see logs like:

```
🔧 Square Environment Config:
  Environment: production
  Location ID: LMSB4CZ8GM32M
  Access Token present: true
  Access Token prefix: sq0atp-x...

💳 Payment Request Received:
  Source ID: cnon_xxxxxxxxxxxxx...
  Idempotency Key: 1705856789123-abc123
  Amount (dollars): 25.50
  Currency: USD

📤 Sending to Square API:
  Amount in cents: 2550
  Currency: USD
  Location ID: LMSB4CZ8GM32M

⏳ Calling Square paymentsApi.createPayment...
✅ Square API Response Status: 200
✅ Payment successful!
  Payment ID: abc123xyz789
  Status: COMPLETED
  Amount: { amount: 2550, currency: 'USD' }
```

---

## 🎯 Quick Reference: Frontend vs Backend

| Item | Frontend (Browser) | Backend (Server) |
|------|-------------------|------------------|
| Application ID | ✅ `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | ❌ Not needed |
| Access Token | ❌ NEVER | ✅ `SQUARE_ACCESS_TOKEN` |
| Location ID | ❌ NEVER | ✅ `SQUARE_LOCATION_ID` |
| Environment | ✅ `NEXT_PUBLIC_SQUARE_ENV` | ✅ `SQUARE_ENV` |
| Card Tokenization | ✅ Web Payments SDK | ❌ Not needed |
| Payment Creation | ❌ Not allowed | ✅ Payments API |

---

## 📚 Next Steps

1. **Deploy the updated code** to Vercel
2. **Update environment variables** if any are missing
3. **Test a payment** and check logs
4. **Screenshot the logs** for your records
5. **Report back** with the specific error category/code you see

The enhanced logging will tell us exactly what Square is rejecting! 🎯

---

*Created: January 20, 2026*
*Status: ✅ Enhanced error handling deployed*
