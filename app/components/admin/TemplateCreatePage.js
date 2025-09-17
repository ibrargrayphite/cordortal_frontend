"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell } from './index';
import { getAuthHeaders, isAuthenticated, logout } from '../../utils/auth';
import { useToast } from '../Toast';
import { Skeleton } from '../Skeleton';
import styles from "../../templates/detail/templateDetail.module.css";
// Dynamically import the TemplateForm to avoid SSR issues
const TemplateForm = dynamic(
  () => import('../TemplateForm/TemplateForm'),
  {
    ssr: false,
    loading: () => (
      <div className="admin-container">
        <div className="admin-card !bg-white !text-black">
          {/* Skeleton for header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Skeleton width="300px" height="1.5rem" />
            <Skeleton width="400px" height="1rem" style={{ marginTop: '0.5rem' }} />
          </div>
          {/* Skeleton for TemplateForm */}
          <div>
            <div className="mb-3 space-y-2">
              <Skeleton width="150px" height="1rem" /> 
              <Skeleton width="100%" height="2.5rem" />
            </div>
            <div className={styles.fullPageEditorContainer}>
              <div className={styles.editorHeader}>
                <Skeleton width="200px" height="1.5rem" /> 
                <Skeleton width="200px" height="1.5rem" />
              </div>
              <div className={styles.editorContainer}>
                <div className={styles.editorSection}>
                  <Skeleton width="100%" height="400px" />
                </div>
                <div className={styles.previewSection}>
                  <Skeleton width="100%" height="400px" />
                </div>
              </div>
            </div>
            <div className={styles.editActions}>
              <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
              <Skeleton width="120px" height="2.5rem" />
            </div>
          </div>
        </div>
      </div>
    )
  }
);

const TemplateCreatePage = () => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    template: '',
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId'); // For generating consent forms
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      if (!(await isAuthenticated())) {
        window.location.replace('/login');
        return;
      }
      setHasLoaded(true);
    };
    checkAuth();
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

  if (!hasLoaded) {
    return (
      <AppShell
        pageTitle="Create Template"
        breadcrumbItems={breadcrumbItems}
      >
        <div className="admin-container">
          <div className="admin-card !bg-white !text-black">
            {/* Skeleton for header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Skeleton width="300px" height="1.5rem" />
              <Skeleton width="400px" height="1rem" style={{ marginTop: '0.5rem' }} />
            </div>
            {/* Skeleton for TemplateForm */}
            <div>
              <div className="mb-3 space-y-2">
                <Skeleton width="150px" height="1rem" />
                <Skeleton width="100%" height="2.5rem" />
              </div>
              <div className={styles.fullPageEditorContainer}>
                <div className={styles.editorHeader}>
                  <Skeleton width="200px" height="1.5rem" />
                  <Skeleton width="200px" height="1.5rem" />
                </div>
                <div className={styles.editorContainer}>
                  <div className={styles.editorSection}>
                    <Skeleton width="100%" height="400px" />
                  </div>
                  <div className={styles.previewSection}>
                    <Skeleton width="100%" height="400px" />
                  </div>
                </div>
              </div>
              <div className={styles.editActions}>
                <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
                <Skeleton width="120px" height="2.5rem" />
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      pageTitle="Create Template"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="admin-container">
        <div className="admin-card !bg-white !text-black">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Create New Template
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
            setIsEditing={() => { }}
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