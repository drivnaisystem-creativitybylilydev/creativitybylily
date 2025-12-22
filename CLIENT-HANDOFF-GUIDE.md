# 🔄 Client Handoff Guide - Transferring Website Ownership

## Overview

This guide explains **when and how** to transfer all accounts and admin access to your client. The good news: **Most transfers can happen AFTER deployment**, so you have time!

---

## ✅ What Can Be Done AFTER Vercel Deployment

**You can safely deploy to Vercel first**, then transfer accounts later. Here's what can wait:

### 1. **Admin Account Creation** ✅ (After Deployment)
- The admin email is stored in **Supabase Auth**, not hardcoded
- You can create the client's admin account anytime
- Your test admin account can coexist with theirs

### 2. **Resend Account Transfer** ✅ (After Deployment)
- Can transfer Resend account ownership later
- Or create a new Resend account for client
- Just update environment variables in Vercel

### 3. **Shippo Account Transfer** ✅ (After Deployment)
- Can transfer Shippo account later
- Or create new account for client
- Update environment variables in Vercel

### 4. **Square Account** ✅ (Already Client's)
- Client already owns this (they use it for in-person sales)
- Just need to get API credentials from them

### 5. **Domain Setup** ✅ (After Deployment)
- Can add custom domain anytime
- Site works on Vercel URL (`creativitybylily.vercel.app`) until then

---

## ⚠️ What Should Be Done BEFORE First Production Use

These should be transferred **before the client starts using the site in production**:

### 1. **Admin Account Creation** (Before Production Use)
- Client needs their own admin account to manage orders
- Should be done before real customers start ordering

### 2. **Environment Variables in Vercel** (Before Production Use)
- Client's API keys should be in Vercel (not yours)
- Prevents you from having access to their production data

---

## 📋 Step-by-Step Handoff Process

### **Phase 1: Initial Deployment (You Do This)**

1. ✅ Deploy to Vercel with YOUR test credentials
2. ✅ Test that everything works
3. ✅ Verify site is live and functional
4. ✅ Get Square credentials from client (meeting today)

**At this point:** Site is live but using your test accounts.

---

### **Phase 2: Account Transfers (Do Before Production Use)**

#### **Step 1: Create Client's Admin Account in Supabase**

**When:** Before client starts managing orders

**How:**
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter client's email (e.g., `lily@creativitybylily.com`)
4. Set a temporary password (client will change it)
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create user"**
7. **Copy the User ID** (UUID)

8. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO admin_users (user_id, role)
   VALUES ('CLIENT_USER_UUID_HERE', 'super_admin')
   ON CONFLICT (user_id) DO NOTHING;
   ```

9. **Give client login credentials:**
   - URL: `https://creativitybylily.vercel.app/admin/login`
   - Email: Their email
   - Password: Temporary password (they should change it)

**Result:** Client can now log into admin dashboard.

---

#### **Step 2: Transfer Resend Account (Email Service)**

