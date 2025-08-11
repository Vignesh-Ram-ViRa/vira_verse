-- Super Admin RLS Policies for Vira Verse
-- Additional policies to allow super admin full access to all projects

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Get the current user's email
    DECLARE
        user_email TEXT;
    BEGIN
        SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
        
        -- Check if user email is in super admin list
        RETURN user_email IN ('vigneshuramu@gmail.com');
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Super Admin Policy 1: Super admin can view ALL projects
CREATE POLICY "Super admin can view all projects" ON projects
    FOR SELECT
    USING (is_super_admin());

-- Super Admin Policy 2: Super admin can insert projects for any user
CREATE POLICY "Super admin can insert any project" ON projects
    FOR INSERT
    WITH CHECK (is_super_admin());

-- Super Admin Policy 3: Super admin can update ANY project
CREATE POLICY "Super admin can update any project" ON projects
    FOR UPDATE
    USING (is_super_admin())
    WITH CHECK (is_super_admin());

-- Super Admin Policy 4: Super admin can delete ANY project
CREATE POLICY "Super admin can delete any project" ON projects
    FOR DELETE
    USING (is_super_admin());

-- Comments for documentation
COMMENT ON FUNCTION is_super_admin() IS 'Function to check if current user is a super admin based on email';
COMMENT ON POLICY "Super admin can view all projects" ON projects IS 'Allows super admin to view all projects from all users';
COMMENT ON POLICY "Super admin can insert any project" ON projects IS 'Allows super admin to create projects for any user';
COMMENT ON POLICY "Super admin can update any project" ON projects IS 'Allows super admin to modify any project from any user';
COMMENT ON POLICY "Super admin can delete any project" ON projects IS 'Allows super admin to delete any project from any user'; 