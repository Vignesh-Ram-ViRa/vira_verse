import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/apiEndpoints';

// Initialize Supabase client with session configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Session will expire when browser closes
    persistSession: false,
    // Auto refresh tokens
    autoRefreshToken: true,
    // Detect session in URL
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
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} userData - Additional user data
 * @returns {Promise<Object>} Supabase auth response
 */
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Supabase auth response
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

/**
 * Sign in with magic link
 * @param {string} email - User email
 * @returns {Promise<Object>} Supabase auth response
 */
export const signInWithMagicLink = async (email) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    });
    
    if (error) {
      console.error('Error signing in with magic link:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in signInWithMagicLink:', error);
    throw error;
  }
};

/**
 * Reset password
 * @param {string} email - User email
 * @returns {Promise<Object>} Supabase auth response
 */
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in resetPassword:', error);
    throw error;
  }
};

/**
 * Guest mode - sets a flag to indicate guest user
 * @returns {Object} Guest user object
 */
export const enterGuestMode = () => {
  const guestUser = {
    id: 'guest',
    email: 'guest@viraverse.app',
    user_metadata: {
      display_name: 'Guest User',
      is_guest: true
    }
  };
  
  // Store guest flag in localStorage
  localStorage.setItem('vira-verse-guest-mode', 'true');
  
  return guestUser;
};

/**
 * Check if user is in guest mode
 * @returns {boolean} True if in guest mode
 */
export const isGuestMode = () => {
  return localStorage.getItem('vira-verse-guest-mode') === 'true';
};

/**
 * Exit guest mode
 */
export const exitGuestMode = () => {
  localStorage.removeItem('vira-verse-guest-mode');
};

// Check if user is super admin
export const isSuperAdmin = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    // Define super admin emails here
    const superAdminEmails = [
      'vigneshuramu@gmail.com', // Your email
      // Add more super admin emails as needed
    ];
    
    return superAdminEmails.includes(user.email);
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

/**
 * Projects API functions
 */
export const projectsAPI = {
  /**
   * Get all projects (respects RLS policies and super admin access)
   * @returns {Promise<Array>} Array of projects
   */
  getAll: async () => {
    try {
      const user = await getCurrentUser();
      const isAdmin = await isSuperAdmin();
      
      let query = supabase.from('projects').select('*');
      
      // If super admin, get ALL projects from ALL users
      if (isAdmin) {
        // Super admin sees everything - no user_id filter
        console.log('🔑 Super admin access: fetching all projects from all users');
      } else if (user) {
        // Regular user sees only their own projects
        query = query.eq('user_id', user.id);
      }
      // Guest users rely on RLS policies (only public projects)
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
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
    console.log('🔄 Starting image upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to upload images');
    }

    console.log('✅ User authenticated, uploading to Edge Function...');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/cloudinary-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    console.log('📥 Edge Function Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('❌ Edge Function Error:', { status: response.status, errorData });
      
      // Provide helpful error messages based on status
      if (response.status === 404) {
        throw new Error('Upload service not found. The Edge Function may not be deployed yet.');
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 500) {
        throw new Error(`Server error: ${errorData.error || 'Internal server error'}`);
      } else {
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('✅ Upload successful:', data);
    
    if (!data.url) {
      throw new Error('Invalid response: No URL returned from upload service');
    }
    
    return data.url;
  } catch (error) {
    console.error('💥 Image upload failed:', error);
    throw error;
  }
}; 