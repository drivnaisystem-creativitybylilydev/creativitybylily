# 🎯 Square Credentials - Live Meeting Guide

**Use this guide during your meeting with your client to get the correct Square credentials.**

---

## 📋 Before You Start

### What You Need From This Meeting:
- [ ] Application ID (starts with `sq0idp-...`)
- [ ] Access Token (starts with `sq0atp-...` or `EAAAl...`)
- [ ] Location ID (usually starts with `L...`)
- [ ] Confirmation of environment (Production vs Sandbox)

### What You'll Need During the Meeting:
- Your client's laptop with Square account access
- This guide open on your screen
- Your `.env.local` file ready to edit
- 15-20 minutes of focused time

---

## 🚀 STEP-BY-STEP PROCESS

### STEP 1: Access Square Developer Dashboard

**Have your client do this:**

1. Open browser and go to: **[developer.squareup.com/apps](https://developer.squareup.com/apps)**

2. Click **"Sign In"** (top right)

3. Sign in with their Square account credentials
   - This is the SAME account they use for in-person sales
   - Username/Email and Password

4. You should see the **"My Applications"** page

**✅ SUCCESS:** You see a page titled "My Applications" or "Applications"

**❌ PROBLEM:** Can't log in?
- **Fallback A:** Have them log into regular Square Dashboard first: [squareup.com/dashboard](https://squareup.com/dashboard)
- **Fallback B:** Then try the developer link again
- **Fallback C:** Look for a menu option like "Developer" or "APIs & Apps" in the main Square Dashboard

---

### STEP 2: Find or Create Application

**Look at the screen:**

#### SCENARIO A: You See Existing Application(s) ✅

You'll see one or more application cards with names like:
- "Creativity by Lily Website"
- "My App"
- "Default Application"
- Or any custom name

**ACTION:** Click on the application that's being used for the website
- If unsure which one, ask: "Do you remember setting up an app for online payments?"
- If there's only ONE application, that's probably it!

#### SCENARIO B: No Applications Exist ⚠️

The page is empty or says "No applications yet"

**ACTION:** Click **"+ Create Application"** or **"New Application"**

**Fill in:**
- **Application Name:** `Creativity by Lily Website` (or any name)
- **Description:** `Online payment processing for creativitybylily.com` (optional)

**Click:** "Create" or "Save"

**✅ SUCCESS:** You now have an application card

---

### STEP 3: Get Application ID (Frontend Credential)

**Now you should be INSIDE the application details page.**

1. **Look at the top of the page** - You should see:
   ```
   Application ID: sq0idp-XXXXXXXXXXXXXXXXXX
   [Copy]
   ```

2. **Click the "Copy" button** next to the Application ID

3. **Paste it somewhere safe** (Notes app, text file, etc.)

4. **Verify:** It should start with `sq0idp-`

**✅ CHECKPOINT:** You should now have written down:
```
Application ID: sq0idp-XXXXXXXXXXXXXXXXXX
```

**❌ PROBLEM:** Don't see Application ID at the top?
- **Fallback A:** Look for a section called "Credentials" in the left sidebar and click it
- **Fallback B:** Look for tabs at the top (Overview, Credentials, Locations) - click "Credentials"
- **Fallback C:** The Application ID might be labeled as "App ID" or "Production Application ID"

---

### STEP 4: Get Access Token (Backend Credential - MOST IMPORTANT)

**Still on the application page:**

1. **Click the "Credentials" tab** (if not already there)
   - Should be in the left sidebar or top tabs

2. **You should see TWO sections:**
   - **Sandbox** (for testing)
   - **Production** (for real payments)

3. **Make sure you're looking at the "Production" section** ⚠️
   - It should be clearly labeled "Production" or have a toggle switch
   - DO NOT use "Sandbox" unless you want to test only

---

#### OPTION A: OAuth Access Token (Recommended - Modern) ✅

**Look for:**
```
Production Access Token
[Show] [Copy]
```

**Steps:**
1. Click **"Show"** to reveal the token
2. Click **"Copy"** to copy it
3. **Paste it somewhere safe**
4. **Verify:** It should start with `sq0atp-`

**✅ CHECKPOINT:** You should now have written down:
```
Access Token: sq0atp-XXXXXXXXXXXXXXXXXX
```

---

#### OPTION B: No OAuth Token Visible? Check for Legacy Token

**If you don't see "Production Access Token" but you see:**
- "Personal Access Token"
- "Access Token" (without "Production" label)
- A token that starts with `EAAA`

**Steps:**
1. Click **"Show"** or **"Reveal"** to reveal the token
2. Click **"Copy"** to copy it
3. **Paste it somewhere safe**
4. **Verify:** It should start with `EAAA` or `EAAAl`

**✅ CHECKPOINT:** You should now have written down:
```
Access Token: EAAAl_XXXXXXXXXXXXXXXXXX
```

**Note:** This is a legacy token - it should still work, but consider updating to OAuth in the future.

---

#### OPTION C: Need to Generate a New Token

**If you see:**
- "No token generated yet"
- "Generate Access Token" button
- Token was revoked or expired

**Steps:**
1. Click **"Generate Token"** or **"Create Access Token"**
2. You might see a confirmation dialog - click "Confirm" or "Generate"
3. **IMPORTANT:** Copy the token IMMEDIATELY and save it
   - You might not be able to see it again!
4. Paste it somewhere safe

**✅ CHECKPOINT:** You now have the new token

---

### STEP 5: Get Location ID

**Still on the application page:**

1. **Click the "Locations" tab**
   - Should be in the left sidebar or top tabs

2. **You should see a list of location(s)**
   - Usually there's just ONE location for small businesses
   - Each location will have a name and ID

3. **Look for:**
   ```
   Location Name: Main Location (or your business name)
   Location ID: LXXXXXXXXXXXXXXXXX
   [Copy]
   ```

4. **Click "Copy"** next to the Location ID

5. **Paste it somewhere safe**

**✅ CHECKPOINT:** You should now have written down:
```
Location ID: LXXXXXXXXXXXXXXXXX
```

**❌ PROBLEM:** Don't see Locations tab in the Developer Dashboard?

**Fallback A:** Get it from the main Square Dashboard
1. Go to: [squareup.com/dashboard](https://squareup.com/dashboard)
2. Click **Settings** (gear icon) in the left sidebar
3. Click **Business** → **Locations**
4. You'll see your location(s) with IDs

**Fallback B:** Use the Square API Explorer (Advanced)
1. In Developer Dashboard, look for "API Explorer" or "Test API"
2. Try the `/v2/locations` endpoint
3. Copy the location ID from the response

---

### STEP 6: Confirm Environment

**Quick question for your client:**

"Are we using this for REAL payments with real credit cards, or just testing?"

- **Real payments** → Environment: `production` ✅
- **Testing only** → Environment: `sandbox` (not ready for launch)

**Most likely answer:** Production (real payments)

**✅ CHECKPOINT:** Confirm you're using **Production** credentials

---

## 📝 SUMMARY - What You Should Have Now

By the end of this meeting, you should have written down:

```
1. Application ID: sq0idp-XXXXXXXXXXXXXXXXXX
2. Access Token: sq0atp-XXXXXXXXXXXXXXXXXX (or EAAAl_XXXXXXXXXX)
3. Location ID: LXXXXXXXXXXXXXXXXX
4. Environment: production
```

---

## 🔧 IMMEDIATELY AFTER THE MEETING

### Update Your `.env.local` File

Open your project and edit `.env.local`:

```bash
# =============================================================================
# SQUARE PAYMENT PROCESSING (PRODUCTION)
# =============================================================================

# Frontend (Public) - Application ID for Square Web Payments SDK
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-[paste Application ID here]
NEXT_PUBLIC_SQUARE_ENV=production

# Backend (Private) - Access Token and Location ID
# NEVER expose these to the browser!
SQUARE_ACCESS_TOKEN=sq0atp-[paste Access Token here]
SQUARE_LOCATION_ID=[paste Location ID here]
SQUARE_ENV=production
```

### Restart Your Dev Server

```bash
# Stop the server (Ctrl+C or Cmd+C in terminal)
# Then restart:
npm run dev
```

### Test Immediately

1. Go to your checkout page: `http://localhost:3000/checkout`
2. Add items to cart
3. Fill in shipping information
4. Square payment form should load ✅
5. Enter test card: `4111 1111 1111 1111`, CVV: `123`, Zip: `12345`
6. Click "Complete Order"
7. Should process successfully (no 401 error!) ✅

### Verify in Square Dashboard

1. Have your client go to: [squareup.com/dashboard](https://squareup.com/dashboard)
2. Click **"Transactions"** or **"Sales"**
3. Look for the test payment you just made
4. It should appear within a few seconds ✅

**⚠️ NOTE:** If using production credentials, this will be a REAL charge! Test with a small amount (like $1.00) that you can refund later.

---

## 🚨 TROUBLESHOOTING - During the Meeting

### PROBLEM 1: Can't find Developer Dashboard
**Symptoms:** Client logged into Square but can't find developer section

**Solutions:**
1. Go to: [squareup.com/dashboard](https://squareup.com/dashboard)
2. Look for menu items like:
   - "Apps & APIs"
   - "Developer"
   - "Integrations"
   - "Account & Settings" → "Developer"
3. Or directly visit: [developer.squareup.com/apps](https://developer.squareup.com/apps)

### PROBLEM 2: Multiple Applications Exist
**Symptoms:** See 3+ applications, unsure which to use

**Solutions:**
1. Ask client: "Which one did we use before?" (if this is a re-setup)
2. Look for application names that mention the website
3. Check the "Created" date - use the most recent one
4. **Safe option:** Create a NEW application specifically for this website

### PROBLEM 3: Access Token Already Revealed But Not Saved
**Symptoms:** Token exists but can't see it again

**Solutions:**
1. **Generate a new one:** Click "Regenerate" or "Create New Token"
2. ⚠️ Warning: This will invalidate the old token
3. If website is already live and using the old token, coordinate this change carefully
4. Save the new token immediately before closing the page

### PROBLEM 4: Account Permissions Issue
**Symptoms:** Client logged in but sees "No permissions" or restricted access

**Solutions:**
1. Verify they're the **Owner** of the Square account
2. If they're a Team Member, they need Owner/Admin access
3. Have the account Owner log in instead
4. Or have Owner grant API permissions to this Team Member

### PROBLEM 5: Application is in Sandbox Only
**Symptoms:** Only see "Sandbox" section, no "Production" section

**Solutions:**
1. The application might not be approved for production yet
2. Look for a button like "Request Production Access" or "Activate Production"
3. Square might require verification (business info, tax forms, etc.)
4. This could take 1-2 business days to approve
5. **Temporary solution:** Use Sandbox credentials for testing, switch to Production later

---

## 📋 ALTERNATIVE METHODS (If Standard Method Doesn't Work)

### METHOD 1: Use Square's Account Settings

1. Go to: [squareup.com/dashboard](https://squareup.com/dashboard)
2. Click **Settings** (gear icon)
3. Look for **"Business"** → **"Account & Settings"**
4. Find **"API Tokens"** or **"Developer"** section
5. Generate or copy tokens from there

### METHOD 2: Contact Square Support (During Meeting)

If really stuck:
1. Call Square support: **1-855-700-6000**
2. Say: "I need help accessing my API credentials for online payments"
3. They can walk you through it while you're on the call
4. Have client verify their identity (account email, business name, etc.)

### METHOD 3: Use Square's Chat Support

1. On any Square page, look for chat icon (bottom right)
2. Click to open live chat
3. Ask: "How do I find my Production API credentials?"
4. They can provide step-by-step help

---

## ✅ POST-MEETING CHECKLIST

After the meeting, make sure you have:

- [ ] Application ID saved (`sq0idp-...`)
- [ ] Access Token saved (`sq0atp-...` or `EAAAl...`)
- [ ] Location ID saved
- [ ] Updated `.env.local` with all credentials
- [ ] Restarted dev server
- [ ] Tested checkout flow successfully
- [ ] Verified payment appears in Square Dashboard
- [ ] **OPTIONAL:** Screenshot the Square Developer Dashboard pages for future reference

---

## 🔐 SECURITY REMINDERS

**During the meeting:**
- Don't screenshot or record the Access Token
- Don't send it over email or Slack
- Don't paste it in any public/shared documents
- If you need to share it remotely, use 1Password, LastPass, or encrypted messaging

**After the meeting:**
- Keep Access Token in `.env.local` only
- `.env.local` should be in `.gitignore` (never commit to GitHub)
- On Vercel, add it to Environment Variables (secure)
- Treat Access Token like a password!

---

## 🎯 EXPECTED TIMELINE

- **Step 1-2:** Login and find application (2-3 minutes)
- **Step 3:** Get Application ID (1 minute)
- **Step 4:** Get Access Token (2-3 minutes)
- **Step 5:** Get Location ID (1-2 minutes)
- **Step 6:** Confirm environment (30 seconds)

**Total meeting time:** 10-15 minutes (if everything goes smoothly)

**Troubleshooting buffer:** +5-10 minutes (if issues arise)

---

## 📞 EMERGENCY CONTACTS

**If you get completely stuck during the meeting:**

- **Square Support:** 1-855-700-6000
- **Square Developer Docs:** [developer.squareup.com/docs](https://developer.squareup.com/docs)
- **Square Community Forum:** [developer.squareup.com/forums](https://developer.squareup.com/forums)

---

## 💡 PRO TIPS

1. **Take screenshots** of each step as you go (blur the tokens before saving)
2. **Write down everything** - don't rely on memory
3. **Test immediately** after the meeting while client is still available
4. **Have a backup plan** - if production isn't ready, use sandbox temporarily
5. **Copy tokens twice** - once to `.env.local`, once to password manager

---

## 🎉 SUCCESS CRITERIA

You've successfully completed this meeting when:

✅ You have all 3 credentials (Application ID, Access Token, Location ID)  
✅ Credentials are correctly formatted (start with expected prefixes)  
✅ You've updated `.env.local` with the credentials  
✅ Dev server restarted successfully  
✅ Checkout page loads without errors  
✅ Test payment processes successfully (no 401 error)  
✅ Payment appears in Square Dashboard  

---

**Good luck! You've got this! 🚀**

**After the meeting, refer back to:**
- `SQUARE-ENV-VARS-CORRECTED.md` - Complete setup guide
- `REFACTOR-SUMMARY.md` - Technical details on what changed

---

*Last Updated: January 20, 2026*
