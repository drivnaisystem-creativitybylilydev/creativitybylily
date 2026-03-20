# Order Confirmation Email – Step-by-Step Setup

Get order confirmation emails sending in production (Vercel + Resend).

---

## Step 1: Create a Resend account

1. Go to **[resend.com](https://resend.com)** and sign up (or log in).
2. Verify your email if prompted.

---

## Step 2: Add and verify your domain

1. In Resend, open **Domains** in the sidebar.
2. Click **Add Domain**.
3. Enter your site domain, e.g. **`creativitybylilyco.com`** (no `https://`).
4. Resend will show **DNS records** (e.g. MX, TXT, CNAME). Keep this tab open.
5. In your **domain registrar** (where you bought the domain – GoDaddy, Namecheap, Cloudflare, etc.):
   - Open DNS settings for that domain.
   - Add **each record** Resend shows (type, name, value). Use the exact values Resend gives.
6. Back in Resend, click **Verify** (or wait a few minutes and refresh). Status should become **Verified**.  
   Verification can take up to 24–48 hours; often it’s within minutes.

---

## Step 3: Create an API key in Resend

1. In Resend, go to **API Keys** in the sidebar.
2. Click **Create API Key**.
3. Name it (e.g. **creativitybylily-production**).
4. Choose **Sending access** (or Full access if that’s all they offer).
5. Click **Add** and **copy the key** (starts with `re_`). You won’t see it again, so store it somewhere safe.

---

## Step 4: Choose the “From” email address

- Use an address on the domain you verified, e.g. **`orders@creativitybylilyco.com`** or **`hello@creativitybylilyco.com`**.
- You don’t need a real mailbox for that address; Resend only needs the domain to be verified.  
- If you didn’t verify a custom domain yet, you can use Resend’s sandbox: **`onboarding@resend.dev`** (only for testing; many providers will block or flag it in production).

---

## Step 5: Add environment variables in Vercel

1. Go to **[vercel.com](https://vercel.com)** → your **creativitybylily** project.
2. Open **Settings** → **Environment Variables**.
3. Add these for **Production** (and optionally Preview if you want emails on preview deploys):

   | Name                  | Value                          | Environment |
   |-----------------------|---------------------------------|-------------|
   | `RESEND_API_KEY`      | `re_xxxx...` (your API key)     | Production  |
   | `RESEND_FROM_EMAIL`   | `orders@creativitybylilyco.com` (or your chosen address) | Production  |
   | `ADMIN_ORDER_NOTIFY_EMAIL` | **(Optional but recommended)** Your shop inbox — e.g. `creativitybylilyco@gmail.com`. When set, you get a **branded “new order”** email (customer + line items + link to admin) on every website purchase. Use **comma-separated** addresses for multiple recipients. |

4. If you use a different live URL, add or update:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-actual-domain.com`
   (The order confirmation email uses this for links and the logo; the app may already default to `https://creativitybylily.com`.)

5. Save. **Redeploy** the project (e.g. **Deployments** → … on latest → **Redeploy**) so the new variables are used.

---

## Step 6: Test the order confirmation email

1. On the **live** site, place a **real test order** (small amount, then refund if you like).
2. Use an email address you can check (yours or your client’s).
3. Complete checkout and payment.
4. Check the inbox (and spam/junk) for the order confirmation.
5. Confirm:
   - Subject looks like: **Order Confirmation - CBY-xxxx-xxxx \| creativity by lily**
   - Sender is your `RESEND_FROM_EMAIL`.
   - Content looks correct (order number, items, total, address).

---

## Troubleshooting

- **No email received**  
  - Check spam/junk.  
  - In Resend → **Logs**, see if the send was attempted and if it bounced or failed.  
  - Confirm in Vercel that `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set for **Production** and that you redeployed after adding them.

- **“Domain not verified” or similar**  
  - In Resend → **Domains**, ensure status is **Verified** and that all DNS records match what Resend shows.

- **Emails only in dev, not in production**  
  - Production uses Vercel’s env; add the two variables there and redeploy. Don’t rely on `.env.local` for the live site.

---

## Admin “new order” emails

When `ADMIN_ORDER_NOTIFY_EMAIL` is set, each successful checkout also sends the **store owner** a separate branded email (subject: **New order: {order#} \| creativity by lily**) with customer contact info, shipping address, items, totals, optional Square payment id, and a **View order in admin** link.

- **Preview (local):** `/api/test/emails?type=admin-new-order`
- If the variable is **not** set, checkout still works; the server logs a one-line warning so you remember to configure it.

---

## Summary checklist

- [ ] Resend account created
- [ ] Domain added and verified in Resend (DNS records added at registrar)
- [ ] API key created and copied
- [ ] `RESEND_API_KEY` and `RESEND_FROM_EMAIL` set in Vercel (Production)
- [ ] `ADMIN_ORDER_NOTIFY_EMAIL` set to the inbox that should receive new-order alerts (optional but recommended)
- [ ] Project redeployed on Vercel
- [ ] Test order placed on live site; confirmation email received and looks correct

After this, order confirmation emails are ready for traffic.
