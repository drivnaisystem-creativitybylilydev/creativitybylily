# Return Automation Setup Checklist

## ✅ Quick Check: What You Need to Configure

### 1. **Database Migration** (REQUIRED - One-time setup)

The refund automation needs a `payment_id` column in the orders table. Run this SQL in your Supabase SQL Editor:

**File**: `supabase/add-payment-id-column.sql`

```sql
-- Add payment_id column to orders table for Square payment IDs
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
```

**Steps:**
1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL above
5. Click **Run** (or press Cmd/Ctrl + Enter)

**That's it!** This is a one-time setup.

---

### 2. **Environment Variables** (Already Configured ✅)

The automation uses the same Square credentials you already have set up:

- ✅ `SQUARE_ACCESS_TOKEN` - Already set
- ✅ `SQUARE_ENVIRONMENT` - Already set  
- ✅ `SQUARE_LOCATION_ID` - Already set (not used for refunds, but good to have)

**No additional environment variables needed!**

---

### 3. **Verify It's Working**

After running the SQL migration, test the automation:

#### **Test Customer Tracking Input:**
1. Create a test return (or use existing one)
2. Admin approves the return
3. Go to **Account → Returns** tab
4. You should see the tracking input field
5. Add a tracking number
6. Status should automatically update to "Shipped"

#### **Test Automatic Refund:**
1. Admin receives return package
2. Admin updates status to `received`
3. Admin updates status to `processed`
4. Admin updates status to `refunded`
5. **Refund should automatically process through Square**
6. Customer receives refund confirmation email

---

## ⚠️ Important Notes

### Payment ID Storage
- New orders automatically store `payment_id` when created (already working)
- Old orders might only have `payment_intent_id` (legacy)
- The refund code checks both columns, so it should work for both

### If Refund Fails
- If an order doesn't have a payment ID, you'll see an error message
- Admin can still process refund manually through Square Dashboard
- The error message will tell you exactly what's missing

---

## 🎯 Summary

**You need to do ONE thing:**
1. ✅ Run the SQL migration to add `payment_id` column (if not already done)

**Everything else is already configured:**
- ✅ Environment variables set
- ✅ Code is ready
- ✅ Components are in place

**That's it!** Once you run the SQL migration, the automation is fully functional.

---

**Questions?** Check the error messages - they'll tell you exactly what's missing if something isn't configured correctly.


