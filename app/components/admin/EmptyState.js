"use client";

import React from 'react';

const EmptyState = ({
  icon = '📄',
  title = 'No data found',
  description = 'There are no items to display.',
  action = null
}) => {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-state-icon" style={{ fontSize: '3rem' }}>
        {icon}
      </div>
      <h3 className="admin-empty-state-title">
        {title}
      </h3>
      <p className="admin-empty-state-description">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className={`admin-button ${action.variant === 'secondary' ? 'admin-button-secondary' : 'admin-button-primary'}`}
        >
          {action.icon && (
            <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
          )}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;