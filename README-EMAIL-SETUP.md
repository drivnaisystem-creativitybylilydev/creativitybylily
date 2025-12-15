# Email Setup Guide

## Overview

The website now sends branded order confirmation emails to customers when they place an order. The emails include:
- Branded header with logo
- Order summary with product images
- Order details (items, quantities, prices)
- Shipping address
- Brand colors and styling

## Setup Instructions

### Step 1: Add Your Resend API Key

**If you have a Resend API key:**
1. Add it to your `.env.local` file:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev  # Or your verified domain email
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
2. Restart your dev server
3. Emails will be sent automatically when orders are placed!

**If you don't have an API key yet:**
- The system will automatically log emails to the console instead
- Orders still work perfectly
- No setup needed for development/testing
- You'll see in the server console:
  ```
  📧 [DEV MODE] Order Confirmation Email would be sent:
     To: customer@example.com
     Order: CBY-20241206-1234
     Items: 2
     Total: $45.00
  ```

### Step 2: Production Setup (After You Launch)

**When you're ready to send real emails:**

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com) and sign up
   - Verify your email address

2. **Verify Your Domain**
   - Go to **Domains** in Resend dashboard
   - Click **"Add Domain"**
   - Enter your domain (e.g., `creativitybylily.com`)
   - Add the DNS records Resend provides to your domain
   - Wait for verification (usually a few minutes)

3. **Get API Key**
   - Go to **API Keys** in Resend dashboard
   - Click **"Create API Key"**
   - Name it (e.g., "creativitybylily-production")
   - Copy the API key

### Step 3: Set Up Environment Variables (Production Only)

**For development:** No setup needed! Emails are logged to console.

**For production (after domain verification):**

Add these to your `.env.local` file:

```bash
# Resend API Key (from Step 2)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# From email address (use your verified domain)
RESEND_FROM_EMAIL=orders@creativitybylily.com

# Site URL (for email links and images)
NEXT_PUBLIC_SITE_URL=https://creativitybylily.com
```

### Step 4: Test the Email

1. Place a test order on your website
2. Check the customer's email inbox
3. You should receive a beautifully branded order confirmation!

## Email Features

- **Branded Design**: Uses brand colors (#ff72a6 pink, soft pink background)
- **Product Images**: Shows images of all ordered products
- **Order Summary**: Complete breakdown of items, quantities, and prices
- **Shipping Info**: Displays shipping address
- **Responsive**: Looks great on mobile and desktop email clients

## Troubleshooting

**Email not sending:**
- Check that `RESEND_API_KEY` is set in `.env.local`
- Check that `RESEND_FROM_EMAIL` is set
- Restart your dev server after adding env variables
- Check the server console for error messages

**Email going to spam:**
- Emails from `onboarding@resend.dev` may go to spam (this is normal for test domain)
- Check spam folder
- Once you verify your own domain (after launch), emails will have better deliverability

**Images not showing:**
- Make sure `NEXT_PUBLIC_SITE_URL` is set correctly
- Product images must be accessible via URL
- Check that product images exist in the database

## Resend Pricing

- **Free tier**: 3,000 emails/month, 100 emails/day
- **Pro tier**: $20/month for 50,000 emails
- Perfect for small to medium e-commerce stores!

## Next Steps

Once email is working, you can:
- Add shipping confirmation emails
- Add order status update emails
- Customize email templates further
- Add unsubscribe links (if needed)

