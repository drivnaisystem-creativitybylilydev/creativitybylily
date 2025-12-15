## Stripe Setup Call – Agenda & Checklist

This document is for the call with your client to set up **Stripe** for Creativity by Lily.  
Use it as a script and checklist so you collect everything needed in one session and know exactly what to do afterwards.

---

## 1. Call Goals (What we want to achieve)

- **Goal 1**: Confirm that the client understands what Stripe is and agrees to use it for payments.
- **Goal 2**: Collect all information needed to create or configure the Stripe account.
- **Goal 3**: Create or log in to the Stripe account together and complete the **payout / business verification** steps.
- **Goal 4**: Obtain the **two API keys** you need for the website:
  - Stripe **Publishable key** (client-side)
  - Stripe **Secret key** (server-side)
- **Goal 5**: Agree on next steps: when you will integrate and test real payments.

You do **not** need to write any code on the call; the focus is accounts, verification, and keys.

---

## 2. Information to Ask Your Client For

During the call, ask your client for the following.  
Some of this may already exist if they have a Stripe account.

### 2.1 Business Details

- **Legal business name** (exact name registered with bank / authorities)
- **Business type** (sole proprietor, LLC, corporation, etc.)
- **Business address** (street, city, state, ZIP, country)
- **Business phone number**
- **Business website URL** (e.g. `https://creativitybylily.com`)
- **Support email** (customers can contact for order issues)
- **Support phone** (optional)

### 2.2 Owner / Representative Details (for Stripe verification)

Stripe usually asks for a person who is legally responsible for the business.

- **Full legal name**
- **Date of birth**
- **Home address**
- **Last 4 digits of SSN** (for US, if requested)
- **Email address for Stripe login** (can be same as business email)

Explain that Stripe uses this only for verification and anti‑fraud rules.

### 2.3 Bank / Payout Details

Ask how they want Stripe to send payouts:

- **Bank account holder name**
- **Bank name**
- **Routing number**
- **Account number**
- **Type**: checking or savings

You can also ask:

- How often do they expect payouts? (Stripe default is automatic daily/weekly; can be changed later.)

### 2.4 Business Rules for Payments

These help you configure Stripe and the site correctly.

- **Which currencies?** (most likely USD only)
- **Which countries will they ship to?** (US only or more?)
- **Refund policy** (for the Stripe / website terms)
  - E.g. “14 days from delivery if item is unused”.
- **Do they want Apple Pay / Google Pay enabled later?**

You do not have to configure all of this on the call, but knowing it helps later.

---

## 3. Steps to Do Together on the Call

Use this as a step‑by‑step flow during the meeting.

### 3.1 Decide Account Ownership

1. Confirm **who will own the Stripe account**:
   - Recommended: **Client owns it** under their email (you are a developer / collaborator).
2. Agree which email to use for Stripe login (e.g. `orders@creativitybylily.com`).

### 3.2 Create or Log In to Stripe

1. Open Stripe in a browser.
2. If they **already have a Stripe account**:
   - Log in together.
   - Confirm which **account** will be used for this store (if they have more than one).
3. If they **do not have a Stripe account yet**:
   - Click **Sign up**.
   - Use the agreed‑upon email address.
   - Set a password and complete email verification.

### 3.3 Complete Business Verification

1. In the Stripe dashboard, go to the **Settings** / **Get started** / **Activate payments** area.
2. Fill in, with your client’s help:
   - Business details (name, address, phone, website, business type).
   - Representative / owner details (name, DOB, address, last 4 of SSN if requested).
   - Bank account details for payouts.
3. Submit the form and watch for:
   - Any **missing information** warnings.
   - Any **document upload** requests (ID, business registration, etc.).
4. Confirm that Stripe shows the account as **fully activated** or “payments enabled”.

### 3.4 Get the API Keys for the Website

Once the account is active (or at least in test mode), get the keys together:

1. In Stripe dashboard, go to the **Developers → API keys** section.
2. Identify the keys:
   - **Publishable key** (starts with `pk_test_...` in test mode or `pk_live_...` in live mode).
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`).
3. Ask your client for permission to **store these securely** in the website’s environment settings.
4. On the call, paste them into a safe place temporarily (password manager or a secure notes file) so you can move them into `.env.local` after the call.

**Important:** Never send the secret key over email or in plain chat. Treat it like a password.

---

## 4. What You (the Developer) Will Do After the Call

This section is for you; you can briefly explain it to the client so they know what happens next.

### 4.1 Add Stripe Keys to Environment Variables

After the call, you will:

1. Open the project’s `.env.local` file.
2. Add:

```bash
STRIPE_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_xxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_...    # will be added later during webhook setup
```

3. Save the file and restart the dev server.

### 4.2 Integrate Stripe in the Checkout

Planned technical steps (you do these later, not on the call):

- Install Stripe libraries.
- Create a **payment intent** in a Next.js API route when the order is created.
- Use **Stripe Elements** on the checkout page to collect card details securely.
- Confirm payment on the client and update the order status after success.

You can tell the client that this will make checkout behave like a “normal” online store where customers see a card form and receive a confirmation when payment succeeds.

### 4.3 Set Up Webhooks (Second Short Session, Optional)

Later, you may schedule a short follow‑up (or do it alone) to:

1. In Stripe dashboard, create a **Webhook endpoint** pointing to:
   - `https://creativitybylily.com/api/webhooks/stripe` (for production).
2. Copy the **Webhook signing secret** and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.
3. Implement webhook handling in the code so order statuses stay in sync with Stripe events.

---

## 5. Simple Call Script (You Can Read This Out Loud)

You can use this short script to guide the conversation:

1. **“Today I’d like to set up Stripe with you. Stripe is the payment provider that will charge your customers’ cards and send the money to your bank account.”**
2. **“First, we’ll decide which email should own the Stripe account and confirm your business and bank details.”**
3. **“Next, we’ll go through Stripe’s verification steps so payments and payouts are enabled.”**
4. **“Finally, we’ll grab two keys from Stripe that I will plug into the website so I can finish the integration.”**
5. **“We will not charge any real cards today; we just prepare the account so that when we are ready, accepting payments is a matter of flipping a switch.”**

This keeps the call clear, focused, and non‑technical for your client.

---

## 6. Quick Checklist Summary

Before ending the call, quickly confirm:

- [ ] Stripe account exists and your client can log in.
- [ ] Business details are filled out and verified (no pending warnings).
- [ ] Bank account is connected for payouts.
- [ ] You have the **Publishable key** and **Secret key** stored securely.
- [ ] Your client understands that you will now:
  - Integrate Stripe into the checkout.
  - Test payments in test mode.
  - Later switch to live mode when they are ready to accept real money.


