-- Create reviews table for product reviews
-- Run this in your Supabase SQL Editor

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- Link to order for verified purchase badge
  
  -- Reviewer information
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  
  -- Photos (optional)
  images TEXT[] DEFAULT '{}',
  
  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- For homepage/featured reviews
  admin_response TEXT, -- Optional response from store owner
  
  -- Verification
  verified_purchase BOOLEAN DEFAULT false,
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0, -- For "Was this helpful?" feature (future)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id, is_approved) WHERE is_approved = true;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved_rating ON reviews(product_id, is_approved, rating) WHERE is_approved = true;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_approved = true);

-- RLS Policies: Anyone can submit a review (we'll verify email server-side)
CREATE POLICY "Anyone can submit reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- RLS Policies: Only admins can update/delete reviews
CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'Product reviews with ratings, comments, and moderation';
COMMENT ON COLUMN reviews.verified_purchase IS 'True if reviewer actually purchased the product';
COMMENT ON COLUMN reviews.is_approved IS 'Reviews must be approved by admin before showing publicly';
COMMENT ON COLUMN reviews.is_featured IS 'Featured reviews can be displayed on homepage';
COMMENT ON COLUMN reviews.helpful_count IS 'Number of users who found review helpful (future feature)';

-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION get_product_rating(product_uuid UUID)
RETURNS TABLE(
  average_rating NUMERIC,
  total_reviews BIGINT,
  rating_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*) as total_reviews,
    jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    ) as rating_distribution
  FROM reviews
  WHERE product_id = product_uuid AND is_approved = true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_product_rating IS 'Calculate average rating and distribution for a product';