**Option A: Transfer Existing Account** (If you want to give them yours)
1. Go to [resend.com](https://resend.com) → **Settings** → **Team**
2. Add client's email as team member
3. Transfer ownership (if Resend supports it)
4. Or: Just add them as admin user

**Option B: Create New Account** (Recommended - Cleaner)
1. Client creates new Resend account at [resend.com](https://resend.com)
2. Client verifies their domain (if they have one)
3. Client gets new API key
4. **Update Vercel environment variables:**
   - Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Update `RESEND_API_KEY` with client's new key
   - Update `RESEND_FROM_EMAIL` with client's email
   - Click **"Save"**
   - **Redeploy** the site (or wait for next auto-deploy)

**Result:** Emails now send from client's account.

---

#### **Step 3: Transfer Shippo Account (Shipping Labels)**

**Option A: Transfer Existing Account**
1. Go to [goshippo.com](https://goshippo.com) → **Settings** → **Team**
2. Add client's email as team member
3. Transfer ownership

**Option B: Create New Account** (Recommended)
1. Client creates new Shippo account at [goshippo.com](https://goshippo.com)
2. Client adds their payment method
3. Client gets new API key
4. **Update Vercel environment variables:**
   - Update `SHIPPO_API_KEY` with client's new key
   - Update `SHIPPO_FROM_*` addresses with client's business address
   - Click **"Save"**
   - **Redeploy** the site

**Result:** Shipping labels now use client's account.

---

#### **Step 4: Transfer Vercel Project** (Optional but Recommended)

**When:** After everything is working and client is comfortable

**How:**
1. Go to Vercel Dashboard → Your Project → **Settings** → **General**
2. Scroll to **"Transfer Project"**
3. Enter client's email address
4. Client accepts transfer invitation
5. Client becomes project owner

**Result:** Client has full control of hosting.

**Alternative:** Keep project under your account, just give client access:
- Add client as team member (they can deploy but you retain ownership)

---

#### **Step 5: Transfer Supabase Project** (Optional)

**When:** If client wants full database ownership

**How:**
1. Go to Supabase Dashboard → **Settings** → **General**
2. Look for **"Transfer Project"** or **"Team"** section
3. Add client's email as team member
4. Transfer ownership (if supported)

**Result:** Client has full database access.

**Alternative:** Keep project under your account, client uses it via admin dashboard.

---

### **Phase 3: Final Cleanup (After Handoff)**

1. ✅ Remove your test admin account (optional - can keep for support)
2. ✅ Update any hardcoded emails in code (if any)
3. ✅ Document all accounts and passwords for client
4. ✅ Give client access to all service dashboards

---

## 🎯 Recommended Timeline

### **Week 1: Deployment**
- ✅ Deploy to Vercel (with your test accounts)
- ✅ Test everything works
- ✅ Get Square credentials from client

### **Week 2: Account Setup**
- ✅ Create client's admin account
- ✅ Set up client's Resend account
- ✅ Set up client's Shippo account
- ✅ Update Vercel environment variables
- ✅ Test with client's accounts

### **Week 3: Handoff**
- ✅ Transfer Vercel project (optional)
- ✅ Transfer Supabase project (optional)
- ✅ Document everything for client
- ✅ Train client on admin dashboard

---

## 📝 Account Transfer Checklist

Use this checklist when transferring accounts:

### **Supabase (Database & Auth)**
- [ ] Create client's admin user account
- [ ] Grant admin privileges (SQL)
- [ ] Test client can log into admin dashboard
- [ ] (Optional) Transfer Supabase project ownership
- [ ] Document Supabase dashboard login for client

### **Vercel (Hosting)**
- [ ] Update environment variables with client's keys
- [ ] Redeploy site
- [ ] Test site works with new variables
- [ ] (Optional) Transfer Vercel project ownership
- [ ] Document Vercel dashboard login for client

### **Resend (Email)**
- [ ] Client creates Resend account (or transfer yours)
- [ ] Client verifies domain (if they have one)
- [ ] Get client's API key
- [ ] Update `RESEND_API_KEY` in Vercel
- [ ] Update `RESEND_FROM_EMAIL` in Vercel
- [ ] Test email sending works

### **Shippo (Shipping)**
- [ ] Client creates Shippo account (or transfer yours)
- [ ] Client adds payment method
- [ ] Get client's API key
- [ ] Update `SHIPPO_API_KEY` in Vercel
- [ ] Update `SHIPPO_FROM_*` addresses in Vercel
- [ ] Test label generation works

### **Square (Payments)**
- [ ] Get Square credentials from client
- [ ] Update Square environment variables in Vercel
- [ ] Test payment flow (with test mode first)
- [ ] Switch to production mode

### **GitHub (Code Repository)**
- [ ] (Optional) Transfer repository to client
- [ ] Or: Add client as collaborator
- [ ] Document how to deploy updates

---

## 🔐 Security Considerations

### **Before Handoff:**
- ✅ Remove any test API keys from production
- ✅ Use client's production API keys
- ✅ Ensure client's admin account is secure (strong password)
- ✅ Enable 2FA on all accounts (if available)

### **After Handoff:**
- ✅ Client should change all passwords
- ✅ Client should enable 2FA on all accounts
- ✅ Remove your access (if you don't need it for support)

---

## 📧 What Email Addresses Need to Change?

### **Admin Login Email:**
- **Where:** Supabase Auth (database)
- **When:** Before production use
- **How:** Create new admin user in Supabase Dashboard
- **Impact:** Client can log into admin dashboard

### **Email Sender Address:**
- **Where:** `RESEND_FROM_EMAIL` environment variable
- **When:** After Resend account transfer
- **How:** Update in Vercel environment variables
- **Impact:** Emails sent to customers show client's email

### **Supabase SMTP Sender:**
- **Where:** Supabase Dashboard → Authentication → SMTP Settings
- **When:** After Resend account transfer
- **How:** Update "Sender Email" in Supabase SMTP settings
- **Impact:** Verification emails show client's email

---

## ⏰ Answer to Your Question

**"Do I have time to do that after the GitHub to Vercel push?"**

**YES!** You have plenty of time. Here's the timeline:

1. **Now → Deployment:**
   - Deploy to Vercel with YOUR test accounts
   - Site is live and functional
   - You can test everything

2. **After Deployment → Before Production:**
   - Create client's admin account
   - Transfer/update email accounts
   - Update environment variables in Vercel
   - Test with client's accounts

3. **Before Real Customers:**
   - Make sure client's admin account works
   - Make sure client's email service works
   - Make sure all environment variables are client's

**Bottom Line:** You can deploy first, then transfer accounts later. Just make sure everything is transferred **before the client starts using it in production** (before real customers start ordering).

---

## 🚨 Critical: What MUST Be Done Before Production

These **must** be done before real customers use the site:

1. ✅ **Client's admin account created** - So they can manage orders
2. ✅ **Client's API keys in Vercel** - So you don't have access to their production data
3. ✅ **Email sender is client's email** - So customers see professional emails
4. ✅ **Square is in production mode** - So payments actually work

Everything else can wait or be done gradually.

---

## 📞 Support After Handoff

**Recommended:** Keep your test admin account active for:
- Troubleshooting issues
- Providing support
- Making updates if needed

**Or:** Remove your access completely if client wants full independence.

---

## ✅ Summary

**You can deploy to Vercel first**, then transfer accounts later. The key is:

1. ✅ **Deploy now** with your test accounts
2. ✅ **Test everything** works
3. ✅ **Transfer accounts** before production use
4. ✅ **Update environment variables** in Vercel
5. ✅ **Test again** with client's accounts
6. ✅ **Hand off** to client

**The admin email change is just creating a new user in Supabase** - it takes 5 minutes and can be done anytime after deployment!

---

**Last Updated:** Based on current codebase  
**Next Step:** Deploy to Vercel, then we'll handle account transfers!



