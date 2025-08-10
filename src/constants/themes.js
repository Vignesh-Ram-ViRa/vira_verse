export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  PASTEL: 'pastel'
};

export const THEME_CONFIG = {
  [THEMES.LIGHT]: {
    name: 'Formal Light',
    colors: {
      // Primary brand colors
      primary: '#3b82f6',
      primaryHover: '#1e40af',
      primaryRgb: '59, 130, 246',
      accent: '#10b981',
      accentRgb: '16, 185, 129',

      // Background colors
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      surface: 'rgba(255, 255, 255, 0.95)',
      surfaceElevated: 'rgba(248, 250, 252, 0.95)',

      // Text colors
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',

      // Border and interactive
      border: 'rgba(226, 232, 240, 0.8)',
      borderHover: 'rgba(59, 130, 246, 0.3)',

      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',

      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      shadow2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  },

  [THEMES.DARK]: {
    name: 'Formal Dark',
    colors: {
      // Primary brand colors - Subtle orange with gradients
      primary: '#ff6b35',
      primaryHover: '#e55a2b',
      primaryRgb: '255, 107, 53',
      accent: '#9b59b6',
      accentRgb: '155, 89, 182',

      // Background colors - Dark navy and grays
      // background: '#1a1a2e',
      // backgroundSecondary: '#16213e',
      // surface: 'rgba(37, 42, 66, 0.95)',
      // surfaceElevated: 'rgba(54, 62, 94, 0.95)',
      // Background colors - Black and dark grays
      background: '#000000',
      backgroundSecondary: '#0d0d0d',
      surface: 'rgba(26, 26, 26, 0.95)',
      surfaceElevated: 'rgba(45, 45, 45, 0.95)',

      // Text colors - Clean whites and grays
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',

      // Border and interactive
      border: 'rgba(71, 85, 105, 0.4)',
      borderHover: 'rgba(255, 107, 53, 0.3)',

      // Status colors
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#60a5fa',

      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
      shadow2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
    }
  },

  [THEMES.PASTEL]: {
    name: 'Fun Pastel',
    colors: {
      // Primary brand colors (vibrant pastels)
      primary: '#ff6b9d',
      primaryHover: '#e55a8a',
      primaryRgb: '255, 107, 157',
      accent: '#4ecdc4',
      accentRgb: '78, 205, 196',

      // Background colors (vibrant and playful with 3D depth)
      background: 'radial-gradient(ellipse at top left, #ff9a9e 0%, #fecfef 30%, #fecfef 60%, #f0c3f7 100%)',
      backgroundSecondary: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      surfaceElevated: 'rgba(255, 255, 255, 0.98)',

      // Text colors (vibrant but readable)
      textPrimary: '#2d3748',
      textSecondary: '#4a5568',
      textMuted: '#718096',

      // Border and interactive
      border: 'rgba(255, 107, 157, 0.2)',
      borderHover: 'rgba(255, 107, 157, 0.4)',

      // Status colors (fun and vibrant)
      success: '#48bb78',
      warning: '#ed8936',
      error: '#f56565',
      info: '#4299e1',

      // Shadows (colorful)
      shadowSm: '0 1px 2px 0 rgba(255, 107, 157, 0.15)',
      shadowMd: '0 4px 6px -1px rgba(255, 107, 157, 0.2)',
      shadowLg: '0 10px 15px -3px rgba(255, 107, 157, 0.25)',
      shadowXl: '0 20px 25px -5px rgba(255, 107, 157, 0.3)',
      shadow2xl: '0 25px 50px -12px rgba(255, 107, 157, 0.4)'
    }
  }
};

export const DEFAULT_THEME = THEMES.DARK; 