-- Add delivered_at column to orders table for auto-delivery detection
-- Run this in your Supabase SQL Editor

-- Add delivered_at column (set when Shippo tracking confirms USPS delivery)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN orders.delivered_at IS 'Timestamp when the order was auto-marked delivered from a Shippo tracking update (or manually overridden)';
