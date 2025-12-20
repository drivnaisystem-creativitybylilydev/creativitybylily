# Resend Email Pricing & Setup Guide

## 💰 Resend Pricing (Very Affordable!)

### **Free Tier** - Perfect for Starting Out
- **3,000 emails/month**
- **100 emails/day**
- **1 domain per team**
- **Full API access**
- **Branded email templates**

### **Pro Plan** - $20/month
- **50,000 emails/month**
- **Unlimited domains**
- **Priority support**
- **Advanced analytics**

### **Scale Plan** - $90/month
- **100,000 emails/month**
- **Everything in Pro**
- **Dedicated support**

## 📊 Email Volume Estimates

For a small e-commerce store:
- **Order confirmations**: ~50-200/month
- **Return emails**: ~5-20/month
- **Shipping confirmations**: ~50-200/month
- **Total**: ~100-400 emails/month

**Verdict**: Free tier (3,000/month) is perfect for most small businesses!

## ✅ What's Already Set Up

1. **Email Templates Created**:
   - ✅ Order Confirmation
   - ✅ Return Request Received
   - ✅ Return Approved
   - ✅ Refund Processed
   - ✅ Shipping Confirmation

2. **Email Functions**:
   - ✅ `sendOrderConfirmationEmail()`
   - ✅ `sendReturnRequestReceivedEmail()`
   - ✅ `sendReturnApprovedEmail()`
   - ✅ `sendRefundProcessedEmail()`
   - ✅ `sendShippingConfirmationEmail()`

3. **Integration Points**:
   - ✅ Return creation sends email
   - ✅ Return status updates send emails (approved, refunded)
   - ⏸️ Order confirmation (commented out, ready to enable)
   - ⏸️ Shipping confirmation (ready to add)

## 🚀 Quick Setup Steps

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up (free)
3. Verify your email

### Step 2: Get API Key
1. Go to **API Keys** in Resend dashboard
2. Click **"Create API Key"**
3. Name it (e.g., "creativitybylily-production")
4. Copy the API key (starts with `re_`)

### Step 3: Verify Domain (Optional but Recommended)
1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter: `creativitybylily.com`
4. Add DNS records to your domain
5. Wait for verification

### Step 4: Add to Environment Variables

**Development/Testing** (`.env.local`):
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=your-email@gmail.com  # Use YOUR email for now
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: You can use your own email address for testing! Just use your Gmail or any email you have access to. Later, when you hand over to the owner, you can:
- Change `RESEND_FROM_EMAIL` to the owner's email, OR
- Verify the business domain and use `orders@creativitybylily.com`

**Production** (after domain verification):
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=orders@creativitybylily.com  # Verified domain email
NEXT_PUBLIC_SITE_URL=https://creativitybylily.com
```

### Step 5: Test Emails

1. Place a test order → Order confirmation email sent
2. Submit a return → Return request email sent
3. Approve return → Return approved email sent
4. Process refund → Refund processed email sent

## 📧 Email Features

All emails include:
- ✅ Branded header with logo
- ✅ Soft pink color scheme
- ✅ Professional layout
- ✅ Mobile-responsive
- ✅ Links to account/website
- ✅ Personalized with customer name

## 💡 Cost Savings

**Without Resend** (using other services):
- SendGrid: $15/month for 40,000
- Mailgun: $35/month for 50,000
- AWS SES: Complex setup, pay per email

**With Resend**:
- **FREE** for first 3,000 emails/month
- **$20/month** for 50,000 emails (if you grow)

## 🎯 Recommendation

**Start with FREE tier** - It's perfect for:
- Testing all email types
- Launching your store
- First few months of operations

**Upgrade to Pro ($20/month)** when you:
- Consistently send 3,000+ emails/month
- Need multiple domains
- Want priority support

---

**Bottom Line**: Resend is extremely affordable and perfect for your needs! The free tier will likely cover you for months, and $20/month for 50,000 emails is a great deal.


