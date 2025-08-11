import React, { useState } from 'react';
import Icon from '../../atoms/Icon/Icon';
import './ProjectList.css';

const ProjectList = ({ 
  projects, 
  onProjectClick, 
  onGithubClick, 
  onPreviewClick,
  canEdit = true 
}) => {
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <div className="status-dot completed" title="Completed"></div>;
      case 'In Progress':
        return <div className="status-dot in-progress" title="In Progress"></div>;
      case 'Not Started':
      default:
        return <div className="status-dot not-started" title="Not Started"></div>;
    }
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className={`sortable-header ${sortField === field ? 'sorted' : ''}`}
      onClick={() => handleSort(field)}
    >
      <div className="header-content">
        {children}
        <Icon 
          name={sortField === field && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
          size="0.8rem"
          className={`sort-icon ${sortField === field ? 'active' : ''}`}
        />
      </div>
    </th>
  );

  return (
    <div className="project-list">
      <table className="projects-table">
        <thead>
          <tr>
            <th className="status-column">Status</th>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="description">Description</SortableHeader>
            <SortableHeader field="category">Category</SortableHeader>
            <SortableHeader field="year">Year</SortableHeader>
            <th className="actions-column">Actions</th>
            <th className="featured-column">Featured</th>
            <th className="private-column">Private</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((project) => (
            <tr 
              key={project.id} 
              className={`project-row ${!canEdit && project.private ? 'disabled' : ''}`}
              onClick={() => canEdit && onProjectClick(project)}
            >
              <td className="status-cell">
                {getStatusIcon(project.status)}
              </td>
              <td className="title-cell">
                <span className="project-title">{project.title}</span>
              </td>
              <td className="description-cell">
                <span className="project-description">{project.description}</span>
              </td>
              <td className="category-cell">
                <span className="project-category">{project.category}</span>
              </td>
              <td className="year-cell">
                <span className="project-year">{project.year}</span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  {project.github && (
                    <button
                      className="action-btn github-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGithubClick(project.github);
                      }}
                      title="View on GitHub"
                    >
                      <Icon name="github" size="1rem" />
                    </button>
                  )}
                  {project.link && (
                    <button
                      className="action-btn preview-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewClick(project.link);
                      }}
                      title="Open Live Demo"
                    >
                      <Icon name="linkExternal" size="1rem" />
                    </button>
                  )}
                </div>
              </td>
              <td className="featured-cell">
                {project.featured && (
                  <Icon name="StarFull" size="1rem" className="featured-icon" title="Featured Project" />
                )}
              </td>
              <td className="private-cell">
                {project.private && (
                  <Icon name="Lock" size="1rem" className="private-icon" title="Private Project" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedProjects.length === 0 && (
        <div className="empty-state">
          <Icon name="Folder" size="3rem" />
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList; 