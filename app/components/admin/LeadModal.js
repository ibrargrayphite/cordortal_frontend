"use client";

import React, { useEffect } from 'react';
import { X } from "lucide-react";

const LeadModal = ({
  isOpen,
  onClose,
  onSave,
  mode = 'add', // 'add' or 'edit'
  formData,
  onFormChange,
  saving = false
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saving) {
      onSave();
    }
  };

  const handleInputChange = (field) => (e) => {
    onFormChange(field, e.target.value);
  };

  const isFormValid = formData.email?.trim() && (formData.first_name?.trim() || formData.last_name?.trim());

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
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="admin-card"
        style={{
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {mode === 'edit' ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="admin-button admin-button-ghost"
            style={{ width: '32px', height: '32px', padding: 0 }}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Top Row: Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={handleInputChange('first_name')}
                  className="admin-input"
                  placeholder="Enter first name"
                  disabled={saving}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={handleInputChange('last_name')}
                  className="admin-input"
                  placeholder="Enter last name"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Second Row: Email and Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange('email')}
                  className="admin-input"
                  placeholder="Enter email address"
                  required
                  disabled={saving}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleInputChange('phone')}
                  className="admin-input"
                  placeholder="Enter phone number"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Third Row: Source */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}>
                Source
              </label>
              <select
                value={formData.source || ''}
                onChange={handleInputChange('source')}
                className="admin-input"
                disabled={saving}
              >
                <option value="">Select source</option>
                <option value="WEBSITE">Website</option>
                <option value="GMAIL">Gmail</option>

              </select>
            </div>

            {/* Fourth Row: Message */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.5rem'
              }}>
                Message
              </label>
              <textarea
                value={formData.message || ''}
                onChange={handleInputChange('message')}
                className="admin-input"
                placeholder="Enter message or notes"
                rows={4}
                disabled={saving}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="admin-button admin-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isFormValid}
              className="admin-button admin-button-primary"
            >
              {saving ? (
                <>
                  <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                mode === 'edit' ? 'Update Lead' : 'Create Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;