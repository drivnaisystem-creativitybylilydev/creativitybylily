-- Allows a review to exist without a specific product (site-wide testimonials,
-- e.g. imported reviews whose original product is no longer in the catalog).
-- Per-product reviews (submitted through the on-site form) are unaffected —
-- that flow always supplies a product_id.
-- Run this in your Supabase SQL Editor, alongside create-site-settings-table.sql.

ALTER TABLE reviews ALTER COLUMN product_id DROP NOT NULL;
