-- Development Setup for Vira Verse
-- Temporarily removes constraints for easier testing

-- Remove foreign key constraint temporarily for development testing
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Now you can insert test data without worrying about user_id foreign keys

-- Note: Run this BEFORE inserting sample data
-- The constraint will be restored when we implement authentication 