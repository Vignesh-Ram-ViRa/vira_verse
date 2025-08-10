-- Vira Verse Database Schema
-- This file contains the complete database schema for the Vira Verse application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE project_status AS ENUM ('Not Started', 'In Progress', 'Completed');

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    -- Primary key and metadata
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Project information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(500),
    github VARCHAR(500),
    preview_image_url VARCHAR(500),
    
    -- Project categorization and status
    status project_status DEFAULT 'Not Started',
    category VARCHAR(100),
    year INTEGER CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW() + INTERVAL '10 years')),
    
    -- Project flags
    featured BOOLEAN DEFAULT FALSE,
    private BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_private ON projects(private);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_user_private_featured ON projects(user_id, private, featured);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Stores project information for the Vira Verse portfolio application';
COMMENT ON COLUMN projects.id IS 'Unique identifier for each project';
COMMENT ON COLUMN projects.user_id IS 'Reference to the user who owns this project';
COMMENT ON COLUMN projects.title IS 'Display name of the project';
COMMENT ON COLUMN projects.description IS 'Detailed description of the project';
COMMENT ON COLUMN projects.link IS 'URL to the live/deployed version of the project';
COMMENT ON COLUMN projects.github IS 'URL to the GitHub repository';
COMMENT ON COLUMN projects.preview_image_url IS 'URL to the project preview image (stored in Cloudinary)';
COMMENT ON COLUMN projects.status IS 'Current development status of the project';
COMMENT ON COLUMN projects.category IS 'Project category (e.g., Fun, Finance, Career, Knowledge)';
COMMENT ON COLUMN projects.year IS 'Year the project was created or completed';
COMMENT ON COLUMN projects.featured IS 'Whether this project should be featured prominently';
COMMENT ON COLUMN projects.private IS 'Whether this project is private (visible only to owner)';
COMMENT ON COLUMN projects.created_at IS 'Timestamp when the project was created';
COMMENT ON COLUMN projects.updated_at IS 'Timestamp when the project was last updated'; 