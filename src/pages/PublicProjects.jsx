import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth.jsx';
import { LANGUAGE_CONTENT } from '../constants/language';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';
import ProjectModal from '../components/organisms/ProjectModal/ProjectModal.jsx';
import './ProjectsPage.css';

const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view',
    project: null
  });

  const { isOwner } = useAuth();

  // Load public projects only
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectsAPI.getPublic(); // Only public projects
      setProjects(data);
    } catch (err) {
      console.error('Failed to load public projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.category?.toLowerCase().includes(searchLower) ||
      project.status?.toLowerCase().includes(searchLower) ||
      project.year?.toString().includes(searchLower)
    );
  });

  const handleProjectClick = (project) => {
    setModalState({
      isOpen: true,
      mode: isOwner ? 'edit' : 'view',
      project
    });
  };

  const handleAddProject = () => {
    if (!isOwner) return;
    
    setModalState({
      isOpen: true,
      mode: 'add',
      project: null
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: 'view',
      project: null
    });
  };

  const handleModalSuccess = async (result, mode) => {
    // Refresh projects list
    await loadProjects();
    
    if (mode === 'add') {
      console.log('Project added successfully:', result);
    } else if (mode === 'edit') {
      console.log('Project updated successfully:', result);
    } else if (mode === 'delete') {
      console.log('Project deleted successfully:', result);
    }
  };

  const handleLiveClick = (url, e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGitHubClick = (url, e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'completed';
      case 'in progress': return 'in-progress';
      case 'not started': return 'not-started';
      default: return 'not-started';
    }
  };

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="projects-header">
        <div className="projects-header-content">
          <motion.h1 
            className="projects-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Public Projects
          </motion.h1>
          <motion.p 
            className="projects-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore publicly available projects and innovations
          </motion.p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-content">
        {/* Controls Section */}
        <motion.div 
          className="projects-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Add Project Button */}
          <div className="projects-controls__actions">
            <Button
              variant="primary"
              onClick={handleAddProject}
              icon={<Icon name="add" />}
              className="add-project-btn"
              disabled={!isOwner}
              title={!isOwner ? "Only the owner can add projects" : "Add new project"}
            >
              Add New Project
            </Button>
          </div>

          {/* Search Bar */}
          <div className="projects-search">
            <div className="search-container">
              <Icon name="search" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search public projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <Icon name="close" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search Results Info */}
        {searchTerm && (
          <motion.div 
            className="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="results-text">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </span>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="projects-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="loading" className="loading-icon" />
            <span>Loading public projects...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="projects-error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="warning" />
            <span>{error}</span>
            <Button variant="secondary" onClick={loadProjects}>
              Try Again
            </Button>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProjects.length === 0 && (
          <motion.div 
            className="no-projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name="folder" className="empty-icon" />
            <h3>No Public Projects Found</h3>
            <p>
              {searchTerm 
                ? `No public projects match "${searchTerm}". Try a different search term.`
                : "No public projects have been created yet."
              }
            </p>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.div 
            className="projects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${project.featured ? 'featured' : ''}`}
                onClick={() => handleProjectClick(project)}
              >
                {/* Project Image/Preview */}
                <div
                  className="project-image"
                  onClick={(e) => handleLiveClick(project.link, e)}
                  title="View Live Demo"
                >
                  {project.preview_image_url ? (
                    <img 
                      src={project.preview_image_url} 
                      alt={project.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="project-placeholder">
                      <Icon name="folder" />
                    </div>
                  )}

                  {/* Featured Badge - Top Left */}
                  {project.featured && (
                    <div className="featured-badge" title="Featured Project">
                      ⭐
                    </div>
                  )}

                  {/* GitHub Button - Top Right */}
                  {project.github && (
                    <button
                      className="github-btn"
                      onClick={(e) => handleGitHubClick(project.github, e)}
                      title="View Source Code"
                    >
                      <Icon name="github" />
                    </button>
                  )}

                  {/* Click hint overlay */}
                  <div className="click-hint">
                    <Icon name="linkExternal" />
                    <span>View Live Demo</span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-name">{project.title}</h3>
                  </div>

                  <p className="project-description">
                    {project.description || 'No description available.'}
                  </p>

                  {/* Project Tags */}
                  <div className="project-tags">
                    {project.year && (
                      <span className="project-tag tag-year">
                        {project.year}
                      </span>
                    )}
                    {project.category && (
                      <span className="project-tag tag-category">
                        {project.category}
                      </span>
                    )}
                    {project.status && (
                      <span className={`project-tag tag-status ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="project-glow" />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        project={modalState.project}
        mode={modalState.mode}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default PublicProjects; 