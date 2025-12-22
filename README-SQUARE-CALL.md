## Square Setup Call – Agenda & Checklist

This document is for the call with your client to set up **Square** for Creativity by Lily.  
Use it as a script and checklist so you collect everything needed in one session and know exactly what to do afterwards.

**Note:** Your client already has an active Square account (used for in-person payments), which simplifies this process significantly.

---

## 1. Call Goals (What we want to achieve)

- **Goal 1**: Confirm that the client's existing Square account can be used for online payments.
- **Goal 2**: Enable online payments (Web Payments) if not already active.
- **Goal 3**: Obtain the **API credentials** you need for the website:
  - Square **Application ID** (client-side)
  - Square **Access Token** (server-side)
  - Square **Location ID** (identifies which "location" receives payments)
- **Goal 4**: Agree on next steps: when you will integrate and test real payments.

You do **not** need to write any code on the call; the focus is credentials and configuration.

---

## 2. Pre-Call Checklist (Client Already Has Account ✓)

Since your client already has a Square account, you can skip most information gathering. Just confirm:

### 2.1 Quick Confirmations

- [ ] Client can log into their Square account
- [ ] Online payments are enabled (or can be enabled)
- [ ] Bank account is already connected for payouts (likely already done for in-person sales)

### 2.2 Business Rules for Online Payments

These help you configure the site correctly:

- **Refund policy for online orders** (e.g. "14 days from delivery if item is unused")
- **Will online orders use the same inventory as in-person?**
- **Any different pricing for online vs in-person?**

---

## 3. Steps to Do Together on the Call

Use this as a step-by-step flow during the meeting.

### 3.1 Log Into Square Dashboard

1. Have your client log into [Square Dashboard](https://squareup.com/dashboard).
2. Confirm which **Location** will be used for online orders.
   - Most small businesses have just one location.
   - If multiple, decide which one handles online sales.

### 3.2 Verify Online Payments Are Enabled

1. In Square Dashboard, go to **Settings → Business → Online**.
2. Confirm that **Online Payments** / **eCommerce** is enabled.
3. If not enabled, follow the prompts to activate it (usually instant since account is already verified).

### 3.3 Access the Square Developer Dashboard

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps).
2. Your client may need to sign in with their Square account.
3. Click **Create Application** (or use an existing one if available).
4. Name it something like "Creativity by Lily Website".

### 3.4 Get the API Credentials for the Website

Once in the application settings, collect these three items:

1. **Application ID**
   - Found on the main application page.
   - Looks like: `sq0idp-XXXXXXXXXXXXXXXXXXXX`
   - This is safe to use in client-side code.

2. **Access Token** (Production)
   - Go to the **Credentials** tab.
   - Under **Production**, find or generate the **Access Token**.
   - Looks like: `EAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **Treat this like a password** – never share over email or plain chat.

3. **Location ID**
   - Go to the **Locations** tab in the Developer Dashboard.
   - Or find it in Square Dashboard under **Settings → Locations**.
   - Looks like: `LXXXXXXXXXXXXXXXXX`

4. Store these securely (password manager or secure notes) to add to the website after the call.

---

## 4. What You (the Developer) Will Do After the Call

This section is for you; you can briefly explain it to the client so they know what happens next.

### 4.1 Add Square Keys to Environment Variables

After the call, you will:

1. Open the project's `.env.local` file.
2. Add:

```bash
SQUARE_APPLICATION_ID=sq0idp-XXXXXXXXXXXXXXXXXXXX
SQUARE_ACCESS_TOKEN=EAAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SQUARE_LOCATION_ID=LXXXXXXXXXXXXXXXXX
SQUARE_ENVIRONMENT=production   # or 'sandbox' for testing
```

3. Save the file and restart the dev server.

### 4.2 Integrate Square in the Checkout

Planned technical steps (you do these later, not on the call):

- Install Square SDK (`npm install square`).
- Install Square Web Payments SDK for the frontend.
- Create a **payment** in a Next.js API route when the order is created.
- Use **Square Web Payments SDK** on the checkout page to collect card details securely.
- The card form is hosted by Square (PCI compliant) – sensitive data never touches your server.

You can tell the client that this will make checkout behave like a "normal" online store where customers see a card form and receive a confirmation when payment succeeds.

### 4.3 Set Up Webhooks (Optional, Can Do Later)

Later, you may set up webhooks to:

1. In Square Developer Dashboard, create a **Webhook subscription** pointing to:
   - `https://creativitybylily.com/api/webhooks/square` (for production).
2. Subscribe to events like `payment.completed`, `refund.created`.
3. Copy the **Webhook Signature Key** and add it to `.env.local` as `SQUARE_WEBHOOK_SIGNATURE_KEY`.
4. Implement webhook handling in the code so order statuses stay in sync with Square events.

---

## 5. Simple Call Script (You Can Read This Out Loud)

You can use this short script to guide the conversation:

1. **"Since you already have Square for your in-person sales, we can use the same account for your online store – that way all your revenue stays in one place."**
2. **"Today we just need to grab a few credentials from your Square account that I'll plug into the website."**
3. **"We'll log into Square together, make sure online payments are enabled, and then get the keys I need."**
4. **"Your customers' card info will be handled securely by Square – it never touches your website, just like with your card reader."**
5. **"After the call, I'll wire everything up and we can test with a real small payment before going fully live."**

This keeps the call clear, focused, and non-technical for your client.

---

## 6. Security – How Customer Card Data Is Protected

Your client may ask about security. Here's the short explanation:

- **Card numbers never touch the website.** When customers enter their card, it goes directly to Square's secure servers.
- **Square sends back a "token"** – a random code that represents the payment. That's all your site ever sees.
- **Square is PCI-DSS compliant** – they handle billions of dollars and are audited regularly.
- **The payment form runs in a secure iframe** – completely isolated from the rest of the site.
- **All data is encrypted** via HTTPS.

**Bottom line:** By using Square, your client gets enterprise-grade security without any extra work.

---

## 7. Quick Checklist Summary

Before ending the call, quickly confirm:

- [ ] Client is logged into Square and you can see the dashboard together.
- [ ] Online payments are enabled on the account.
- [ ] You have the **Application ID** stored securely.
- [ ] You have the **Access Token** stored securely.
- [ ] You have the **Location ID** stored securely.
- [ ] Your client understands that you will now:
  - Integrate Square into the checkout.
  - Test with a small real payment.
  - Go live when they're ready.

---

## 8. Differences from Stripe (For Your Reference)

| Aspect | Stripe | Square |
|--------|--------|--------|
| API Keys | Publishable + Secret | Application ID + Access Token |
| Location concept | Not used | Required (Location ID) |
| Client already has account | ❌ Needed setup | ✅ Already done |
| In-person + online | Separate systems | Unified dashboard |
| Fees | 2.9% + 30¢ | 2.9% + 30¢ |

The integration is similar in concept – both use tokenization and server-side payment creation.

---

## 9. Useful Links

- [Square Developer Dashboard](https://developer.squareup.com/apps)
- [Square Web Payments SDK Docs](https://developer.squareup.com/docs/web-payments/overview)
- [Square API Reference](https://developer.squareup.com/reference/square)
- [Square Sandbox Testing](https://developer.squareup.com/docs/devtools/sandbox/overview)









