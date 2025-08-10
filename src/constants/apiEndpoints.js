// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// API endpoints
export const API_ENDPOINTS = {
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_USER: '/auth/user',
  
  // File upload
  UPLOAD_IMAGE: '/upload/image',
  
  // Export
  EXPORT_PROJECTS: '/export/projects'
};

// Database table names
export const TABLES = {
  PROJECTS: 'projects',
  USERS: 'users'
};

// Storage buckets
export const STORAGE_BUCKETS = {
  IMAGES: 'project-images'
}; 