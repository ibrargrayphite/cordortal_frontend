"use client";

import React, { useState, useRef, useEffect } from 'react';

const ActionMenu = ({ 
  actions = [], 
  trigger = '⋯',
  align = 'right' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleActionClick = (action) => {
    if (!action.disabled && action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="admin-button admin-button-ghost"
        style={{ 
          width: '32px', 
          height: '32px', 
          padding: 0,
          fontSize: '1.2rem'
        }}
        aria-label="Actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            [align]: 0,
            marginTop: '0.25rem',
            minWidth: '160px',
            backgroundColor: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--admin-radius)',
            boxShadow: 'var(--admin-shadow-lg)',
            zIndex: 50,
            padding: '0.25rem'
          }}
          role="menu"
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled || action.loading}
              className="admin-button admin-button-ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: action.variant === 'destructive' ? '#dc2626' : 'inherit',
                opacity: action.disabled ? 0.5 : 1
              }}
              role="menuitem"
            >
              {action.loading ? (
                <>
                  <div className="admin-spinner" style={{ marginRight: '0.5rem', width: '16px', height: '16px' }} />
                  {action.loadingText || action.label}
                </>
              ) : (
                <>
                  {action.icon && (
                    <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
                  )}
                  {action.label}
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;