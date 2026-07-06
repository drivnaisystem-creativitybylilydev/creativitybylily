# Auto-Delivery Detection — Build Plan

## 🎯 What This Is

Right now, tracking numbers are purely informational: Lily types one in when she marks an order
"shipped" (via the Rollo app + [OrderTrackingFulfillment.tsx](src/components/admin/OrderTrackingFulfillment.tsx)),
and nothing ever looks at what that tracking number is actually doing. She has to manually open the
Rollo app to check for delivery, then manually flip the order status.

**Goal:** the moment USPS scans a package as delivered, the order auto-flips to `delivered` and the
customer gets an email — with zero extra steps for Lily. Her Rollo workflow does not change at all.

A visual explainer for Lily is already live (private, noindexed) at `/tracking-automation`
(`src/app/tracking-automation/page.tsx`) — pushed in commit `c9a5ff3`. **Pricing already agreed with
her: $150 one-time build fee, no change to her $75/month retainer.**

---

## ⚠️ Read This First — Known Local Environment Issue

This repo currently has an **untracked `src/proxy.ts`** left over from an earlier Netlify-demo
experiment, which conflicts with the real, tracked `src/middleware.ts` under Next.js 16's
middleware→proxy rename. Running `next build` or `next dev` locally right now will fail with:

```
Error: Both middleware file "./src/middleware.ts" and proxy file "./src/proxy.ts" are detected.
```

**Do not delete or resolve this without checking with Finn first** — it's pre-existing, uncommitted
work, not something to silently clean up. If you need to verify a local build, ask him whether to
temporarily set `src/proxy.ts` aside, or resolve which convention (`middleware.ts` vs `proxy.ts`) the
project should standardize on.

Also note: `git status` will show ~20+ other untracked files (`src/app/about/`, `src/app/products/`,
`netlify.toml`, `.cursor/`, etc.) — these are leftovers from a Netlify-hosted demo copy of this same
codebase and are **not part of the real site**. The real site lives under `src/app/[locale]/...` and
deploys via GitHub → Vercel (project: `drivnaisystem-creativitybylilydevs-projects/creativitybylily`,
branch `main`). Don't stage or touch those files as part of this build.

---

## 🔎 Current System (confirmed by reading the code)

- Fulfillment is Rollo-only: `ADMIN_DISABLE_SHIPPO_LABEL_PURCHASE` disables the in-app Shippo label
  **purchase** flow. Lily buys labels in the standalone Rollo app on her own USPS account.
- Order status flow: `pending → processing → shipped → delivered → cancelled`
  (`src/app/api/admin/orders/[id]/status/route.ts`). Marking "shipped" already requires a tracking
  number and already sends `ShippingConfirmation.tsx`. No equivalent exists for "delivered."
- A `shipments` table already exists (`supabase/create-shipments-table.sql`) with `tracking_status` /
  `tracking_status_details` columns — built for a Shippo-webhook flow that was never wired up, since
  labels aren't purchased through Shippo for her. These columns are currently dead weight; this build
  reuses them.
- **Key fact:** Shippo can track *any* carrier's tracking number for free, even ones never purchased
  through Shippo. This is what makes the feature possible without changing Lily's Rollo workflow.
- `SHIPPO_API_KEY` is already configured (used today by `generate-label/route.ts`).

---

## 🛠️ Build Steps

### 1. Register tracking with Shippo when an order ships
In `src/app/api/admin/orders/[id]/status/route.ts`, when status transitions to `shipped` (existing
`isBecomingShipped` check already there), call Shippo's tracking-registration endpoint
(`POST /tracks`) with `{ carrier: 'usps', tracking_number }`. Store the result on the `shipments` row
(create one if it doesn't exist yet for this order — today a `shipments` row is only created by the
label-purchase flow, which Lily doesn't use).

**Confirm with Lily first:** all shipments are USPS? (The current tracking link in
`OrderTrackingFulfillment.tsx` assumes USPS.)

### 2. Build the delivery webhook listener
New route: `src/app/api/webhooks/shippo/route.ts`. Receives Shippo's `track_updated` event payload.
- Verify the request is genuinely from Shippo (Shippo doesn't sign webhooks by default — consider a
  shared-secret query param or IP allowlist as a lightweight check).
- Look up the order by `tracking_number`.
- Always persist the latest `tracking_status` / `tracking_status_details` onto the `shipments` row
  (this alone makes the existing "Label status" line in `OrderTrackingFulfillment.tsx` come alive).
- If status is `DELIVERED` and the order isn't already `delivered`: update `orders.status =
  'delivered'`, set a new `delivered_at` timestamp, and send the new delivery email (step 3).

### 3. New "Your order has arrived" email
New file: `src/emails/DeliveryConfirmation.tsx`, modeled on the existing
`src/emails/ShippingConfirmation.tsx` (same brand styling, swap copy to "arrived" framing). Add a
`sendDeliveryConfirmationEmail` export in `src/lib/email.ts` alongside
`sendShippingConfirmationEmail`.

### 4. Register the webhook with Shippo (one-time, manual or scripted)
Either via the Shippo dashboard or a one-off API call, subscribe `track_updated` events to
`https://creativitybylily.com/api/webhooks/shippo` (production URL only — don't point Shippo's
webhook at a preview/localhost URL).

### 5. Daily reconciliation safety net
Real-time webhooks occasionally drop. Add a Vercel Cron job (`vercel.json` → `crons` array) hitting a
new `src/app/api/cron/reconcile-tracking/route.ts` once a day: for every order still `shipped` after
more than ~1 day, re-query Shippo's tracking status directly and apply the same delivered-transition
logic as step 2. This is a backstop, not the primary mechanism — most orders should resolve via the
webhook within minutes of the actual USPS scan.

### 6. Database
Add `delivered_at timestamptz` to `orders` (new migration file in `supabase/`, following the existing
`add-*-column.sql` naming pattern). `shipments.tracking_status` / `tracking_status_details` already
exist — no migration needed for those.

### 7. Admin visibility (mostly already built)
`OrderTrackingFulfillment.tsx` already accepts and displays `shipmentCarrier` /
`shipmentTrackingStatus` props — once step 2 starts populating real data, this UI lights up with no
further changes needed. Lily keeps her existing manual status dropdown
(`OrderStatusUpdate.tsx`) as an override for edge cases (mis-scans, disputes).

---

## ✅ Testing Plan (localhost first, per Finn's instruction — nothing touches live orders during dev)

1. Resolve the `proxy.ts`/`middleware.ts` conflict locally (see warning above) before running `next dev`.
2. Use Shippo's test/sandbox mode to simulate a `track_updated` webhook payload against the local
   webhook route (Shippo docs cover sending test tracking webhooks).
3. Confirm: order flips to `delivered`, `delivered_at` is set, the new email renders correctly (check
   via the existing `/test-emails` page pattern already in this repo), and the admin order page shows
   the live tracking status.
4. Only after local verification: deploy, register the production webhook URL with Shippo, and test
   against one real low-stakes order.

---

## 📌 Open Items / Confirm with Lily
- [ ] All shipments go out USPS? (assumption baked into step 1)
- [ ] OK with the $150 one-time fee — no monthly change? (per the `/tracking-automation` page)
- [ ] Any orders currently mid-transit that should NOT get swept up by the day-1 reconciliation job?
