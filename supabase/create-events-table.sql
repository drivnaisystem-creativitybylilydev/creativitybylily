-- Create events table for Events & Pop-Up Shops CMS
-- Run this in your Supabase SQL Editor

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('event', 'popup', 'market')),
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  link TEXT,
  is_featured BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public can read published events (all events are public-readable)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- RLS Policies: Only admins can manage events
CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Add comments for documentation
COMMENT ON TABLE events IS 'Events, pop-up shops, markets, and special appearances';
COMMENT ON COLUMN events.type IS 'Type of event: event, popup, or market';
COMMENT ON COLUMN events.is_featured IS 'Featured events appear prominently on homepage';
COMMENT ON COLUMN events.end_date IS 'Optional end date. If null, event is single-day';





