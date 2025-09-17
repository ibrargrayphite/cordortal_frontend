"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getAuthHeaders, isAuthenticated, logout } from "../../utils/auth";
import { useToast } from "../../components/Toast";
import { PageLoader, DataLoader } from "../../components/LoadingSpinner";
import { consentFormsAPI } from "../../utils/api";
import { AppShell } from './index';
import styles from "../../leads/detail/leadDetail.module.css";
import theme from "../../styles/adminTheme.module.css";

const TemplateForm = dynamic(() => import("../../components/TemplateForm/TemplateForm"), { ssr: false });
const BundledEditor = dynamic(() => import("../../components/BundledEditor/BundledEditor"), { ssr: false });

function AdminConsentFormPageClient({ isNewForm = false, templateData = null }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showError, showSuccess } = useToast();
    const [consentForms, setConsentForms] = useState([]);
    const [consentFormsLoading, setConsentFormsLoading] = useState(false);
    const [selectedConsentForm, setSelectedConsentForm] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [showCancelView, setShowCancelView] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [generatingConsentForm, setGeneratingConsentForm] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingTimeout, setLoadingTimeout] = useState(null);

    
    // Fetch consent forms without lead
    const fetchConsentForms = useCallback(async () => {
        try {
            setConsentFormsLoading(true);
            const data = await consentFormsAPI.getConsentFormsWithoutLead(1, 100, '');
            const formsArray = data.results || [];
            setConsentForms(formsArray);
        } catch (error) {
            console.error("Error fetching consent forms:", error);
            showError("Failed to fetch consent forms");
        } finally {
            setConsentFormsLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.replace("/login");
            return;
        }
        fetchConsentForms();
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, [fetchConsentForms]);

    // Auto-open editor when isNewForm is true or templateData is provided
    useEffect(() => {
        if (isNewForm || templateData) {
            setEditingTemplate(templateData || {
                template: "",
                name: "",
            });
            setSelectedConsentForm(null);
            setShowCancelView(false);
        }
    }, [isNewForm, templateData]);

    // Progressive loading messages for consent form generation
    const startProgressiveLoading = () => {
        setLoadingMessage('Preparing...');
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }
        const timeout1 = setTimeout(() => setLoadingMessage('Analyzing template...'), 3000);
        const timeout2 = setTimeout(() => setLoadingMessage('Processing with AI...'), 6000);
        const timeout3 = setTimeout(() => setLoadingMessage('Generating consent form...'), 9000);
        const timeout4 = setTimeout(() => setLoadingMessage('Almost done...'), 12000);
        setLoadingTimeout({ timeout1, timeout2, timeout3, timeout4 });
    };

    const clearProgressiveLoading = () => {
        if (loadingTimeout) {
            Object.values(loadingTimeout).forEach(timeout => clearTimeout(timeout));
            setLoadingTimeout(null);
        }
        setLoadingMessage('');
    };

    useEffect(() => {
        return () => clearProgressiveLoading();
    }, []);

    const fetchTemplates = async () => {
        try {
            setTemplatesLoading(true);
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/leads/organization-templates/`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if (response.status === 401) {
                logout();
                window.location.replace("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTemplates(data.results || []);
        } catch (err) {
            console.error("Templates fetch error:", err);
            showError("Failed to load templates. Please try again.");
        } finally {
            setTemplatesLoading(false);
        }
    };

    // Handle generating consent form from template
    const handleGenerateConsentForm = async (templateId) => {
        try {
            setGeneratingConsentForm(true);
            setSavingTemplate(true);
            setSelectedConsentForm(null);
            setShowCancelView(false);
            setIsDropdownOpen(false); // Close dropdown when generating form

            startProgressiveLoading();

            if (!templateId) {
                throw new Error("No template selected");
            }

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const templateResponse = await fetch(`${baseUrl}/leads/organization-templates/${templateId}/`, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if (!templateResponse.ok) {
                throw new Error(`Failed to fetch template: ${templateResponse.status}`);
            }

            const templateData = await templateResponse.json();
            if (!templateData?.template?.trim()) {
                throw new Error("Template HTML is missing or empty");
            }

            setEditingTemplate({
                name: templateData.name || "Generated Consent Form",
                template: templateData.template,
            });
        } catch (err) {
            console.error("Error in handleGenerateConsentForm:", err);
            showError(err.message || "Could not generate consent form. Please try again.");
        } finally {
            setGeneratingConsentForm(false);
            setSavingTemplate(false);
            clearProgressiveLoading();
        }
    };

    // Open a blank editor
    const handleCreateBlankTemplate = () => {
        setSelectedConsentForm(null);
        setShowCancelView(false);
        setEditingTemplate({
            template: "",
            name: "",
        });
        setIsDropdownOpen(false); // Close dropdown when creating new form
    };

    const handleCancelConsentForm = () => {
        setSelectedConsentForm(null);
        setEditingTemplate(null);
        setShowCancelView(true);
    };

    const handleFormChange = (field, value) => {
        setEditingTemplate((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveConsentFormWithoutLead = async (formData) => {
        try {
            setSavingTemplate(true);

            // Validate required fields
            if (!formData.name || !formData.name.trim()) {
                throw new Error("Consent form name is required");
            }

            if (!formData.template || !formData.template.trim()) {
                throw new Error("Consent form content is required");
            }

            const consentFormData = {
                name: formData.name.trim(),
                consent_data: formData.template.trim(),
                lead: false
            };

            console.log("Saving consent form data:", consentFormData);

            let savedConsentForm;

            if (formData.id) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const response = await fetch(`${baseUrl}/leads/consent-forms/${formData.id}/`, {
                    method: "PUT",
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(consentFormData),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Update error response:", errorText);
                    throw new Error(`Failed to update consent form: ${response.status} - ${errorText}`);
                }

                savedConsentForm = await response.json();
            } else {
                // Create new consent form without lead
                console.log("Creating new consent form...");
                savedConsentForm = await consentFormsAPI.createConsentFormWithoutLead(consentFormData);
                console.log("Created consent form:", savedConsentForm);
            }

            showSuccess(formData.id ? "Consent form updated successfully!" : "Consent form created successfully!");
            await fetchConsentForms(); // Refresh the list
            setSelectedConsentForm(savedConsentForm);
            setEditingTemplate(null);
            return savedConsentForm;
        } catch (error) {
            console.error("Error saving consent form:", error);
            showError(error.message || "Failed to save consent form. Please try again.");
            throw error;
        } finally {
            setSavingTemplate(false);
        }
    };

    const handleTemplateEdit = (consentForm) => {
        setSelectedConsentForm(consentForm);
        setShowCancelView(false);
        setEditingTemplate({
            id: consentForm.id,
            template: consentForm.consent_data || "",
            name: consentForm.name || "",
        });
        setIsDropdownOpen(false); // Close dropdown when editing form
    };

    const handleDeleteConsentForm = async (consentFormId) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/leads/consent-forms/${consentFormId}/`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (response.status === 401) {
                logout();
                window.location.replace("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setConsentForms(consentForms.filter((form) => form.id !== consentFormId));
            setSelectedConsentForm(null);
            setEditingTemplate(null);
            setShowCancelView(false);
            showSuccess("Consent form deleted successfully!");
        } catch (err) {
            console.error("Delete consent form error:", err);
            showError("Failed to delete consent form. Please try again.");
        }
    };

    const handlePrintConsentForm = (consentForm) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showError("Please allow popups to enable printing.");
            return;
        }
        const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consent Form - ${consentForm.name || `Form ${consentForm.id}`}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; background: white; padding: 1in; max-width: 8.5in; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header h1 { font-size: 18pt; font-weight: bold; margin-bottom: 10px; }
          .header .meta { font-size: 10pt; color: #666; }
          .content { margin-bottom: 30px; }
          .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 { margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
          .content h1 { font-size: 16pt; } .content h2 { font-size: 14pt; } .content h3 { font-size: 13pt; } .content h4 { font-size: 12pt; }
          .content p { margin-bottom: 10px; text-align: justify; }
          .content table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .content table, .content th, .content td { border: 1px solid #000; }
          .content th, .content td { padding: 8px; text-align: left; }
          .content th { background-color: #f5f5f5; font-weight: bold; }
          .signature-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; }
          .signature-section h4 { margin-bottom: 15px; }
          .signature-section img { max-width: 300px; max-height: 100px; border: 1px solid #ccc; padding: 5px; margin-bottom: 10px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; color: #666; text-align: center; }
          @media print { body { padding: 0.5in; } .no-print { display: none; } .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${`Consent Form - ${consentForm.name}`}</h1>
          <div class="meta">
            <p><strong>Status:</strong> ${consentForm.is_signed ? 'Signed' : 'Unsigned'}</p>
            <p><strong>Lead:</strong> ${consentForm.lead_email || 'N/A'}</p>
            ${consentForm.signed_at ? `<p><strong>Signed Date:</strong> ${new Date(consentForm.signed_at).toLocaleDateString()}</p>` : ''}
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <div class="content">
          ${consentForm.consent_data || '<p>No content available</p>'}
        </div>
        <div class="footer">
          <p>This document was generated from the clinic management system.</p>
        </div>
        <script>
          window.onload = function() { window.focus(); window.print(); };
          window.onafterprint = function() {};
        </script>
      </body>
      </html>
    `;
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: "Unknown date", time: "", full: "Unknown date" };
        try {
            const date = new Date(dateString);
            return {
                date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                full: date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
            };
        } catch (error) {
            return { date: "Invalid date", time: "", full: "Invalid date" };
        }
    };

    return (
        <div className="admin-shell">
            {/* Custom Sidebar with Consent Forms List */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">
                        <div className="admin-sidebar-avatar">C</div>
                        <span className="admin-sidebar-title">Clinic Admin</span>
                    </div>
                </div>
                <nav className="admin-sidebar-nav">
                    <button 
                        className="admin-nav-item"
                        onClick={() => router.push('/leads')}
                    >
                        <span className="admin-nav-icon">
                            <Image src="/assets/images/icons/leads-icon.svg" alt="Leads" width={20} height={20} />
                        </span>
                        Leads
                    </button>
                    <button 
                        className="admin-nav-item"
                        onClick={() => router.push('/templates')}
                    >
                        <span className="admin-nav-icon">
                            <Image src="/assets/images/icons/templates-icon.svg" alt="Templates" width={20} height={20} />
                        </span>
                        Templates
                    </button>
                    <div className={styles.navItemWithDropdown}>
                        <button 
                            className="admin-nav-item active"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="admin-nav-icon">
                                <Image src="/assets/images/icons/consent-form-icon.svg" alt="Consent Forms" width={20} height={20} />
                            </span>
                            Consent Forms
                            <span className="admin-nav-arrow">→</span>
                        </button>
                        
                        {/* Consent Forms Dropdown */}
                        {isDropdownOpen && (
                        <div className={styles.consentFormsDropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3 className={styles.panelTitle}>Available Consent Forms</h3>
                                <div className={styles.actionButtons}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCreateBlankTemplate}
                                        disabled={savingTemplate}
                                        className={styles.actionButton}
                                    >
                                        <i className="fas fa-plus me-2"></i> New Form
                                    </Button>
                                    <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchTemplates()}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                disabled={savingTemplate}
                                                className={styles.primaryActionButton}
                                            >
                                                {savingTemplate ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                                        {loadingMessage || 'Loading...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-file-alt me-2"></i> Generate Form
                                                    </>
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {templatesLoading ? (
                                                <DropdownMenuItem disabled>
                                                    <i className="fas fa-spinner fa-spin me-2"></i> Loading templates...
                                                </DropdownMenuItem>
                                            ) : templates.length > 0 ? (
                                                templates.map((template) => (
                                                    <DropdownMenuItem
                                                        key={template.id}
                                                        onClick={() => handleGenerateConsentForm(template.id)}
                                                    >
                                                        {template.name}
                                                    </DropdownMenuItem>
                                                ))
                                            ) : (
                                                <DropdownMenuItem disabled>No templates available</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <div className={styles.dropdownContent}>
                                {consentFormsLoading ? (
                                    <div className={styles.loadingState}>
                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                        <p>Loading consent forms...</p>
                                    </div>
                                ) : consentForms.length > 0 ? (
                                    <div className={styles.consentFormsList}>
                                        {consentForms.map((consentForm) => (
                                            <div
                                                key={consentForm.id}
                                                className={`${styles.consentFormItem} ${
                                                    selectedConsentForm?.id === consentForm.id ? styles.selected : ''
                                                }`}
                                                onClick={() => handleTemplateEdit(consentForm)}
                                            >
                                                <div className={styles.consentFormInfo}>
                                                    <h4 className={styles.consentFormName}>
                                                        {consentForm.name || `Consent Form ${consentForm.id}`}
                                                    </h4>
                                                    <div className={styles.consentFormMeta}>
                                                        <span
                                                            className={`${styles.statusBadge} ${
                                                                consentForm.is_signed ? styles.signed : styles.unsigned
                                                            }`}
                                                        >
                                                            {consentForm.is_signed ? "Signed" : "Unsigned"}
                                                        </span>
                                                        <small className={styles.consentFormDate}>
                                                            {formatDateTime(consentForm.created_at).date}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className={styles.consentFormActions}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePrintConsentForm(consentForm);
                                                        }}
                                                        className={styles.iconButton}
                                                    >
                                                        <i className="fas fa-print"></i>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteConsentForm(consentForm.id);
                                                        }}
                                                        className={`${styles.iconButton} ${styles.dangerButton}`}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyState}>
                                        <i className="fas fa-file-signature"></i>
                                        <p>No consent forms found</p>
                                        <small>Create your first consent form using the buttons above</small>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}
                    </div>
                    <button 
                        className="admin-nav-item"
                        onClick={() => router.push('/integrations')}
                    >
                        <span className="admin-nav-icon">
                            <Image src="/assets/images/icons/integrations-icon.svg" alt="Integrations" width={20} height={20} />
                        </span>
                        Integrations
                    </button>
                </nav>
            </div>

            {/* Custom Top Bar */}
            <header className="admin-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                        Consent Forms Management
                    </h1>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <div className={`${styles.modernLeadContainer} ${fadeIn ? styles.fadeIn : ""}`}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.mainLayout}>
                            {/* Right Panel - Form Editor/Preview - Only show when creating/editing */}
                            {(editingTemplate || selectedConsentForm) && (
                            <div className={styles.actionPanel}>
                                <div className={styles.actionPanelHeader}>
                                    <h3 className={styles.panelTitle}>
                                        {selectedConsentForm?.is_signed
                                            ? "Signed Consent Form Preview"
                                            : editingTemplate
                                                ? "Consent Form Editor"
                                                : "Consent Form Management"}
                                    </h3>
                                </div>
                                <div className={styles.consentActionContent}>
                                    {showCancelView ? (
                                        <div className={styles.defaultConsentInterface}>
                                            <div className={styles.consentPlaceholder}>
                                                <i className="fas fa-file-signature"></i>
                                                <h5>No Consent Form Selected</h5>
                                                <p>Choose a consent form from the sidebar or select a template to create a new one</p>
                                            </div>
                                        </div>
                                    ) : selectedConsentForm?.is_signed ? (
                                        <div className={styles.signedConsentPreviewPage}>
                                            <div className={styles.previewPageHeader}>
                                                <div className={styles.previewPageInfo}>
                                                    <h2 className={styles.previewPageTitle}>
                                                        {selectedConsentForm.name || `Consent Form ${selectedConsentForm.id}`}
                                                    </h2>
                                                    <div className={styles.previewPageMeta}>
                                                        <span className={`${styles.statusBadge} ${styles.signed}`}>
                                                            <i className="fas fa-check-circle me-2"></i>
                                                            Signed
                                                        </span>
                                                        <span className={styles.previewPageSubtitle}>
                                                            Lead: {selectedConsentForm.lead_email || 'N/A'}
                                                        </span>
                                                        {selectedConsentForm.signed_at && (
                                                            <span className={styles.previewPageSubtitle}>
                                                                Signed: {formatDateTime(selectedConsentForm.signed_at).full}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={styles.previewPageActions}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePrintConsentForm(selectedConsentForm)}
                                                        className={styles.secondaryButton}
                                                    >
                                                        <i className="fas fa-print me-2"></i> Print
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedConsentForm(null);
                                                            setEditingTemplate(null);
                                                            setShowCancelView(false);
                                                        }}
                                                        className={styles.secondaryButton}
                                                    >
                                                        <i className="fas fa-arrow-left me-2"></i> Back to List
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteConsentForm(selectedConsentForm.id)}
                                                        className={styles.dangerButton}
                                                    >
                                                        <i className="fas fa-trash me-2"></i> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={styles.previewPageContent}>
                                                <div
                                                    className={styles.signedConsentDocument}
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedConsentForm.consent_data || "<p>No content available</p>",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : editingTemplate ? (
                                        <TemplateForm
                                            mode="consent"
                                            handleFormChange={handleFormChange}
                                            handleSave={handleSaveConsentFormWithoutLead}
                                            saving={savingTemplate}
                                            setIsEditing={setEditingTemplate}
                                            setFormData={setEditingTemplate}
                                            formData={editingTemplate}
                                            template={editingTemplate}
                                            handleCancel={handleCancelConsentForm}
                                            fetchConsentForms={fetchConsentForms}
                                            isSigned={selectedConsentForm?.is_signed || false}
                                            hideLeadSpecificActions={true} // Hide "Get Signed" and "Send Link" buttons
                                        />
                                    ) : selectedConsentForm ? (
                                        <div className={styles.viewConsentInterface}>
                                            <div className={styles.consentMetaInfo}>
                                                <div className={styles.consentInfo}>
                                                    <h4 className={styles.selectedConsentTitle}>
                                                        {selectedConsentForm.name || `Consent Form ${selectedConsentForm.id}`}
                                                    </h4>
                                                    <div className={styles.consentMeta}>
                                                        <span
                                                            className={`${styles.statusBadge} ${selectedConsentForm.is_signed ? styles.signed : styles.unsigned}`}
                                                        >
                                                            {selectedConsentForm.is_signed ? "Signed" : "Unsigned"}
                                                        </span>
                                                        <small className={styles.consentSubtitle}>Lead: {selectedConsentForm.lead_email || 'N/A'}</small>
                                                    </div>
                                                </div>
                                                <div className={styles.consentActions}>
                                                    {!selectedConsentForm.is_signed && (
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleTemplateEdit(selectedConsentForm)}
                                                            className={styles.primaryButton}
                                                        >
                                                            <i className="fas fa-edit me-2"></i> Edit Form
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedConsentForm(null);
                                                            setShowCancelView(false);
                                                        }}
                                                        className={styles.secondaryButton}
                                                    >
                                                        <i className="fas fa-times me-2"></i> Close
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={styles.fullWidthConsentPreview}>
                                                <div
                                                    className={styles.fullWidthTemplatePreview}
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedConsentForm.consent_data || "<p>No content available</p>",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.defaultConsentInterface}>
                                            <div className={styles.consentPlaceholder}>
                                                <i className="fas fa-file-signature"></i>
                                                <h5>No Consent Form Selected</h5>
                                                <p>Choose a consent form from the sidebar or select a template to create a new one</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            )}
                            
                            {/* Default Landing Page - Show when no form is selected */}
                            {!editingTemplate && !selectedConsentForm && (
                                <div className={styles.landingPage}>
                                    <div className={styles.landingContent}>
                                        <div className={styles.landingIcon}>
                                            <i className="fas fa-file-signature"></i>
                                        </div>
                                        <h2 className={styles.landingTitle}>Consent Forms Management</h2>
                                        <p className={styles.landingDescription}>
                                            Create, manage, and track consent forms for your clinic. 
                                            Use the sidebar to create new forms or select existing ones to edit.
                                        </p>
                                        <div className={styles.landingActions}>
                                            <Button
                                                variant="default"
                                                size="lg"
                                                onClick={handleCreateBlankTemplate}
                                                className={styles.primaryActionButton}
                                            >
                                                <i className="fas fa-plus me-2"></i> Create New Form
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => setIsDropdownOpen(true)}
                                                className={styles.secondaryActionButton}
                                            >
                                                <i className="fas fa-list me-2"></i> View All Forms
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminConsentFormPage({ isNewForm = false, templateData = null }) {
    return (
        <Suspense fallback={<DataLoader />}>
            <AdminConsentFormPageClient isNewForm={isNewForm} templateData={templateData} />
        </Suspense>
    );
}

export const revalidate = 0;