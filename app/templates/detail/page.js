"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getAuthHeaders, isAuthenticated, logout } from "../../utils/auth";
import { fetchPagesData } from "../../utils/fetchPagesData";
import { useToast } from "../../components/Toast";
import { PageLoader, ButtonLoader } from "../../components/LoadingSpinner";
import styles from "./templateDetail.module.css";
import theme from "../../styles/adminTheme.module.css";
import TemplateForm from "../../components/TemplateForm/TemplateForm";

const TemplateDetailClient = () => {
  const [template, setTemplate] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    template: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const templateId = searchParams.get("id");
  const editMode = searchParams.get("editMode");

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/login");
      return;
    }

    if (!templateId) {
      showError("Template ID is required");
      router.push("/leads");
      return;
    }

    Promise.all([fetchTemplate(), fetchOrgData()]);
  }, [templateId]);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const fetchTemplate = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${baseUrl}/leads/organization-templates/${templateId}/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (response.status === 404) {
        showError("Template not found");
        router.push("/leads");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTemplate(data);
      setFormData({
        name: data.name,
        template: data.template,
      });

      // If editMode is specified, automatically start editing
      if (editMode === "true") {
        setIsEditing(true);
      }
    } catch (err) {
      console.error("Template fetch error:", err);
      showError("Failed to load template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgData = async () => {
    try {
      const data = await fetchPagesData();
      setOrgData(data);
    } catch (err) {
      console.error("Org data fetch error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.replace("/login");
  };

  const handleBackToTemplates = () => {
    router.push("/leads?tab=templates");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const response = await fetch(
        `${baseUrl}/leads/organization-templates/${templateId}/`,
        {
          method: "PUT",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTemplate = await response.json();
      setTemplate(updatedTemplate);
      setIsEditing(false);
      showSuccess("Template updated successfully!");
    } catch (err) {
      console.error("Template update error:", err);
      showError("Failed to update template. Please try again.");
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

  if (loading) {
    return <PageLoader message="Loading template..." />;
  }

  if (!template) {
    return <PageLoader message="Template not found..." />;
  }

  return (
    <div
      className={`${styles.templateDetailContainer} ${
        fadeIn ? styles.fadeIn : ""
      }`}
    >
      {/* Simple Header - Only Domain Name and Logout */}
      <div className={theme.domainHeader}>
        <div className={styles.headerContent}>
          <h1 className={theme.domainName}>
            {orgData?.name || orgData?.title || "Clinic Admin"}
          </h1>
          <Button onClick={handleLogout} className={theme.logoutButton}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Simple Content Header */}
        <div className={styles.simpleContentHeader}>
          <div className={styles.templateInfo}>
            <Button onClick={handleBackToTemplates} className={theme.backButton}>
              <i className="fas fa-arrow-left me-2"></i> Back to Templates
            </Button>
            <span className={styles.templateTitle}>/ {template.name}</span>
          </div>
        </div>

        {/* Template Details Section */}
        <div className={styles.templateDetailsSection}>
          <div className={styles.templateDetailsCard}>
            <div className={styles.templateDetailsHeader}>
              <h3 className={styles.templateDetailsTitle}>
                <i className="fas fa-file-alt me-2"></i> Template Details
              </h3>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className={theme.warningButton}
                >
                  <i className="fas fa-edit me-2"></i> Edit Template
                </Button>
              )}
            </div>
            <div className={styles.templateDetailsContent}>
              {isEditing ? (
                <TemplateForm
                  handleFormChange={handleFormChange}
                  handleSave={handleSave}
                  saving={saving}
                  setIsEditing={setIsEditing}
                  setFormData={setFormData}
                  formData={formData}
                  template={template}
                />
              ) : (
                <div className={styles.templateDetailsGrid}>
                  <div className={styles.templateDetailItem}>
                    <label className={styles.templateDetailLabel}>Name:</label>
                    <span className={styles.templateDetailValue}>
                      {template.name}
                    </span>
                  </div>
                  <div className={styles.templateDetailItem}>
                    <label className={styles.templateDetailLabel}>
                      Template Preview:
                    </label>
                    <div className={styles.templatePreviewContainer}>
                      <div
                        className={styles.templatePreview}
                        dangerouslySetInnerHTML={{
                          __html:
                            template.template ||
                            '<p class="text-muted">No content available</p>',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateDetailPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <TemplateDetailClient />
    </Suspense>
  );
};

export default TemplateDetailPage;
