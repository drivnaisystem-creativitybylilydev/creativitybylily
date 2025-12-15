-- Create shipments table to store Shippo transaction data
-- Run this in your Supabase SQL Editor

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Shippo identifiers
  shippo_shipment_id TEXT UNIQUE,
  shippo_transaction_id TEXT UNIQUE,
  shippo_rate_id TEXT,
  
  -- Label information
  label_url TEXT,
  label_pdf_url TEXT,
  tracking_number TEXT,
  tracking_status TEXT,
  tracking_status_details TEXT,
  
  -- Carrier information
  carrier TEXT, -- e.g., 'usps', 'ups', 'fedex'
  service_level TEXT, -- e.g., 'usps_priority', 'usps_first', 'ups_ground'
  service_level_name TEXT, -- Human-readable name
  
  -- Shipping details
  shipping_cost DECIMAL(10, 2),
  parcel_weight DECIMAL(10, 2), -- in ounces
  parcel_length DECIMAL(10, 2), -- in inches
  parcel_width DECIMAL(10, 2), -- in inches
  parcel_height DECIMAL(10, 2), -- in inches
  
  -- Address information (stored for reference)
  from_address JSONB,
  to_address JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'created', 'purchased', 'failed', 'refunded')),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_shippo_shipment_id ON shipments(shippo_shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipments_shippo_transaction_id ON shipments(shippo_transaction_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admins can view all shipments
CREATE POLICY "Admins can view all shipments" ON shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- RLS Policies: Admins can manage all shipments
CREATE POLICY "Admins can manage all shipments" ON shipments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Trigger to auto-update updated_at
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE shipments IS 'Stores Shippo shipping label transactions and metadata';
COMMENT ON COLUMN shipments.shippo_shipment_id IS 'Shippo shipment object ID';
COMMENT ON COLUMN shipments.shippo_transaction_id IS 'Shippo transaction object ID (created when label is purchased)';
COMMENT ON COLUMN shipments.label_url IS 'URL to the shipping label (PDF_4x6 format)';
COMMENT ON COLUMN shipments.tracking_status IS 'Current tracking status from Shippo (e.g., UNKNOWN, PRE_TRANSIT, IN_TRANSIT, DELIVERED)';







