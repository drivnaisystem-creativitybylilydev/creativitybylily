-- Add separate customer information columns to orders table
-- Run this in Supabase SQL Editor

-- Add customer info columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_first_name TEXT,
ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_first_name, customer_last_name);

-- Add comments for documentation
COMMENT ON COLUMN orders.customer_email IS 'Customer email address for marketing and communication';
COMMENT ON COLUMN orders.customer_first_name IS 'Customer first name';
COMMENT ON COLUMN orders.customer_last_name IS 'Customer last name';
COMMENT ON COLUMN orders.customer_phone IS 'Customer phone number';








