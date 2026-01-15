"use client";

import React, { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';

// Component for badges with hover functionality (Notes and Consent Forms)
const HoverableBadge = ({ variant, count, children, getBadgeStyles, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showIcon = variant === 'notes' || variant === 'consent';
  
  return (
    <span 
      style={{
        ...getBadgeStyles(variant),
        cursor: showIcon ? 'pointer' : 'default',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click
        if (showIcon && onClick) {
          onClick();
        }
      }}
    >
      {/* {showIcon && <FileText size={14} style={{ flexShrink: 0 }} />} */}
      {count !== undefined ? count : children}
      {showIcon && isHovered && (
        <ExternalLink 
          size={12} 
          style={{ 
            flexShrink: 0, 
            marginLeft: '0.25rem',
            opacity: 0.8,
            animation: 'fadeInScale 0.2s ease-out',
          }} 
        />
      )}
    </span>
  );
};

const StatusBadge = ({ 
  variant = 'default', 
  children, 
  count,
  showZero = true,
  onClick,
  leadId
}) => {
  
  // Helper function to get badge styles with backend colors matching the design
  const getBadgeStyles = (variantType) => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '9999px', // Fully rounded pill shape
      transition: 'all 0.2s ease',
      border: 'none',
      whiteSpace: 'nowrap',
    };

    switch (variantType) {
      case 'source':
        return {
          ...baseStyle,
          backgroundColor: '#dbeafe', // Light blue solid background matching image
          color: 'var(--admin-primary, var(--main-accent-color))', // Admin color first, then website
        };
      case 'notes':
        return {
          ...baseStyle,
          backgroundColor: '#dcfce7', // Light green solid background matching image
          color: 'var(--admin-primary, var(--subheadline-color))', // Admin color first, then website
        };
      case 'consent':
        return {
          ...baseStyle,
          backgroundColor: '#fef3c7', // Light yellow/orange solid background matching image
          color: 'var(--admin-primary, var(--headline-color)', // Admin color first, then website
        };
      default:
        return baseStyle;
    }
  };

  // If count is provided and it's 0, show muted style unless showZero is false
  if (typeof count === 'number') {
    if (count === 0 && !showZero) {
      return null;
    }
    
    const displayVariant = count === 0 ? 'muted' : variant;
    
    // Use enhanced styles for source, notes, consent variants with icons
    if (['source', 'notes', 'consent'].includes(displayVariant) && count > 0) {
      return (
        <HoverableBadge 
          variant={displayVariant}
          count={count}
          getBadgeStyles={getBadgeStyles}
          onClick={onClick}
        />
      );
    }

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

  // Regular badge with custom content - use enhanced styles for source, notes, consent
  if (['source', 'notes', 'consent'].includes(variant)) {
    return (
      <HoverableBadge 
        variant={variant}
        children={children}
        getBadgeStyles={getBadgeStyles}
        onClick={onClick}
      />
    );
  }

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