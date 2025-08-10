-- Initial Data for Vira Verse Projects
-- This file contains the initial sample projects as specified in requirements

-- Note: This script assumes you have a user_id. 
-- Replace '123e4567-e89b-12d3-a456-426614174000' with the actual UUID of the user after authentication is set up.
-- For development, you can create a dummy user or use a placeholder UUID.

-- Insert sample projects
-- WARNING: Update the user_id values with actual user UUIDs before running in production

INSERT INTO projects (
    user_id,
    title, 
    description, 
    link, 
    github, 
    preview_image_url, 
    status, 
    category, 
    year, 
    featured, 
    private
) VALUES 
(
    '123e4567-e89b-12d3-a456-426614174000', -- Replace with actual user UUID
    'Life Of Vidhya',
    'A fun app featuring Vidhya''s lifecycle photos and comments created as a gift',
    'https://life-of-vidhya.netlify.app',
    'https://github.com/Vignesh-Ram-ViRa/vid_game',
    'https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png',
    'Completed',
    'Fun',
    2025,
    TRUE,
    TRUE
),
(
    '123e4567-e89b-12d3-a456-426614174000', -- Replace with actual user UUID
    'Vira Lobby',
    'An app to record and display my hobbies and interests',
    'https://www.google.com',
    'https://github.com/Vignesh-Ram-ViRa/vira_lobby',
    'https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png',
    'In Progress',
    'Fun',
    2025,
    FALSE,
    FALSE
),
(
    '123e4567-e89b-12d3-a456-426614174000', -- Replace with actual user UUID
    'Vira Ledger',
    'An app to manage my finances',
    'https://www.google.com',
    'https://github.com/Vignesh-Ram-ViRa/vira_ledger',
    'https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png',
    'In Progress',
    'Finance',
    2025,
    TRUE,
    TRUE
),
(
    '123e4567-e89b-12d3-a456-426614174000', -- Replace with actual user UUID
    'The Vira Story',
    'My portfolio app that seconds as my resume',
    'https://www.google.com',
    'https://github.com/Vignesh-Ram-ViRa/vira_portfolio',
    'https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png',
    'Completed',
    'Career',
    2025,
    TRUE,
    FALSE
),
(
    '123e4567-e89b-12d3-a456-426614174000', -- Replace with actual user UUID
    'Vira Library',
    'An app to record all AI tools I come across',
    'https://www.google.com',
    'https://github.com/Vignesh-Ram-ViRa/vira_library',
    'https://media.githubusercontent.com/media/Vignesh-Ram-ViRa/vira_assets/refs/heads/main/public/assets/images/vira_verse/preview.png',
    'In Progress',
    'Knowledge',
    2025,
    FALSE,
    FALSE
);

-- Comments for documentation
COMMENT ON TABLE projects IS 'Initial sample projects inserted for development and testing';

-- Query to verify data insertion (uncomment to use)
-- SELECT 
--     title,
--     status,
--     category,
--     year,
--     featured,
--     private,
--     created_at
-- FROM projects 
-- ORDER BY created_at DESC; 