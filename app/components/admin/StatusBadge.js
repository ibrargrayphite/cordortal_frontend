"use client";

import React from 'react';

const StatusBadge = ({ 
  variant = 'default', 
  children, 
  count,
  showZero = true 
}) => {
  // If count is provided and it's 0, show muted style unless showZero is false
  if (typeof count === 'number') {
    if (count === 0 && !showZero) {
      return null;
    }
    
    const displayVariant = count === 0 ? 'muted' : variant;
    
    const variantClasses = {
      default: 'admin-badge',
      success: 'admin-badge admin-badge-success',
      warning: 'admin-badge admin-badge-warning',
      error: 'admin-badge admin-badge-error',
      info: 'admin-badge admin-badge-info',
      muted: 'admin-badge',
      source: 'admin-badge admin-badge-info',
      notes: 'admin-badge admin-badge-success',
      consent: 'admin-badge admin-badge-warning'
    };

    return (
      <span 
        className={variantClasses[displayVariant]} 
        style={count === 0 ? { opacity: 0.6 } : {}}
      >
        {count}
      </span>
    );
  }

  // Regular badge with custom content
  const variantClasses = {
    default: 'admin-badge',
    success: 'admin-badge admin-badge-success',
    warning: 'admin-badge admin-badge-warning',
    error: 'admin-badge admin-badge-error',
    info: 'admin-badge admin-badge-info',
    muted: 'admin-badge',
    source: 'admin-badge admin-badge-info',
    notes: 'admin-badge admin-badge-success',
    consent: 'admin-badge admin-badge-warning'
  };

  return (
    <span className={variantClasses[variant]}>
      {children}
    </span>
  );
};

export default StatusBadge;