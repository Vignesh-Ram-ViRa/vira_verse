import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../atoms/Icon';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import './ProfileDropdown.css';

const ProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const content = LANGUAGE_CONTENT;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAbout = () => {
    setIsOpen(false);
    navigate('/about');
  };

  const handleLogout = () => {
    setIsOpen(false);
    // TODO: Implement actual logout logic
    console.log('Logout clicked');
  };

  return (
    <div className={`profile-dropdown ${className}`} ref={dropdownRef}>
      <button
        className="profile-dropdown__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Profile menu"
      >
        <Icon name="account" size="medium" />
      </button>

      {isOpen && (
        <div className="profile-dropdown__menu">
          <div className="profile-dropdown__arrow" />
          
          <button
            className="profile-dropdown__item"
            onClick={handleAbout}
          >
            <Icon name="info" size="small" />
            <span>About</span>
          </button>
          
          <div className="profile-dropdown__divider" />
          
          <button
            className="profile-dropdown__item profile-dropdown__item--danger"
            onClick={handleLogout}
          >
            <Icon name="signOut" size="small" />
            <span>{content.auth.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 