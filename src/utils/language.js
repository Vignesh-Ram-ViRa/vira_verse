import { LANGUAGE_CONTENT } from '../constants/language';

/**
 * Get language content for the application
 * @returns {Object} Language content object
 */
export const getLanguageContent = () => {
  return LANGUAGE_CONTENT;
};

/**
 * Get a specific language key with fallback
 * @param {string} key - Dot notation key (e.g., 'auth.loginTitle')
 * @param {string} fallback - Fallback text if key not found
 * @returns {string} Translated text or fallback
 */
export const getLanguageKey = (key, fallback = '') => {
  const keys = key.split('.');
  let value = LANGUAGE_CONTENT;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof value === 'string' ? value : fallback || key;
};

/**
 * Replace placeholders in language strings
 * @param {string} text - Text with placeholders like {name}
 * @param {Object} params - Object with replacement values
 * @returns {string} Text with placeholders replaced
 */
export const formatLanguageString = (text, params = {}) => {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
}; 