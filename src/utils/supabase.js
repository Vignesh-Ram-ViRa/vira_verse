import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/apiEndpoints';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Helper function to get the current user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

/**
 * Helper function to check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

/**
 * Helper function to sign out user
 * @returns {Promise<Object>} Supabase auth response
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

/**
 * Helper function to handle authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return () => subscription.unsubscribe();
};

/**
 * Projects API functions
 */
export const projectsAPI = {
  /**
   * Get all projects (respects RLS policies)
   * @returns {Promise<Array>} Array of projects
   */
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in projectsAPI.getAll:', error);
      throw error;
    }
  },

  /**
   * Get public projects only (for guest users)
   * @returns {Promise<Array>} Array of public projects
   */
  getPublic: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('private', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching public projects:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in projectsAPI.getPublic:', error);
      throw error;
    }
  },

  /**
   * Get private projects only (for authenticated users)
   * @returns {Promise<Array>} Array of private projects
   */
  getPrivate: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('private', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching private projects:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in projectsAPI.getPrivate:', error);
      throw error;
    }
  },

  /**
   * Get featured projects
   * @returns {Promise<Array>} Array of featured projects
   */
  getFeatured: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured projects:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in projectsAPI.getFeatured:', error);
      throw error;
    }
  },

  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object|null>} Project object or null
   */
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project by ID:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in projectsAPI.getById:', error);
      throw error;
    }
  },

  /**
   * Create a new project
   * @param {Object} project - Project data
   * @returns {Promise<Object>} Created project
   */
  create: async (project) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to create projects');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, user_id: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in projectsAPI.create:', error);
      throw error;
    }
  },

  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {Object} updates - Project updates
   * @returns {Promise<Object>} Updated project
   */
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in projectsAPI.update:', error);
      throw error;
    }
  },

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in projectsAPI.delete:', error);
      throw error;
    }
  }
};

/**
 * Upload image to Cloudinary via Supabase Edge Function
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Cloudinary URL
 */
export const uploadImage = async (file) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to upload images');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/cloudinary-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 