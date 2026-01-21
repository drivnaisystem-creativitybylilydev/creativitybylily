# Supabase SMTP Setup Troubleshooting

## 🔍 Can't Find the Password Field?

If you don't see a "Password" or "SMTP Password" field in Supabase, try these steps:

### Step 1: Verify You're in the Right Place

1. **Supabase Dashboard** → Click the **gear icon** (⚙️) in the left sidebar
2. This should open **"Project Settings"**
3. Click the **"Authentication"** tab at the top
4. Scroll down to find **"SMTP Settings"** section

### Step 2: Enable Custom SMTP First

**Important:** You MUST toggle **"Enable Custom SMTP"** to ON before the password field appears!

1. Look for a toggle switch labeled **"Enable Custom SMTP"** or **"Use Custom SMTP"**
2. Toggle it to **ON** (should turn blue/green)
3. **After enabling, refresh the page** - the password field should appear

### Step 3: Look for These Field Names

The password field might be labeled differently:
- "SMTP Password"
- "Password"
- "API Key"
- "SMTP API Key"
- "Authentication Password"

### Step 4: If Still No Password Field

**Option A: Check Supabase Version**
- Some older Supabase projects might have a different UI
- Try updating your Supabase project or check if there's a newer interface

**Option B: Use Domain Verification First**
- Some Supabase setups require domain verification before showing SMTP fields
- Go to Resend → Domains → Add your domain
- Verify it with DNS records
- Then return to Supabase SMTP settings

**Option C: Alternative - Use Supabase's Built-in Email (Temporary)**
- If SMTP isn't working, you can use Supabase's default email service temporarily
- Go to Authentication → Settings → Email Auth
- Make sure "Enable email confirmations" is ON
- This will send unbranded emails, but they'll work
- You can set up branded SMTP later

---

## 🚨 Common Errors and Fixes

### Error: "Invalid credentials" or "Authentication failed"

**Fix:**
1. Double-check your Resend API key is correct (no extra spaces)
2. Make sure you're using the FULL key (starts with `re_` and is ~50+ characters)
3. Try port `587` instead of `465` (or vice versa)
4. Verify the username is exactly `resend` (lowercase, no spaces)

### Error: "Connection timeout" or "Could not connect"

**Fix:**
1. Try port `587` instead of `465`
2. Check if your firewall/network is blocking SMTP ports
3. Verify `smtp.resend.com` is accessible
4. Try from a different network

### Error: "Sender email not verified"

**Fix:**
1. For now, use your personal email (Gmail, etc.)
2. Or verify your domain in Resend first:
   - Resend Dashboard → Domains → Add Domain
   - Add DNS records
   - Wait for verification
   - Then use `noreply@creativitybylily.com`

### Error: "Email not sending" but no error message

**Fix:**
1. Check Supabase Dashboard → Logs for error messages
2. Check Resend Dashboard → Logs to see if emails are being sent
3. Check spam folder
4. Verify "Enable email confirmations" is ON in Supabase

---

## 📸 What the Supabase UI Should Look Like

When you go to **Project Settings → Authentication → SMTP Settings**, you should see:

```
┌─────────────────────────────────────┐
│ SMTP Settings                        │
├─────────────────────────────────────┤
│ ☑ Enable Custom SMTP                │
│                                     │
│ SMTP Host: [smtp.resend.com     ]  │
│ SMTP Port: [465                  ]  │
│ SMTP User: [resend              ]  │
│ SMTP Password: [re_...           ]  │ ← This field!
│                                     │
│ Sender Email: [your@email.com   ]  │
│ Sender Name: [creativity by lily]  │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
```

**If you don't see this:**
1. Make sure "Enable Custom SMTP" toggle is ON
2. Refresh the page
3. Try a different browser
4. Check if you have the right permissions in Supabase

---

## 🔄 Alternative: Test Without SMTP First

If SMTP setup is too complicated right now, you can:

1. **Use Supabase's default email** (unbranded but functional):
   - Go to Authentication → Settings
   - Make sure "Enable email confirmations" is ON
   - Leave SMTP disabled
   - Emails will send from Supabase's default service

2. **Set up branded SMTP later** when you have more time
   - The branded templates will work once SMTP is configured
   - For now, users can still verify their emails

---

## 💡 Quick Checklist

Before giving up, verify:
- [ ] You're in Project Settings → Authentication tab
- [ ] "Enable Custom SMTP" toggle is ON
- [ ] You've refreshed the page after enabling
- [ ] You're using the correct Resend API key (from `.env.local` or Resend dashboard)
- [ ] Port is `465` or `587`
- [ ] Username is exactly `resend` (lowercase)
- [ ] No extra spaces in any fields
- [ ] You've clicked "Save" at the bottom

---

## 🆘 Still Stuck?

If none of this works:
1. Take a screenshot of your Supabase SMTP settings page
2. Check Supabase's official docs: https://supabase.com/docs/guides/auth/auth-smtp
3. Contact Supabase support with your project details
4. Or use Supabase's default email service for now and set up SMTP later








