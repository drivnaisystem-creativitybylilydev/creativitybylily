# Square API Setup - Meeting Checklist

**Meeting Date:** Today  
**Goal:** Get Square API credentials for payment processing

---

## ✅ What You Need (3 Things)

During the call, collect these credentials:

1. **Application ID**
   - Format: `sq0idp-XXXXXXXXXXXXXXXXXXXX`
   - Where: Square Developer Dashboard → Application page
   - Safe to share (used in client-side code)

2. **Access Token (Production)**
   - Format: `EAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Where: Square Developer Dashboard → Credentials tab → Production
   - ⚠️ **SECRET** - treat like a password!

3. **Location ID**
   - Format: `LXXXXXXXXXXXXXXXXX`
   - Where: Square Developer Dashboard → Locations tab
   - Or: Square Dashboard → Settings → Locations

---

## 📋 Meeting Flow

### Step 1: Log Into Square (2 min)
- [ ] Client logs into [squareup.com/dashboard](https://squareup.com/dashboard)
- [ ] Confirm they can access their account

### Step 2: Verify Online Payments (2 min)
- [ ] Go to **Settings → Business → Online**
- [ ] Confirm **Online Payments** is enabled
- [ ] If not, enable it (usually instant)

### Step 3: Go to Developer Dashboard (1 min)
- [ ] Go to [developer.squareup.com](https://developer.squareup.com)
- [ ] Sign in with same Square account
- [ ] Click **"Create Application"** (or use existing)

### Step 4: Get Credentials (5 min)
- [ ] **Application ID:** Copy from main app page
- [ ] **Access Token:** Go to Credentials tab → Production → Copy token
- [ ] **Location ID:** Go to Locations tab → Copy Location ID

### Step 5: Verify You Have Everything (1 min)
- [ ] Application ID: `sq0idp-...` ✅
- [ ] Access Token: `EAAA...` ✅
- [ ] Location ID: `L...` ✅

---

## 💾 After the Meeting

### Add to `.env.local`

After the call, add these to your `.env.local` file:

```bash
SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXXXXXXXXXXXXX
SQUARE_ACCESS_TOKEN=EAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SQUARE_LOCATION_ID=LXXXXXXXXXXXXXXXXX
SQUARE_ENVIRONMENT=production
```

**Then:**
1. Save the file
2. Restart your dev server
3. Test payment processing

---

## 🗣️ Quick Talking Points

If client asks questions:

**"Why do you need these?"**
→ "These keys connect your website to your Square account so online payments go to the same place as your in-person sales."

**"Is this secure?"**
→ "Yes! Square handles all card data securely. Your website never sees card numbers - Square sends back a secure token."

**"How long will this take?"**
→ "About 10-15 minutes to get the keys, then I'll integrate them into the website. We can test with a small payment after."

**"Will this affect my current Square setup?"**
→ "No! This just adds online payments. Your in-person sales continue exactly as they are."

---

## 📝 Notes Section

Use this space to write down the credentials during the call:

**Application ID:** `___________________________`

**Access Token:** `___________________________`

**Location ID:** `___________________________`

**Other Notes:**
- 
- 
- 

---

## 🔗 Quick Links

- [Square Dashboard](https://squareup.com/dashboard)
- [Square Developer Dashboard](https://developer.squareup.com/apps)
- [Square Web Payments Docs](https://developer.squareup.com/docs/web-payments/overview)

---

## ✅ Success Checklist

Before ending the call, confirm:
- [ ] All 3 credentials collected
- [ ] Credentials saved securely
- [ ] Client understands next steps
- [ ] Agreed on testing timeline

---

**Good luck with the meeting!** 🎉

