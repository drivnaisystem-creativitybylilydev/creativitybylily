-- Add payment_id column to orders table for Square payment IDs
-- Run this in your Supabase SQL Editor

-- Add payment_id column (for Square payment IDs)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Add comment for documentation
COMMENT ON COLUMN orders.payment_id IS 'Square payment ID for refund processing';


