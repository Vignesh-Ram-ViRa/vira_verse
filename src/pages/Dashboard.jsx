import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth.jsx';
import { LANGUAGE_CONTENT } from '../constants/language';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';
import ProjectModal from '../components/organisms/ProjectModal/ProjectModal.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view', 'add', 'edit', 'delete'
    project: null
  });

  const { isOwner } = useAuth();

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const allProjects = await projectsAPI.getAll();
      setProjects(allProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.category?.toLowerCase().includes(searchLower) ||
      project.year?.toString().includes(searchLower)
    );
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleGitHubClick = (githubUrl, e) => {
    e.stopPropagation();
    if (githubUrl) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLiveClick = (liveUrl, e) => {
    e.stopPropagation();
    if (liveUrl) {
      window.open(liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
    
    // Show success message (optional)
    if (mode === 'add') {
      console.log('Project added successfully:', result);
    } else if (mode === 'edit') {
      console.log('Project updated successfully:', result);
    } else if (mode === 'delete') {
      console.log('Project deleted successfully:', result);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'In Progress':
        return 'in-progress';
      case 'Not Started':
        return 'not-started';
      default:
        return 'default';
    }
  };

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <motion.div 
        className="dashboard-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {LANGUAGE_CONTENT.dashboard.welcome}
          </motion.h1>
          <motion.p 
            className="hero-description"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            {LANGUAGE_CONTENT.dashboard.description}
          </motion.p>
        </div>
        
        {/* 3D Background Elements */}
        <div className="hero-bg-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <div className="dashboard-projects">

                  {/* Controls Section - Search on LEFT, Add button on RIGHT */}
          <motion.div 
            className="dashboard-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Search Bar - Now on the LEFT side */}
            <div className="dashboard-controls__search">
              <div className="projects-search">
                <div className="search-container">
                  <Icon name="search" className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={LANGUAGE_CONTENT.projects.searchPlaceholder}
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
            </div>

            {/* Add Project Button - Round glowing gradient button (RIGHT side) */}
            <div className="dashboard-controls__actions">
              <button
                className="add-project-btn"
                onClick={handleAddProject}
                disabled={!isOwner}
                title={!isOwner ? "Only the owner can add projects" : "Add new project"}
              >
                <Icon name="add" />
              </button>
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
          <div className="loading-state">
            <Icon name="loading" className="loading-icon" />
            <span>Loading projects...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <Icon name="warning" />
            <span>{error}</span>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div 
            className="projects-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="projects-grid">
              {filteredProjects.length === 0 && searchTerm ? (
                <motion.div 
                  className="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon name="search" size={48} />
                  <h3>No projects found</h3>
                  <p>Try adjusting your search terms or clearing the search to see all projects.</p>
                  <button 
                    className="clear-search-btn-large"
                    onClick={() => setSearchTerm('')}
                  >
                    <Icon name="close" />
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className={`project-card ${project.featured ? 'featured' : ''} ${project.private ? 'private' : ''}`}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Project Image/Preview */}
                    <div className="project-image">
                      {project.preview_image_url ? (
                        <img 
                          src={project.preview_image_url}
                          alt={project.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          <Icon name="file-code" size={48} />
                          <span>Project Preview</span>
                        </div>
                      )}
                      
                      <div className="image-fallback" style={{ display: 'none' }}>
                        <Icon name="file-code" size={48} />
                        <span>Project Preview</span>
                      </div>
                      
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

                      {/* Private Badge */}
                      {project.private && (
                        <div className="private-badge" title="Private Project">
                          <Icon name="lock" />
                        </div>
                      )}

                      {/* Click hint overlay */}
                      {project.link && (
                        <div 
                          className="click-hint"
                          onClick={(e) => handleLiveClick(project.link, e)}
                        >
                          <Icon name="link-external" />
                          <span>View Live Demo</span>
                        </div>
                      )}
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
                  </motion.div>
                ))
              )}
            </div>
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

export default Dashboard; 