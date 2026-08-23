-- Site-wide settings, singleton row (id is always 1).
-- Powers the storefront "pause" mode: temporarily close the shop without a code deploy.
-- Run this in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_paused BOOLEAN NOT NULL DEFAULT false,
  pause_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO site_settings (id, store_paused)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
