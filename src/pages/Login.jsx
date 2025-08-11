import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';
import { LANGUAGE_CONTENT } from '../constants/language';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);

  const { signIn, signUp, signInWithMagicLink, enterGuest, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (useMagicLink) {
        await signInWithMagicLink(email);
        setSuccess('Magic link sent! Check your email to complete the login.');
      } else if (isRegisterMode) {
        await signUp(email, password, { display_name: email.split('@')[0] });
        setSuccess('Account created! Check your email to verify your account.');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    try {
      enterGuest();
      navigate('/');
    } catch (err) {
      console.error('Guest mode error:', err);
      setError('Failed to enter guest mode. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    setUseMagicLink(false);
  };

  const toggleMagicLink = () => {
    setUseMagicLink(!useMagicLink);
    setError('');
    setSuccess('');
  };

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-loading">
          <Icon name="loading" className="loading-icon" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1 
            className="login-title"
          >
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p 
            className="login-subtitle"
          >
            {isRegisterMode 
              ? 'Join Vira Verse to manage your projects' 
              : 'Sign in to access your project dashboard'
            }
          </p>
        </div>

        {/* Guest Mode Button */}
        <div 
          className="guest-mode-section"
        >
          <Button
            variant="secondary"
            onClick={handleGuestMode}
            icon={<Icon name="organization" />}
            className="guest-mode-btn"
          >
            Continue as Guest
          </Button>
          <p className="guest-mode-note">
            Browse public projects without creating an account
          </p>
        </div>

        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Auth Form */}
        <form 
          className="login-form"
          onSubmit={handleSubmit}
        >
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="form-input-wrapper">
              <Icon name="mail" className="form-input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field (hidden for magic link) */}
          {!useMagicLink && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="form-input-wrapper">
                <Icon name="lock" className="form-input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  disabled={isLoading}
                  minLength={isRegisterMode ? 6 : undefined}
                />
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div 
              className="form-message form-message--error"
            >
              <Icon name="warning" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div 
              className="form-message form-message--success"
            >
              <Icon name="check" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!email || (!useMagicLink && !password)}
            className="login-submit-btn"
            icon={useMagicLink ? <Icon name="mail" /> : <Icon name="signIn" />}
          >
            {useMagicLink 
              ? 'Send Magic Link' 
              : isRegisterMode 
                ? 'Create Account' 
                : 'Sign In'
            }
          </Button>

          {/* Magic Link Toggle */}
          {!isRegisterMode && (
            <button
              type="button"
              className="form-link"
              onClick={toggleMagicLink}
              disabled={isLoading}
            >
              {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
            </button>
          )}
        </form>

        {/* Mode Toggle */}
        <div 
          className="login-footer"
        >
          <p>
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="form-link form-link--primary"
              onClick={toggleMode}
              disabled={isLoading}
            >
              {isRegisterMode ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>

        {/* Background Elements */}
        <div className="login-bg-elements">
          <div className="login-bg-element login-bg-element-1"></div>
          <div className="login-bg-element login-bg-element-2"></div>
          <div className="login-bg-element login-bg-element-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login; 