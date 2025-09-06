"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell, PageSpinner } from './index';
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

const TemplateCreatePage = () => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    template: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId'); // For generating consent forms
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return;
    }
  }, []);

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const payload = {
        name: formData.name,
        template: formData.template,
      };

      const response = await fetch(`${baseUrl}/leads/organization-templates/`, {
        method: 'POST',
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

      showSuccess('Template created successfully!');
      setFormData({ name: '', template: '' });
      
      // Navigate back to appropriate page
      if (leadId) {
        router.push(`/leads/detail?id=${leadId}`);
      } else {
        router.push('/leads?tab=templates');
      }
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
    if (leadId) {
      router.push(`/leads/detail?id=${leadId}`);
    } else {
      router.push('/leads?tab=templates');
    }
  };

  const breadcrumbItems = [
    { name: 'Templates', href: '/leads?tab=templates' },
    { name: 'Create Template' },
  ];

  if (leadId) {
    breadcrumbItems.unshift({ name: 'Leads', href: '/leads' });
    breadcrumbItems.unshift({ name: `Lead ${leadId}`, href: `/leads/detail?id=${leadId}` });
  }

  return (
    <AppShell
      pageTitle="Create Template"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="admin-container">
        <div className="admin-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              📄 Create New Template
            </h1>
            <p style={{ color: 'var(--admin-muted-foreground)', fontSize: '0.875rem' }}>
              {leadId 
                ? 'Create a consent form template for this lead.'
                : 'Create a reusable template for consent forms.'
              }
            </p>
          </div>

          <TemplateForm
            handleFormChange={handleFormChange}
            handleSave={handleSaveTemplate}
            saving={saving}
            setIsEditing={() => {}}
            setFormData={setFormData}
            formData={formData}
            handleCancel={handleCancel}
            mode="create"
          />
        </div>
      </div>
    </AppShell>
  );
};

export default TemplateCreatePage;