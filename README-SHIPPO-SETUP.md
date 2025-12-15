# Shippo Shipping Label Integration Setup Guide

This guide will walk you through setting up automatic shipping label generation using Shippo's free plan.

## Overview

The system integrates with Shippo to automatically generate 4x6 shipping labels compatible with Rollo thermal printers. Labels are generated through the admin dashboard and stored in Supabase for easy access and printing.

## Architecture

### Data Flow
1. **Order Created** → Order stored in Supabase `orders` table
2. **Admin Clicks "Generate Shipping Label"** → Frontend calls Next.js API route
3. **API Route** → Creates Shippo shipment, retrieves rates, purchases label
4. **Label Generated** → Shippo returns PDF_4x6 label URL
5. **Data Stored** → Shipment metadata saved to Supabase `shipments` table
6. **Order Updated** → Tracking number added to order record
7. **Label Ready** → Admin can print label via Rollo printer

### Database Schema

The system uses a `shipments` table to store:
- Shippo transaction IDs and shipment IDs
- Label URLs (PDF_4x6 format)
- Tracking numbers and status
- Carrier and service level information
- Shipping costs
- Parcel dimensions and weight

## Setup Instructions

### Step 1: Create Shippo Account

1. Go to [https://goshippo.com](https://goshippo.com)
2. Sign up for a free account
3. Complete account verification
4. Navigate to **Settings → API** to get your API key
5. **Important**: Use the **Test API Key** for development, **Live API Key** for production

### Step 2: Run Database Migration

Run the SQL migration to create the `shipments` table:

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `supabase/create-shipments-table.sql`
4. Copy and paste the entire SQL into the editor
5. Click **Run** to execute

This creates:
- `shipments` table with all required columns
- Indexes for performance
- Row Level Security (RLS) policies for admin access
- Auto-update triggers for `updated_at` timestamps

### Step 3: Configure Environment Variables

Add the following environment variables to your `.env.local` file (or your deployment platform):

#### Required Variables

```bash
# Shippo API Configuration
SHIPPO_API_KEY=shippo_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Business Address (From Address)
SHIPPO_FROM_NAME=Creativity by Lily
SHIPPO_FROM_STREET=123 Main Street
SHIPPO_FROM_CITY=Cape Cod
SHIPPO_FROM_STATE=MA
SHIPPO_FROM_ZIP=02601
SHIPPO_FROM_COUNTRY=US
SHIPPO_FROM_PHONE=+15551234567
SHIPPO_FROM_EMAIL=orders@creativitybylily.com
```

#### Optional Variables

```bash
# Parcel Dimensions (defaults: 8x6x4 inches)
SHIPPO_PARCEL_LENGTH=8
SHIPPO_PARCEL_WIDTH=6
SHIPPO_PARCEL_HEIGHT=4

# Legacy Business Address Variables (used as fallback)
BUSINESS_STREET=123 Main Street
BUSINESS_CITY=Cape Cod
BUSINESS_STATE=MA
BUSINESS_ZIP=02601
```

**Important Notes:**
- Use `shippo_test_...` for testing (free plan)
- Use `shippo_live_...` for production (requires account upgrade)
- The from address must be a valid US address for USPS labels
- Phone number should include country code (e.g., +1 for US)

### Step 4: Install Dependencies

The Shippo SDK is already installed. If you need to reinstall:

```bash
npm install shippo
```

### Step 5: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Admin Dashboard:**
   - Go to `/admin/orders`
   - Select an order that has a shipping address

3. **Generate a Label:**
   - Click "Generate Shipping Label"
   - The system will:
     - Create a Shippo shipment
     - Retrieve available rates
     - Select the cheapest rate
     - Purchase the label in PDF_4x6 format
     - Store the label URL in Supabase
     - Open the label in a new window for printing

4. **Print the Label:**
   - The label will open in a new browser tab
   - Use your browser's print dialog
   - Select your Rollo thermal printer
   - Ensure paper size is set to 4x6 inches
   - Print the label

## How It Works

### Shippo API Flow

1. **Create Shipment**
   - Sends from/to addresses and parcel dimensions to Shippo
   - Shippo validates addresses and calculates available rates

2. **Retrieve Rates**
   - Shippo returns available shipping options (USPS, UPS, FedEx, etc.)
   - Rates include carrier, service level, and cost

3. **Select Rate**
   - System automatically selects the cheapest rate
   - You can modify this logic in `src/app/api/admin/orders/[id]/generate-label/route.ts`

4. **Purchase Label**
   - Creates a Shippo transaction
   - Requests `label_format: 'PDF_4x6'` for Rollo compatibility
   - Shippo generates and returns label URL

5. **Store Data**
   - Shipment record created in `shipments` table
   - Order updated with tracking number
   - Label URL stored for future printing

### Weight Calculation

The system calculates package weight based on order items:
- Default: 1 lb (16 oz) per item
- Minimum: 0.5 lb (8 oz)
- Formula: `Math.max(8, itemCount * 16)` ounces

You can customize this in the API route if needed.

### Parcel Dimensions

Default dimensions are 8x6x4 inches. You can override these with environment variables:
- `SHIPPO_PARCEL_LENGTH`
- `SHIPPO_PARCEL_WIDTH`
- `SHIPPO_PARCEL_HEIGHT`

## Troubleshooting

### Common Issues

#### 1. "Shippo API key not configured"
- **Solution**: Ensure `SHIPPO_API_KEY` is set in your environment variables
- Restart your development server after adding the variable

#### 2. "Business address not configured"
- **Solution**: Set all required `SHIPPO_FROM_*` environment variables
- Ensure the address is valid and complete

#### 3. "No shipping rates available"
- **Possible causes**:
  - Invalid shipping address
  - Address is outside supported shipping zones
  - Parcel dimensions too large
- **Solution**: Verify the shipping address in the order is correct

#### 4. "Failed to purchase shipping label"
- **Possible causes**:
  - Insufficient Shippo account balance (free plan has limits)
  - Invalid rate selected
  - Shippo API error
- **Solution**: Check Shippo dashboard for account status and error messages

#### 5. Label doesn't print correctly
- **Solution**: 
  - Ensure browser print settings use 4x6 paper size
  - Check Rollo printer settings
  - Verify label format is PDF_4x6 (should be automatic)

### Debugging

Enable detailed error logging by checking:
1. Browser console for frontend errors
2. Server logs for API route errors
3. Shippo dashboard for API transaction history

The `shipments` table stores error messages in the `error_message` column for failed label generations.

## Production Deployment

### Before Going Live

1. **Switch to Live API Key**
   - Replace `shippo_test_...` with `shippo_live_...`
   - Update environment variables in your deployment platform

2. **Verify Business Address**
   - Ensure `SHIPPO_FROM_*` variables are correct
   - This address will appear on all shipping labels

3. **Test with Real Orders**
   - Generate a test label with a real address
   - Verify label prints correctly on Rollo printer

4. **Monitor Shippo Account**
   - Check account balance regularly
   - Free plan has monthly label limits
   - Upgrade plan if needed for higher volume

### Environment Variables in Production

For Vercel:
1. Go to Project Settings → Environment Variables
2. Add all `SHIPPO_*` variables
3. Redeploy application

For other platforms, follow their environment variable configuration process.

## Shippo Free Plan Limits

- **Monthly Labels**: Limited number of free labels per month
- **Carriers**: Access to USPS, UPS, FedEx (some restrictions)
- **Features**: Basic label generation, tracking, rate comparison
- **Support**: Community support

For higher volume or additional features, consider upgrading your Shippo plan.

## Files Modified/Created

### New Files
- `supabase/create-shipments-table.sql` - Database migration
- `README-SHIPPO-SETUP.md` - This documentation

### Modified Files
- `src/app/api/admin/orders/[id]/generate-label/route.ts` - Shippo integration
- `src/components/admin/ShippingLabelButton.tsx` - Enhanced UI with shipment status
- `src/app/admin/orders/[id]/page.tsx` - Added shipment data fetching
- `src/lib/supabase/types.ts` - Added shipments table types
- `package.json` - Added shippo dependency

## Support

For issues related to:
- **Shippo API**: Check [Shippo Documentation](https://docs.goshippo.com/)
- **This Integration**: Review error messages in shipments table
- **Database**: Check Supabase logs and RLS policies

## Next Steps

Optional enhancements you might consider:
1. **Rate Selection**: Allow admin to choose from multiple rates instead of auto-selecting cheapest
2. **Label Regeneration**: Add ability to void and regenerate labels
3. **Tracking Updates**: Webhook integration for automatic tracking status updates
4. **Bulk Label Generation**: Generate labels for multiple orders at once
5. **Custom Parcel Dimensions**: Allow per-order parcel size configuration







