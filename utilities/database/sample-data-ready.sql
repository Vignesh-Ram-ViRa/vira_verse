-- Sample Data for Vira Verse - Ready to Run
-- Uses a dummy UUID for immediate testing

-- Insert sample projects with dummy user_id
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
    '123e4567-e89b-12d3-a456-426614174000', -- Dummy UUID for testing
    'Personal Portfolio Website',
    'A modern, responsive portfolio website built with React and featuring dark/light themes, smooth animations, and a showcase of my projects and skills.',
    'https://viraverse.dev',
    'https://github.com/Vignesh-Ram-ViRa/portfolio',
    'https://via.placeholder.com/400x300/6366f1/ffffff?text=Portfolio',
    'Completed',
    'Career',
    2024,
    true,
    false
),
(
    '123e4567-e89b-12d3-a456-426614174000',
    'Task Management App',
    'A comprehensive task management application with real-time collaboration, drag-and-drop functionality, and team workspaces.',
    'https://taskmaster.viraverse.dev',
    'https://github.com/Vignesh-Ram-ViRa/taskmaster',
    'https://via.placeholder.com/400x300/10b981/ffffff?text=TaskMaster',
    'In Progress',
    'Productivity',
    2024,
    true,
    false
),
(
    '123e4567-e89b-12d3-a456-426614174000',
    'Weather Dashboard',
    'An interactive weather dashboard with detailed forecasts, radar maps, and location-based weather alerts.',
    'https://weather.viraverse.dev',
    'https://github.com/Vignesh-Ram-ViRa/weather-app',
    'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Weather',
    'Completed',
    'Fun',
    2023,
    false,
    false
),
(
    '123e4567-e89b-12d3-a456-426614174000',
    'Expense Tracker',
    'A personal finance application for tracking expenses, creating budgets, and analyzing spending patterns.',
    'https://expenses.viraverse.dev',
    'https://github.com/Vignesh-Ram-ViRa/expense-tracker',
    'https://via.placeholder.com/400x300/ef4444/ffffff?text=Expenses',
    'Completed',
    'Finance',
    2023,
    true,
    false
),
(
    '123e4567-e89b-12d3-a456-426614174000',
    'Secret Project Alpha',
    'A confidential project currently in development. Details will be revealed soon!',
    null,
    'https://github.com/Vignesh-Ram-ViRa/secret-alpha',
    'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Secret',
    'In Progress',
    'Innovation',
    2024,
    false,
    true
);

-- Verify the insert
SELECT 
    title,
    status,
    category,
    year,
    featured,
    private,
    created_at
FROM projects 
ORDER BY created_at DESC; 