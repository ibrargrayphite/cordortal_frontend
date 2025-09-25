"use client";

import React, { useEffect, useState } from 'react';
import { X, User } from "lucide-react";
import { userAPI } from '../../utils/api';

const UserProfileModal = ({
  isOpen,
  onClose,
  userId
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    current_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [originalData, setOriginalData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    username: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, fetching user data. userId:', userId);
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting to fetch user data...');
      
      const userData = await userAPI.getCurrentUser();
      console.log('Fetched user data:', userData);
      
      // API returns an array, so get the first element
      const user = userData[0];
      console.log('Processed user data (first element):', user);
      
      if (!user) {
        throw new Error('No user data received from API');
      }
      
      const userFormData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        current_password: '',
        new_password: '',
        new_password_confirm: ''
      };
      
      console.log('Setting form data:', userFormData);
      setFormData(userFormData);
      setOriginalData({
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || ''
      });
      
      console.log('Form data set successfully');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(`Failed to load user data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: [] };
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numeric: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];
    
    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.uppercase) feedback.push('Uppercase letter');
    if (!checks.lowercase) feedback.push('Lowercase letter');
    if (!checks.numeric) feedback.push('Number');
    if (!checks.special) feedback.push('Special character');
    
    return { score, feedback, checks };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setError('');
      
      // Only include fields that have been changed
      const updateData = {};
      
      // Check each field for changes
      if (formData.first_name !== originalData.first_name) {
        updateData.first_name = formData.first_name;
      }
      
      if (formData.last_name !== originalData.last_name) {
        updateData.last_name = formData.last_name;
      }
      
      if (formData.username !== originalData.username) {
        updateData.username = formData.username;
      }
      
      // Handle password change if any password field is filled
      const hasPasswordChange = formData.current_password.trim() || 
                               formData.new_password.trim() || 
                               formData.new_password_confirm.trim();
      
      if (hasPasswordChange) {
        // Validate password fields
        if (!formData.current_password.trim()) {
          setError('Current password is required to change password.');
          return;
        }
        
        if (!formData.new_password.trim()) {
          setError('New password is required.');
          return;
        }
        
        if (formData.new_password !== formData.new_password_confirm) {
          setError('New password and confirm password do not match.');
          return;
        }
        
        // Enhanced password validation
        const password = formData.new_password;
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumeric = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (password.length < minLength) {
          setError('New password must be at least 8 characters long.');
          return;
        }
        
        if (!hasUpperCase) {
          setError('New password must contain at least one uppercase letter.');
          return;
        }
        
        if (!hasLowerCase) {
          setError('New password must contain at least one lowercase letter.');
          return;
        }
        
        if (!hasNumeric) {
          setError('New password must contain at least one number.');
          return;
        }
        
        if (!hasSpecialChar) {
          setError('New password must contain at least one special character.');
          return;
        }
        
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
        updateData.new_password_confirm = formData.new_password_confirm;
      }
      
      // Check if there are any changes to send
      if (Object.keys(updateData).length === 0) {
        setError('No changes detected. Please modify at least one field before saving.');
        return;
      }
      
      // Use the user ID from the original data or the passed userId
      const updateUserId = userId || originalData.id;
      console.log('Updating user with ID:', updateUserId, 'Data:', updateData);
      await userAPI.updateUser(updateUserId, updateData);
      
      // Close modal on success
      onClose();
      
      // You might want to show a success message here
      // or trigger a refresh of the user data in the parent component
      
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

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
          maxWidth: '900px',
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
            Edit Profile
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

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: 'var(--admin-muted-foreground)'
          }}>
            <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
            Loading profile data...
          </div>
        )}

        {/* Form */}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem', 
              alignItems: 'start' 
            }}>
              {/* Left Column - Basic Info */}
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    margin: '0 0 1rem 0',
                    color: 'var(--admin-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <User size={20} />
                    Profile Information
                  </h3>
                </div>

                {/* Name Fields */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.5rem',
                      color: 'var(--admin-foreground)'
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
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
                      marginBottom: '0.5rem',
                      color: 'var(--admin-foreground)'
                    }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange('last_name')}
                      className="admin-input"
                      placeholder="Enter last name"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.5rem',
                      color: 'var(--admin-foreground)'
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      className="admin-input"
                      placeholder="Enter username"
                      disabled={saving}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Password Section */}
              <div>
                <div style={{
                  backgroundColor: 'var(--admin-muted)',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  border: '1px solid var(--admin-border)',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--admin-primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '600' }}>🔒</span>
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        margin: 0,
                        color: 'var(--admin-foreground)'
                      }}>
                        Change Password
                      </h3>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-muted-foreground)',
                        margin: 0
                      }}>
                        Leave blank to keep your current password
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {/* Current Password Field */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '0.5rem',
                        color: 'var(--admin-foreground)'
                      }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={formData.current_password}
                        onChange={handleInputChange('current_password')}
                        className="admin-input"
                        placeholder="Enter your current password"
                        disabled={saving}
                      />
                    </div>

                    {/* New Password Fields */}
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          marginBottom: '0.5rem',
                          color: 'var(--admin-foreground)'
                        }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={formData.new_password}
                          onChange={handleInputChange('new_password')}
                          className="admin-input"
                          placeholder="Enter new password"
                          disabled={saving}
                        />
                        {/* Password Strength Indicator */}
                        {formData.new_password && (
                          <div style={{ marginTop: '0.5rem' }}>
                            {(() => {
                              const strength = getPasswordStrength(formData.new_password);
                              const strengthColors = ['#dc2626', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
                              const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
                              
                              return (
                                <div>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.25rem'
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      gap: '0.25rem'
                                    }}>
                                      {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                          key={level}
                                          style={{
                                            width: '20px',
                                            height: '4px',
                                            backgroundColor: level <= strength.score ? strengthColors[strength.score - 1] : '#e5e7eb',
                                            borderRadius: '2px',
                                            transition: 'background-color 0.2s'
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <span style={{
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                      color: strengthColors[strength.score - 1] || '#6b7280'
                                    }}>
                                      {strengthLabels[strength.score - 1] || 'Very Weak'}
                                    </span>
                                  </div>
                                  {strength.feedback.length > 0 && (
                                    <div style={{
                                      fontSize: '0.7rem',
                                      color: '#dc2626'
                                    }}>
                                      Missing: {strength.feedback.join(', ')}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          marginBottom: '0.5rem',
                          color: 'var(--admin-foreground)'
                        }}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={formData.new_password_confirm}
                          onChange={handleInputChange('new_password_confirm')}
                          className="admin-input"
                          placeholder="Confirm new password"
                          disabled={saving}
                        />
                      </div>
                    </div>

                    {/* Password Requirements */}
                    <div style={{
                      backgroundColor: 'var(--admin-card)',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--admin-border)',
                      fontSize: '0.75rem',
                      color: 'var(--admin-muted-foreground)'
                    }}>
                      <strong>Password Requirements:</strong>
                      <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                        <li>At least 8 characters long</li>
                        <li>At least one uppercase letter (A-Z)</li>
                        <li>At least one lowercase letter (a-z)</li>
                        <li>At least one number (0-9)</li>
                        <li>At least one special character (!@#$%^&*...)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--admin-border)'
            }}>
              <button
                type="button"
                onClick={onClose}
                className="admin-button admin-button-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-button admin-button-primary"
                disabled={saving || !formData.username?.trim()}
              >
                {saving ? (
                  <>
                    <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;