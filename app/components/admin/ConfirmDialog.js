"use client";

import React, { useEffect } from 'react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive', // 'destructive' or 'primary'
  loading = false
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
      }}
      onClick={handleCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="admin-card"
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '1.5rem'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            marginBottom: '0.5rem',
            color: variant === 'destructive' ? '#dc2626' : 'inherit'
          }}>
            {title}
          </h3>
          <p style={{ 
            color: 'var(--admin-muted-foreground)',
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="admin-button admin-button-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`admin-button ${variant === 'destructive' ? 'admin-button-primary' : 'admin-button-primary'}`}
            style={variant === 'destructive' ? { 
              backgroundColor: '#dc2626',
              borderColor: '#dc2626'
            } : {}}
          >
            {loading ? (
              <>
                <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;