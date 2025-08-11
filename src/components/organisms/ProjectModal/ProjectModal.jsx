import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth.jsx';
import { projectsAPI } from '../../../utils/supabase';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import ImageUpload from '../../molecules/ImageUpload/ImageUpload.jsx';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import './ProjectModal.css';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project = null, 
  mode = 'view', // 'view', 'add', 'edit', 'delete'
  onSuccess 
}) => {
  const { isOwner } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    github: '',
    preview_image_url: '',
    status: 'Not Started',
    category: '',
    year: new Date().getFullYear(),
    featured: false,
    private: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Status options
  const statusOptions = [
    'Not Started',
    'In Progress', 
    'Completed'
  ];

  // Category options
  const categoryOptions = [
    'Fun',
    'Finance', 
    'Career',
    'Knowledge',
    'Innovation',
    'Productivity'
  ];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        link: project.link || '',
        github: project.github || '',
        preview_image_url: project.preview_image_url || '',
        status: project.status || 'Not Started',
        category: project.category || '',
        year: project.year || new Date().getFullYear(),
        featured: project.featured || false,
        private: project.private || false
      });
    } else if (isOpen && mode === 'add') {
      // Reset form for new project
      setFormData({
        title: '',
        description: '',
        link: '',
        github: '',
        preview_image_url: '',
        status: 'Not Started',
        category: '',
        year: new Date().getFullYear(),
        featured: false,
        private: false
      });
    }
    
    // Clear errors when modal opens
    setError('');
    setValidationErrors({});
  }, [isOpen, project, mode]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Project title is required';
    }
    
    if (formData.title.length > 255) {
      errors.title = 'Title must be less than 255 characters';
    }
    
    if (formData.link && !isValidUrl(formData.link)) {
      errors.link = 'Please enter a valid URL';
    }
    
    if (formData.github && !isValidUrl(formData.github)) {
      errors.github = 'Please enter a valid URL';
    }
    
    if (formData.preview_image_url && !isValidUrl(formData.preview_image_url)) {
      errors.preview_image_url = 'Please enter a valid URL';
    }
    
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 10) {
      errors.year = 'Year must be between 1900 and ' + (new Date().getFullYear() + 10);
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!isOwner) {
      setError('You must be logged in as the owner to manage projects');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'add') {
        result = await projectsAPI.create(formData);
      } else if (mode === 'edit') {
        result = await projectsAPI.update(project.id, formData);
      }
      
      if (onSuccess) {
        onSuccess(result, mode);
      }
      
      onClose();
    } catch (err) {
      console.error('Project operation failed:', err);
      setError(err.message || 'Failed to save project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      setError('You must be logged in as the owner to delete projects');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await projectsAPI.delete(project.id);
      
      if (onSuccess) {
        onSuccess(project, 'delete');
      }
      
      onClose();
    } catch (err) {
      console.error('Project deletion failed:', err);
      setError(err.message || 'Failed to delete project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Add New Project';
      case 'edit': return 'Edit Project';
      case 'delete': return 'Delete Project';
      default: return 'Project Details';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'add': return 'add';
      case 'edit': return 'edit';
      case 'delete': return 'trash';
      default: return 'info';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="project-modal-overlay" onClick={onClose}>
        <div 
          className={`project-modal ${mode === 'delete' ? 'project-modal--danger' : ''}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="project-modal__header">
            <div className="project-modal__title-section">
              <Icon name={getModalIcon()} className="project-modal__icon" />
              <h2 className="project-modal__title">{getModalTitle()}</h2>
            </div>
            
            <button 
              className="project-modal__close"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close modal"
            >
              <Icon name="close" />
            </button>
          </div>

          {/* Content */}
          <div className="project-modal__content">
            {mode === 'delete' ? (
              // Delete confirmation
              <div className="project-modal__delete-content">
                <div className="project-modal__delete-warning">
                  <Icon name="warning" className="project-modal__warning-icon" />
                  <p>
                    Are you sure you want to delete <strong>"{project?.title}"</strong>?
                  </p>
                  <p className="project-modal__delete-note">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            ) : (
              // Form for add/edit/view
              <form className="project-modal__form" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">
                    Project Title <span className="form-required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.title ? 'form-input--error' : ''}`}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="My Awesome Project"
                    disabled={mode === 'view' || isLoading}
                    maxLength={255}
                  />
                  {validationErrors.title && (
                    <span className="form-error">{validationErrors.title}</span>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-textarea ${validationErrors.description ? 'form-input--error' : ''}`}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project..."
                    disabled={mode === 'view' || isLoading}
                    rows={4}
                  />
                  {validationErrors.description && (
                    <span className="form-error">{validationErrors.description}</span>
                  )}
                </div>

                {/* Row 1: Status and Category */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={mode === 'view' || isLoading}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={mode === 'view' || isLoading}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Year */}
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className={`form-input ${validationErrors.year ? 'form-input--error' : ''}`}
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    min={1900}
                    max={new Date().getFullYear() + 10}
                    disabled={mode === 'view' || isLoading}
                  />
                  {validationErrors.year && (
                    <span className="form-error">{validationErrors.year}</span>
                  )}
                </div>

                {/* URLs */}
                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input
                    type="url"
                    className={`form-input ${validationErrors.link ? 'form-input--error' : ''}`}
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://myproject.com"
                    disabled={mode === 'view' || isLoading}
                  />
                  {validationErrors.link && (
                    <span className="form-error">{validationErrors.link}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Repository</label>
                  <input
                    type="url"
                    className={`form-input ${validationErrors.github ? 'form-input--error' : ''}`}
                    value={formData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    placeholder="https://github.com/username/repo"
                    disabled={mode === 'view' || isLoading}
                  />
                  {validationErrors.github && (
                    <span className="form-error">{validationErrors.github}</span>
                  )}
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <ImageUpload
                    onImageUpload={(url) => handleInputChange('preview_image_url', url)}
                    currentImageUrl={formData.preview_image_url}
                    disabled={mode === 'view' || isLoading}
                  />
                  {validationErrors.preview_image_url && (
                    <span className="form-error">{validationErrors.preview_image_url}</span>
                  )}
                </div>

                {/* Manual URL Input (Alternative) */}
                <div className="form-group">
                  <label className="form-label">
                    Or enter image URL manually
                    <span className="form-optional">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    className={`form-input ${validationErrors.preview_image_url ? 'form-input--error' : ''}`}
                    value={formData.preview_image_url}
                    onChange={(e) => handleInputChange('preview_image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={mode === 'view' || isLoading}
                  />
                </div>

                {/* Checkboxes */}
                <div className="form-group">
                  <div className="form-checkboxes">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        disabled={mode === 'view' || isLoading}
                      />
                      <span className="form-checkbox__mark"></span>
                      <span className="form-checkbox__label">Featured Project</span>
                    </label>
                    
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.private}
                        onChange={(e) => handleInputChange('private', e.target.checked)}
                        disabled={mode === 'view' || isLoading}
                      />
                      <span className="form-checkbox__mark"></span>
                      <span className="form-checkbox__label">Private Project</span>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <div 
                className="project-modal__error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon name="warning" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="project-modal__footer">
            {mode === 'view' ? (
              // View mode - just close button
              <Button
                variant="secondary"
                onClick={onClose}
                icon={<Icon name="close" />}
              >
                Close
              </Button>
            ) : mode === 'delete' ? (
              // Delete mode - cancel and delete buttons
              <>
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={isLoading}
                  icon={<Icon name="trash" />}
                >
                  Delete Project
                </Button>
              </>
            ) : (
              // Add/Edit mode - cancel and save buttons
              <>
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={!formData.title.trim()}
                  icon={<Icon name={mode === 'add' ? 'add' : 'save'} />}
                >
                  {mode === 'add' ? 'Add Project' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal; 