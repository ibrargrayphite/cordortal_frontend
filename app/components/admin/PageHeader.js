"use client";

import React from 'react';

const StatPill = ({ label, value, variant = 'default' }) => {
  const variantClasses = {
    default: 'admin-badge',
    success: 'admin-badge admin-badge-success',
    warning: 'admin-badge admin-badge-warning',
    error: 'admin-badge admin-badge-error',
    info: 'admin-badge admin-badge-info'
  };

  return (
    <div className={variantClasses[variant]}>
      <span style={{ fontWeight: 600 }}>{label}:</span>
      <span style={{ marginLeft: '0.25rem' }}>{value}</span>
    </div>
  );
};

const PageHeader = ({ 
  title, 
  description, 
  actions = [], 
  stats = [],
  breadcrumbItems = [] 
}) => {
  return (
    <div className="admin-page-header">
      <div className="admin-container">
        {/* Main title and description */}
        <div style={{ marginBottom: stats.length > 0 ? '1rem' : 0 }}>
          <h1 className="admin-page-title">{title}</h1>
          {description && (
            <p className="admin-page-description">{description}</p>
          )}
        </div>

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem', 
            marginBottom: '1rem' 
          }}>
            {stats.map((stat, index) => (
              <StatPill
                key={index}
                label={stat.label}
                value={stat.value}
                variant={stat.variant}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem',
            justifyContent: 'flex-end'
          }}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`admin-button ${action.variant === 'secondary' ? 'admin-button-secondary' : 'admin-button-primary'}`}
              >
                {action.icon && (
                  <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
export { StatPill };