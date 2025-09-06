"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell, PageSpinner, EmptyState } from './index';
import { getAuthHeaders, isAuthenticated, logout } from '../../utils/auth';
import { useToast } from '../Toast';

// Dynamically import the TemplateForm to avoid SSR issues
const TemplateForm = dynamic(
  () => import('../TemplateForm/TemplateForm'),
  { 
    ssr: false, 
    loading: () => <PageSpinner message="Loading editor..." /> 
  }
);

const TemplateDetailPage = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    template: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const editMode = searchParams.get('editMode');
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return;
    }

    if (!templateId) {
      showError('Template ID is required');
      router.push('/leads?tab=templates');
      return;
    }

    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    if (editMode === 'true') {
      setIsEditing(true);
    }
  }, [editMode]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/leads/organization-templates/${templateId}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (response.status === 404) {
        showError('Template not found');
        router.push('/leads?tab=templates');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const templateData = await response.json();
      setTemplate(templateData);
      setFormData({
        name: templateData.name || '',
        template: templateData.template || '',
      });
    } catch (err) {
      console.error('Template fetch error:', err);
      showError('Failed to load template details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const payload = {
        name: formData.name,
        template: formData.template,
      };

      const response = await fetch(`${baseUrl}/leads/organization-templates/${templateId}/`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTemplate = await response.json();
      setTemplate(updatedTemplate);
      setIsEditing(false);
      showSuccess('Template updated successfully!');
    } catch (err) {
      console.error('Template save error:', err);
      showError('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (template) {
      setFormData({
        name: template.name || '',
        template: template.template || '',
      });
    }
    setIsEditing(false);
  };

  const handleBackToTemplates = () => {
    router.push('/leads?tab=templates');
  };

  if (loading) {
    return <PageSpinner message="Loading template..." />;
  }

  if (!template) {
    return (
      <AppShell pageTitle="Template Not Found">
        <div className="admin-container">
          <EmptyState
            icon="❌"
            title="Template Not Found"
            description="The requested template could not be found."
            action={{
              label: 'Back to Templates',
              onClick: handleBackToTemplates,
            }}
          />
        </div>
      </AppShell>
    );
  }

  const breadcrumbItems = [
    { name: 'Templates', href: '/leads?tab=templates' },
    { name: template.name || `Template ${templateId}` },
  ];

  const pageActions = [
    {
      label: isEditing ? 'Cancel' : 'Edit Template',
      icon: isEditing ? '✕' : '✏️',
      variant: isEditing ? 'secondary' : 'primary',
      onClick: isEditing ? handleCancel : () => setIsEditing(true),
    },
  ];

  return (
    <AppShell
      pageTitle={template.name || `Template ${templateId}`}
      breadcrumbItems={breadcrumbItems}
      // pageActions={pageActions}
    >
      <div className="admin-container">
        <div className="admin-card">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                📄 {template.name || `Template ${templateId}`}
              </h1>
              <p style={{ color: 'var(--admin-muted-foreground)', fontSize: '0.875rem' }}>
                {isEditing ? 'Edit template content and settings.' : 'View template details and content.'}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {pageActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`admin-button ${action.variant === 'secondary' ? 'admin-button-secondary' : 'admin-button-primary'}`}
                  disabled={saving}
                >
                  {action.icon && (
                    <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
                  )}
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {isEditing ? (
            <TemplateForm
              handleFormChange={handleFormChange}
              handleSave={handleSaveTemplate}
              saving={saving}
              setIsEditing={setIsEditing}
              setFormData={setFormData}
              formData={formData}
              handleCancel={handleCancel}
              mode="edit"
              template={template}
            />
          ) : (
            <div>
              {/* Template Info */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--admin-muted)',
                  borderRadius: 'var(--admin-radius)'
                }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--admin-muted-foreground)' }}>
                      Template Name
                    </strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      {template.name || 'Unnamed Template'}
                    </div>
                  </div>
                  
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--admin-muted-foreground)' }}>
                      Last Updated
                    </strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      {template.updated_at 
                        ? new Date(template.updated_at).toLocaleString()
                        : 'Unknown'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--admin-muted-foreground)' }}>
                      Template ID
                    </strong>
                    <div style={{ marginTop: '0.25rem' }}>
                      {template.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Preview */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Template Preview
                </h3>
                <div 
                  style={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius)',
                    padding: '2rem',
                    backgroundColor: 'white',
                    minHeight: '400px',
                    fontFamily: 'serif'
                  }}
                >
                  {template.template ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: template.template,
                      }}
                      style={{
                        lineHeight: 1.6,
                        fontSize: '1rem'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      color: 'var(--admin-muted-foreground)',
                      fontStyle: 'italic'
                    }}>
                      No content available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default TemplateDetailPage;