import React from 'react';
import Icon from '../../atoms/Icon/Icon';
import './ViewToggle.css';

const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${currentView === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange('grid')}
        title="Grid View"
      >
        <Icon name="LayoutPanelJustify" size="1.2rem" />
      </button>
      <button
        className={`view-toggle-btn ${currentView === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange('list')}
        title="List View"
      >
        <Icon name="ListSelection" size="1.2rem" />
      </button>
    </div>
  );
};

export default ViewToggle; 