-- Fix existing wali users with null email
-- Run this in Supabase SQL Editor

UPDATE users 
SET email = phone || '@nurmancourse.local' 
WHERE email IS NULL 
  AND role = 'wali';

-- Verify the fix
SELECT id, name, phone, email, role 
FROM users 
WHERE role = 'wali';
