-- Fix RLS infinite recursion issue
-- Run this in Supabase SQL Editor

-- First, allow public read access to admin_users for policy checks (but not direct access)
-- We'll use a security definer function instead

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Products are editable by admins" ON products;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Inventory is admin only" ON inventory;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;

-- Create a function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_uuid
  );
$$;

-- Create a function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_uuid
    AND role = 'super_admin'
  );
$$;

-- Recreate policies using the functions (no recursion!)
CREATE POLICY "Products are editable by admins" ON products
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Inventory is admin only" ON inventory
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (is_super_admin(auth.uid()));








