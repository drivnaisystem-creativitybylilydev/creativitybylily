# Square Integration Instructions

## ✅ Step 1: Install Square SDK

Run this command in your terminal:
```bash
npm install square
```

## ✅ Step 2: Environment Variables Verified

Your `.env.local` should have:
```bash
# Application ID (starts with sq0idp-...) - public
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-your-production-app-id
NEXT_PUBLIC_SQUARE_ENV=production

# Access Token (starts with sq0atp-...) - server-only
SQUARE_ACCESS_TOKEN=sq0atp-your-production-oauth-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENV=production
```

## ✅ Step 3: Files Created

1. ✅ Payment API route: `src/app/api/payments/create/route.ts`
2. ⏳ Checkout page integration (in progress)

## 📝 Next Steps

The checkout page needs to be updated to:
1. Load Square Web Payments SDK script
2. Initialize Square payments
3. Add payment form UI
4. Process payment before creating order
5. Remove demo banner

Let me update the checkout page now...








