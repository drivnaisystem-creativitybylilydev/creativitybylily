-- Fix admin_users foreign key to reference auth.users directly
-- This allows admin users to be created without needing a record in the users table

-- Drop the existing foreign key constraint
ALTER TABLE admin_users 
DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Add new foreign key constraint pointing to auth.users
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;








