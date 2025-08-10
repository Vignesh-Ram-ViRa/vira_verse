-- Row Level Security (RLS) Policies for Vira Verse
-- This file contains all RLS policies for secure data access

-- Enable RLS on the projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow owners to see all their own projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Allow owners to insert their own projects
CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow owners to update their own projects
CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow owners to delete their own projects
CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy 5: Allow everyone to view public projects (for guest mode)
CREATE POLICY "Anyone can view public projects" ON projects
    FOR SELECT
    USING (private = false);

-- Policy 6: Allow anonymous users to view public projects
-- This is important for guest mode functionality
CREATE POLICY "Anonymous users can view public projects" ON projects
    FOR SELECT
    USING (private = false AND auth.role() = 'anon');

-- Additional security: Prevent unauthorized access to any project data
-- This is a catch-all policy that denies access unless explicitly allowed above
-- (This is implicit with RLS enabled, but good to be explicit)

-- Create a function to check if user is the project owner or if project is public
CREATE OR REPLACE FUNCTION can_access_project(project_row projects)
RETURNS BOOLEAN AS $$
BEGIN
    -- If user is authenticated and owns the project, allow access
    IF auth.uid() = project_row.user_id THEN
        RETURN TRUE;
    END IF;
    
    -- If project is public, allow access
    IF project_row.private = FALSE THEN
        RETURN TRUE;
    END IF;
    
    -- Otherwise, deny access
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON POLICY "Users can view their own projects" ON projects IS 'Allows authenticated users to view all their own projects';
COMMENT ON POLICY "Users can insert their own projects" ON projects IS 'Allows authenticated users to create new projects';
COMMENT ON POLICY "Users can update their own projects" ON projects IS 'Allows authenticated users to modify their own projects';
COMMENT ON POLICY "Users can delete their own projects" ON projects IS 'Allows authenticated users to delete their own projects';
COMMENT ON POLICY "Anyone can view public projects" ON projects IS 'Allows anyone (including guests) to view non-private projects';
COMMENT ON POLICY "Anonymous users can view public projects" ON projects IS 'Specifically allows unauthenticated users to view public projects for guest mode';

COMMENT ON FUNCTION can_access_project(projects) IS 'Helper function to determine if a user can access a specific project based on ownership or public status'; 