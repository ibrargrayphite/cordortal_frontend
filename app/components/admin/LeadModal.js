"use client";

import React, { useEffect } from 'react';
import { X, User, Mail, Phone, MessageSquare, Plus } from "lucide-react";

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
        padding: '1rem',
        scrollbarWidth: 'none',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--admin-card, var(--admin-background, #ffffff))',
          borderRadius: 'var(--admin-radius, 0.75rem)',
          boxShadow: 'var(--admin-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
          padding: '1.5rem',
          border: '1px solid var(--admin-border, #e2e8f0)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--admin-border, var(--border))',
          backgroundColor: 'color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 15%, transparent)',
          margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
          padding: '1.5rem',
          borderRadius: 'var(--admin-radius, 0.75rem) 0.75rem 0 0'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800,
              color: 'var(--admin-foreground, var(--headline-color))',
            }}>
              {mode === 'edit' ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--admin-muted-foreground, var(--subheadline-color))',
              margin: 0
            }}>
              Fill in the lead information below.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--admin-foreground, var(--headline-color))',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
              opacity: saving ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = 'var(--admin-muted, #f8fafc)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--admin-foreground, var(--headline-color))'
                }}>
                  <User size={16} style={{ color: 'var(--admin-foreground, var(--headline-color))', opacity: 0.7 }} />
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={handleInputChange('first_name')}
                  placeholder="Enter first name"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, #f8fafc)' : 'var(--admin-background, #ffffff)',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--admin-foreground, var(--headline-color))'
                }}>
                  <User size={16} style={{ color: 'var(--admin-foreground, var(--headline-color))', opacity: 0.7 }} />
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={handleInputChange('last_name')}
                  placeholder="Enter last name"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, #f8fafc)' : 'var(--admin-background, #ffffff)',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Second Row: Email and Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--admin-foreground, var(--headline-color))'
                }}>
                  <Mail size={16} style={{ color: 'var(--admin-foreground, var(--headline-color))', opacity: 0.7 }} />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange('email')}
                  placeholder="Enter email address"
                  required
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, #f8fafc)' : 'var(--admin-background, #ffffff)',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--admin-foreground, var(--headline-color))'
                }}>
                  <Phone size={16} style={{ color: 'var(--admin-foreground, var(--headline-color))', opacity: 0.7 }} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleInputChange('phone')}
                  placeholder="Enter phone number"
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, #f8fafc)' : 'var(--admin-background, #ffffff)',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Third Row: Source */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'var(--admin-foreground, var(--headline-color))'
              }}>
                Source
              </label>
              <select
                value={formData.source || ''}
                onChange={handleInputChange('source')}
                disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, #e2e8f0)',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, #f8fafc)' : 'var(--admin-background, #ffffff)',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
              >
                <option value="">Select source</option>
                <option value="WEBSITE">Website</option>
                <option value="GMAIL">Gmail</option>
              </select>
            </div>

            {/* Fourth Row: Message */}
            <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--admin-foreground, var(--headline-color))'
                }}>
                  <MessageSquare size={16} style={{ color: 'var(--admin-foreground, var(--headline-color))', opacity: 0.7 }} />
                  Message
                </label>
                <textarea
                  value={formData.message || ''}
                  onChange={handleInputChange('message')}
                  placeholder="Enter message or notes"
                  rows={4}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--admin-border, var(--border))',
                    borderRadius: 'var(--admin-radius, 0.75rem)',
                    backgroundColor: saving ? 'var(--admin-muted, var(--muted))' : 'var(--admin-background, var(--background))',
                    fontSize: '0.875rem',
                    color: 'var(--admin-foreground, var(--headline-color))',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => {
                    if (!saving) {
                      e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                      e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--admin-border, #e2e8f0)';
                    e.target.style.boxShadow = 'none';
                  }}
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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 'var(--admin-radius, 0.75rem)',
                border: '1px solid var(--admin-border, #e2e8f0)',
                backgroundColor: 'var(--admin-background, #ffffff)',
                color: 'var(--admin-foreground, var(--headline-color))',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: saving ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = 'var(--admin-muted, #f8fafc)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.target.style.backgroundColor = 'var(--admin-background, #ffffff)';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isFormValid}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: 'var(--admin-radius, 0.75rem)',
                border: 'none',
                backgroundColor: saving || !isFormValid 
                  ? 'var(--admin-muted-foreground, var(--subheadline-color))' 
                  : 'var(--admin-primary, var(--main-accent-color))',
                color: 'var(--admin-primary-foreground, var(--primary-foreground))',
                cursor: (saving || !isFormValid) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: (saving || !isFormValid) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!saving && isFormValid) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = 'var(--admin-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving && isFormValid) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {saving ? (
                <>
                  <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus size={16} />
                  {mode === 'edit' ? 'Update Lead' : 'Create Lead'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;