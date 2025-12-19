-- Add admin_viewed_at columns to track when admin has viewed items
-- This enables notification badges for new activity

-- Add to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS admin_viewed_at TIMESTAMP WITH TIME ZONE;

-- Add to returns table
ALTER TABLE returns 
ADD COLUMN IF NOT EXISTS admin_viewed_at TIMESTAMP WITH TIME ZONE;

-- Add to events table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS admin_viewed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_admin_viewed ON orders(admin_viewed_at) WHERE admin_viewed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_returns_admin_viewed ON returns(admin_viewed_at) WHERE admin_viewed_at IS NULL;
