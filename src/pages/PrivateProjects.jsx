import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth.jsx';
import { LANGUAGE_CONTENT } from '../constants/language';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';
import ProjectModal from '../components/organisms/ProjectModal/ProjectModal.jsx';
import ViewToggle from '../components/molecules/ViewToggle/ViewToggle.jsx';
import ProjectList from '../components/organisms/ProjectList/ProjectList.jsx';
import './ProjectsPage.css';

const PrivateProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid'); // 'grid' or 'list'
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view',
    project: null
  });

  const { isOwner, isAuthenticated } = useAuth();

  // Load private projects only
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectsAPI.getPrivate(); // Only private projects
      setProjects(data);
    } catch (err) {
      console.error('Failed to load private projects:', err);
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
    if (!isOwner) return; // Guests can't interact with private projects
    
    setModalState({
      isOpen: true,
      mode: 'edit',
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
    if (!isOwner) return; // Guests can't access private project links
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGitHubClick = (url, e) => {
    e.stopPropagation();
    if (!isOwner) return; // Guests can't access private project links
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
            Private Projects
          </motion.h1>
          <motion.p 
            className="projects-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {isOwner 
              ? "Manage your private and confidential projects"
              : "Private projects are only accessible to the owner"
            }
          </motion.p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-content">
        {/* Controls Section - Search on LEFT, Add button on RIGHT */}
        <motion.div 
          className="projects-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Search Bar - Now on the LEFT side */}
          <div className="projects-controls__search">
            <div className="projects-search">
              <div className="search-container">
                <Icon name="search" className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search private projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!isOwner}
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
          <div className="projects-controls__actions">
            {/* View Toggle */}
            <ViewToggle 
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            
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
        {searchTerm && isOwner && (
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

        {/* Access Denied for Guests */}
        {!isOwner && (
          <motion.div 
            className="access-denied"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name="lock" className="access-denied-icon" />
            <h3>Private Content</h3>
            <p>
              These projects are marked as private and can only be accessed by the owner.
              Login as the owner to view and manage private projects.
            </p>
          </motion.div>
        )}

        {/* Loading State - Owner Only */}
        {loading && isOwner && (
          <motion.div 
            className="projects-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="loading" className="loading-icon" />
            <span>Loading private projects...</span>
          </motion.div>
        )}

        {/* Error State - Owner Only */}
        {error && isOwner && (
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

        {/* No Results - Owner Only */}
        {!loading && !error && filteredProjects.length === 0 && isOwner && (
          <motion.div 
            className="no-projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name="lock" className="empty-icon" />
            <h3>No Private Projects Found</h3>
            <p>
              {searchTerm 
                ? `No private projects match "${searchTerm}". Try a different search term.`
                : "No private projects have been created yet. Create your first private project!"
              }
            </p>
          </motion.div>
        )}

        {/* Projects Display - Grid or List View - Owner Only */}
        {!loading && !error && filteredProjects.length > 0 && isOwner && (
          <motion.div 
            className="projects-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {currentView === 'grid' ? (
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`project-card ${project.featured ? 'featured' : ''} private`}
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

                      {/* Fallback placeholder for failed images */}
                      <div className="project-placeholder" style={{ display: 'none' }}>
                        <Icon name="folder" />
                      </div>

                      {/* Featured Icon - Top LEFT corner */}
                      {project.featured && (
                        <div className="featured-badge">
                          <Icon name="StarFull" />
                        </div>
                      )}

                      {/* GitHub Icon - Top RIGHT corner (moved from action buttons) */}
                      {project.github && (
                        <div className="github-badge">
                          <Icon name="Github" />
                        </div>
                      )}

                      {/* Preview/Link button on image click */}
                      {project.link && (
                        <div className="preview-overlay">
                          <Icon name="LinkExternal" className="preview-icon" />
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="project-content">
                      <div className="project-header">
                        <h3 className="project-title">{project.title}</h3>
                        
                        {/* Action Buttons */}
                        <div className="project-actions">
                          {project.private && (
                            <button
                              className="action-btn private-btn"
                              title="Private Project"
                            >
                              <Icon name="Lock" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="project-description">{project.description}</p>
                      
                      {/* Project Meta Tags */}
                      <div className="project-meta">
                        <div className="meta-tags">
                          {project.category && (
                            <span className="project-tag tag-category">{project.category}</span>
                          )}
                          {project.year && (
                            <span className="project-tag tag-year">{project.year}</span>
                          )}
                          {project.status && (
                            <span className={`project-tag tag-status ${project.status}`}>
                              {project.status.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <ProjectList
                projects={filteredProjects}
                onProjectClick={handleProjectClick}
                onGithubClick={(url) => handleGitHubClick(url, null)}
                onPreviewClick={(url) => handleLiveClick(url, null)}
                canEdit={isOwner}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Project Modal - Owner Only */}
      {isOwner && (
        <ProjectModal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          project={modalState.project}
          mode={modalState.mode}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default PrivateProjects; 