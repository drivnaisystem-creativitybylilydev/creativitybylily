-- Script to create your first admin user
-- Run this AFTER:
--   1. Creating a user account through Supabase Auth
--   2. Running supabase/fix-admin-users-fk.sql (one-time setup)
-- 
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" and create a user with email/password
-- 3. Copy the user's UUID (ID) from the Users table
-- 4. Replace 'USER_UUID_HERE' below with the actual UUID
-- 5. Copy ONLY the INSERT statement (not the comments) and run it in SQL Editor

INSERT INTO admin_users (user_id, role)
VALUES ('USER_UUID_HERE', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

