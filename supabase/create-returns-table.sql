-- Returns table for tracking return requests
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'received', 'processed', 'refunded', 'rejected')),
  reason TEXT,
  return_items JSONB NOT NULL, -- Array of {order_item_id, quantity, product_id, variant_id, price}
  refund_amount DECIMAL(10, 2) NOT NULL CHECK (refund_amount >= 0),
  return_shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (return_shipping_cost >= 0),
  return_address JSONB, -- Shipping address for return
  return_tracking_number TEXT,
  return_label_url TEXT,
  admin_notes TEXT,
  refund_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON returns(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);
CREATE INDEX IF NOT EXISTS idx_returns_return_number ON returns(return_number);

-- Function to generate return numbers
CREATE OR REPLACE FUNCTION generate_return_number()
RETURNS TEXT AS $$
DECLARE
  new_return_number TEXT;
BEGIN
  LOOP
    new_return_number := 'RET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM returns WHERE return_number = new_return_number);
  END LOOP;
  RETURN new_return_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON returns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

-- Users can view their own returns
CREATE POLICY "Users can view own returns" ON returns
  FOR SELECT USING (user_id = auth.uid());

-- Users can create their own returns
CREATE POLICY "Users can create own returns" ON returns
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can view all returns
CREATE POLICY "Admins can view all returns" ON returns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );
