-- Allow signed-in customers to see orders placed as guest when the checkout email matches their auth email.
-- Fixes: confirmation email sent (order exists) but "My Account" shows no orders because user_id was null.
-- Run in Supabase SQL Editor after reviewing.

-- Orders: extend "own orders" to include guest orders tied to the same email as the JWT
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    user_id = auth.uid()
    OR (
      user_id IS NULL
      AND customer_email IS NOT NULL
      AND LOWER(TRIM(customer_email)) = LOWER(TRIM(COALESCE((auth.jwt()->>'email')::text, '')))
    )
  );

-- Order items: same visibility as parent order
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid()
        OR (
          orders.user_id IS NULL
          AND orders.customer_email IS NOT NULL
          AND LOWER(TRIM(orders.customer_email)) = LOWER(TRIM(COALESCE((auth.jwt()->>'email')::text, '')))
        )
      )
    )
  );
