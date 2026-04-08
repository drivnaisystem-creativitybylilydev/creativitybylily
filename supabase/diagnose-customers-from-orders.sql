-- Run in Supabase SQL Editor to see why Admin → Customers might be empty.
-- The app now reads email from customer_email OR shipping_address (e.g. ->>'email').
-- Use the backfill block below only if you want to copy JSON into the flat columns.

-- 1) Overview
SELECT
  count(*) AS total_orders,
  count(*) FILTER (WHERE customer_email IS NOT NULL AND trim(customer_email) <> '') AS has_flat_email,
  count(*) FILTER (
    WHERE (customer_email IS NULL OR trim(customer_email) = '')
      AND shipping_address IS NOT NULL
      AND trim(COALESCE(shipping_address->>'email', '')) <> ''
  ) AS missing_flat_but_json_has_email,
  count(*) FILTER (
    WHERE (customer_email IS NULL OR trim(customer_email) = '')
      AND (
        shipping_address IS NULL
        OR trim(COALESCE(shipping_address->>'email', '')) = ''
      )
  ) AS no_email_anywhere
FROM orders;

-- 2) Sample rows where flat email is empty but JSON might have it (first 20)
SELECT
  id,
  order_number,
  created_at,
  customer_email,
  shipping_address->>'email' AS json_email,
  shipping_address->>'firstName' AS json_first_name,
  shipping_address->>'lastName' AS json_last_name
FROM orders
WHERE (customer_email IS NULL OR trim(customer_email) = '')
ORDER BY created_at DESC
LIMIT 20;

-- 3) OPTIONAL backfill: copy checkout JSON (camelCase) into customer_* columns
-- Review the SELECT below first; then run the UPDATE in a transaction if it looks right.
/*
BEGIN;

UPDATE orders
SET
  customer_email = lower(trim(shipping_address->>'email')),
  customer_first_name = COALESCE(
    NULLIF(trim(customer_first_name), ''),
    NULLIF(trim(shipping_address->>'firstName'), '')
  ),
  customer_last_name = COALESCE(
    NULLIF(trim(customer_last_name), ''),
    NULLIF(trim(shipping_address->>'lastName'), '')
  ),
  customer_phone = COALESCE(
    NULLIF(trim(customer_phone), ''),
    NULLIF(trim(shipping_address->>'phone'), '')
  )
WHERE (customer_email IS NULL OR trim(customer_email) = '')
  AND shipping_address ? 'email'
  AND trim(COALESCE(shipping_address->>'email', '')) <> '';

COMMIT;
*/
