# Rollo Shipping Label Integration Guide

## Overview

This integration allows you to generate shipping labels from orders in the admin dashboard. The labels are compatible with Rollo thermal printers (4x6 inch labels).

## Current Implementation

The current implementation is a **placeholder** that:
- ✅ Generates a tracking number
- ✅ Stores it in the database
- ✅ Creates a printable label (HTML format)
- ✅ Adds "Generate Shipping Label" button in admin order detail page

## Next Steps: Full Integration

To fully integrate with a shipping service (required for production), you'll need to:

### Option 1: Shippo (Recommended)

**Why Shippo:**
- Easy API integration
- Supports all major carriers (USPS, UPS, FedEx, DHL)
- Works with Rollo printers
- Good documentation

**Setup:**
1. Create account at [shippo.com](https://shippo.com)
2. Get API key from dashboard
3. Install Shippo SDK:
   ```bash
   npm install shippo
   ```
4. Add to `.env.local`:
   ```
   SHIPPO_API_KEY=shippo_test_xxxxxxxxxxxxx
   ```
5. Update `src/app/api/admin/orders/[id]/generate-label/route.ts` to use Shippo API

**Example Shippo Integration:**
```typescript
import Shippo from 'shippo';

const shippo = new Shippo({
  apiKey: process.env.SHIPPO_API_KEY!,
});

// Create shipment
const shipment = await shippo.shipment.create({
  address_from: {
    name: 'Creativity by Lily',
    street1: 'Your Business Address',
    city: 'City',
    state: 'MA',
    zip: '02108',
    country: 'US',
  },
  address_to: {
    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
    street1: shippingAddress.address,
    street2: shippingAddress.address2 || '',
    city: shippingAddress.city,
    state: shippingAddress.state,
    zip: shippingAddress.zip,
    country: shippingAddress.country || 'US',
  },
  parcels: [{
    length: '6',
    width: '4',
    height: '2',
    distance_unit: 'in',
    weight: estimatedWeight.toString(),
    mass_unit: 'lb',
  }],
});

// Create transaction (purchase label)
const transaction = await shippo.transaction.create({
  rate: shipment.rates[0].object_id, // Select cheapest rate
  async: false,
});

// Get tracking number and label URL
const trackingNumber = transaction.tracking_number;
const labelUrl = transaction.label_url;
```

### Option 2: EasyPost

**Why EasyPost:**
- Simple API
- Good for small businesses
- Free tier available

**Setup:**
1. Create account at [easypost.com](https://easypost.com)
2. Get API key
3. Install EasyPost SDK:
   ```bash
   npm install @easypost/api
   ```
4. Similar integration pattern to Shippo

### Option 3: Direct Carrier APIs

- **USPS**: Requires account and API access
- **UPS**: Requires developer account
- **FedEx**: Requires developer account

These are more complex but give you direct control.

## How It Works

1. **Admin clicks "Generate Shipping Label"** on an order
2. **API route** (`/api/admin/orders/[id]/generate-label`) is called
3. **Shipping API** creates a label and returns:
   - Tracking number
   - Label PDF URL
4. **Database** is updated with tracking number
5. **Label opens** in new window for printing
6. **Admin prints** label on Rollo printer

## Rollo Printer Setup

1. **Install Rollo Printer Drivers**
   - Download from [rollo.com/support](https://rollo.com/support)
   - Install on your computer

2. **Connect Printer**
   - USB: Plug in and install drivers
   - Wireless: Use Rollo app to connect to Wi-Fi

3. **Load 4x6 Labels**
   - Open printer cover
   - Insert labels (printable side up)
   - Close cover
   - Press and hold green "r" button to calibrate

4. **Print Labels**
   - When label opens in browser, press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
   - Select "Rollo" as printer
   - Print

## Testing

1. Go to `/admin/orders`
2. Click on any order
3. Click "Generate Shipping Label"
4. Label should open in new window
5. Print to test Rollo printer

## Production Checklist

- [ ] Choose shipping service (Shippo recommended)
- [ ] Create shipping service account
- [ ] Get API keys
- [ ] Add API keys to `.env.local`
- [ ] Update `generate-label/route.ts` with actual API integration
- [ ] Test label generation
- [ ] Test printing on Rollo printer
- [ ] Set up return address in shipping service
- [ ] Configure shipping rates/carriers
- [ ] Test with real orders

## Cost Considerations

- **Shippo**: Pay per label (~$0.05-0.10 per label + carrier rates)
- **EasyPost**: Similar pricing
- **Direct Carrier**: Varies by carrier

## Troubleshooting

**Label won't print:**
- Check Rollo printer is connected
- Verify printer drivers are installed
- Try printing from browser's print dialog

**Tracking number not saving:**
- Check database connection
- Verify order ID is correct
- Check server logs for errors

**API errors:**
- Verify API keys are correct
- Check shipping service account status
- Review API documentation for required fields








