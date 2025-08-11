import React, { useState, useRef } from 'react';
import { uploadImage } from '../../../utils/supabase';
import { useAuth } from '../../../hooks/useAuth.jsx';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, currentImageUrl = '', disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef(null);
  const { isOwner } = useAuth();

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP, or GIF)';
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  const handleFileUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isOwner) {
      setError('Only the owner can upload images');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImage(file);
      
      // Clean up preview URL
      URL.revokeObjectURL(localPreviewUrl);
      
      // Set final URL
      setPreviewUrl(cloudinaryUrl);
      
      // Notify parent component
      if (onImageUpload) {
        onImageUpload(cloudinaryUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
      setPreviewUrl(currentImageUrl); // Reset to original
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setError('');
    if (onImageUpload) {
      onImageUpload('');
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (!disabled && isOwner) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-upload">
      <label className="image-upload__label">
        Preview Image
        <span className="image-upload__optional">(Optional)</span>
      </label>

      {/* Preview Area */}
      {previewUrl ? (
        <div className="image-upload__preview">
          <img
            src={previewUrl}
            alt="Project preview"
            className="image-upload__preview-image"
            onError={() => {
              setPreviewUrl('');
              setError('Failed to load image');
            }}
          />
          <div className="image-upload__preview-overlay">
            <div className="image-upload__preview-actions">
              {!disabled && isOwner && (
                <>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleBrowseClick}
                    icon={<Icon name="edit" />}
                  >
                    Change
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={handleRemoveImage}
                    icon={<Icon name="trash" />}
                  >
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          className={`image-upload__dropzone ${dragOver ? 'dragover' : ''} ${disabled ? 'disabled' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
        >
          {uploading ? (
            <div className="image-upload__uploading">
              <Icon name="loading" className="upload-spinner" />
              <span>Uploading image...</span>
            </div>
          ) : (
            <div className="image-upload__content">
              <Icon name="image" className="image-upload__icon" />
              <div className="image-upload__text">
                <p className="image-upload__primary">
                  {disabled ? 'Image upload disabled' : 'Drop image here or click to browse'}
                </p>
                <p className="image-upload__secondary">
                  Supports JPEG, PNG, WebP, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="image-upload__input"
        disabled={disabled || uploading}
      />

      {/* Error Message */}
      {error && (
        <div className="image-upload__error">
          <Icon name="warning" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Progress Info */}
      {uploading && (
        <div className="image-upload__info">
          <Icon name="cloud" />
          <span>Uploading to Cloudinary...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 