"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getAuthHeaders, isAuthenticated, logout } from "../../utils/auth";
import { useToast } from "../../components/Toast";
import { FullPageSkeleton } from "./SkeletonComponents";
import { consentFormsAPI } from "../../utils/api";
import { AppShell } from './index';
import styles from "../../leads/detail/leadDetail.module.css";
import theme from "../../styles/adminTheme.module.css";

const TemplateForm = dynamic(() => import("../../components/TemplateForm/TemplateForm"), { ssr: false });
const BundledEditor = dynamic(() => import("../../components/BundledEditor/BundledEditor"), { ssr: false });

function ConsentFormsPageClient() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showError, showSuccess } = useToast();
    const [consentForms, setConsentForms] = useState([]);
    const [filteredConsentForms, setFilteredConsentForms] = useState([]);
    const [consentFormsLoading, setConsentFormsLoading] = useState(false);
    const [consentFormsPage, setConsentFormsPage] = useState(1);
    const [consentFormsTotalPages, setConsentFormsTotalPages] = useState(1);
    const [consentFormsPageSize] = useState(5);
    const [loadingMoreConsentForms, setLoadingMoreConsentForms] = useState(false);
    const [hasMoreConsentForms, setHasMoreConsentForms] = useState(false);
    const [selectedConsentForm, setSelectedConsentForm] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [generatingConsentForm, setGeneratingConsentForm] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingTimeout, setLoadingTimeout] = useState(null);
    const [showCancelView, setShowCancelView] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

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
    
    // Fetch consent forms
    const fetchConsentForms = useCallback(async (page = 1, loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMoreConsentForms(true);
            } else {
                setConsentFormsLoading(true);
            }

            const isFromSidebar = pathname === "/consent-forms" && !searchParams.get("lead");
            const lead = isFromSidebar ? "false" : searchParams.get("lead");

            let data;
            if (isFromSidebar || lead === "false") {
                data = await consentFormsAPI.getConsentFormsWithoutLead(page, consentFormsPageSize, '');
            } else {
                data = await consentFormsAPI.getConsentForms(lead, page, consentFormsPageSize, '');
            }

            let formsArray = data.results || [];
            let totalCount = data.count || 0;
            let hasNext = !!data.next;

            if (loadMore) {
                setConsentForms((prev) => [...prev, ...formsArray]);
                setFilteredConsentForms((prev) => [...prev, ...formsArray]);
            } else {
                setConsentForms(formsArray);
                setFilteredConsentForms(formsArray);
            }
            setConsentFormsPage(page);
            setConsentFormsTotalPages(Math.ceil(totalCount / consentFormsPageSize));
            setHasMoreConsentForms(hasNext);
        } catch (error) {
            console.error("Error fetching consent forms:", error);
            showError("Failed to fetch consent forms");
        } finally {
            setConsentFormsLoading(false);
            setLoadingMoreConsentForms(false);
        }
    }, [showError, consentFormsPageSize, pathname, searchParams]);

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.replace("/login");
            return;
        }
        fetchConsentForms(1, false);
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

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

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.replace("/login");
            return;
        }
        fetchConsentForms();
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, [fetchConsentForms]);

    // Open a blank editor
    const handleCreateBlankTemplate = () => {
        setSelectedConsentForm(null);
        setShowCancelView(false);
        setEditingTemplate({
            template: "",
            name: "",
        });
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

    // const handleTemplateSave = async (savedConsentForm) => {
    //     try {
    //         await fetchConsentForms();
    //         if (savedConsentForm && savedConsentForm.id) {
    //             setSelectedConsentForm(savedConsentForm);
    //             if (savedConsentForm.is_signed) {
    //                 setEditingTemplate(null);
    //                 setShowCancelView(false);
    //             } else {
    //                 setEditingTemplate({
    //                     id: savedConsentForm.id,
    //                     template: savedConsentForm.consent_data || "",
    //                     name: savedConsentForm.name || "",
    //                     is_signed: savedConsentForm.is_signed,
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error in handleTemplateSave:", error);
    //         showError("Failed to refresh consent forms list");
    //     }
    // };

    const handleSaveConsentFormWithoutLead = async (formData) => {
        try {
            setSavingTemplate(true);

            const consentFormData = {
                name: formData.name,
                consent_data: formData.template,
                lead: false
            };

            let savedConsentForm;

            if (formData.id) {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const response = await fetch(`${baseUrl}/leads/consent-forms/${formData.id}/`, {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body: JSON.stringify(consentFormData),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update consent form: ${response.status}`);
                }

                savedConsentForm = await response.json();
            } else {
                // Create new consent form without lead
                savedConsentForm = await consentFormsAPI.createConsentFormWithoutLead(consentFormData);
            }

            showSuccess(formData.id ? "Consent form updated successfully!" : "Consent form created successfully!");
            await fetchConsentForms();
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
            setFilteredConsentForms(filteredConsentForms.filter((form) => form.id !== consentFormId));
            setSelectedConsentForm(null);
            setEditingTemplate(null);
            setShowCancelView(false);
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
          <h1>${`Consent Form for ${consentForm.name}`}</h1>
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

    const handleConsentFormsScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreConsentForms && !loadingMoreConsentForms) {
            fetchConsentForms(consentFormsPage + 1, true);
        }
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

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.replace("/login");
            return;
        }
        fetchConsentForms();
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, [fetchConsentForms]);

    return (
        <AppShell
            breadcrumbItems={[{ label: 'Consent Forms', href: '/consent-forms' }]}
            pageTitle="Consent Forms"
        >
            <div className={`${styles.modernLeadContainer} ${fadeIn ? styles.fadeIn : ""}`}>
                <div className={styles.topNavTabs}>

                </div>
                <div className={styles.contentWrapper}>
                    <div className={styles.mainLayout}>
                        <div className={styles.actionPanel}>
                            <div className={styles.actionPanelHeader}>
                                <h3 className={styles.panelTitle}>
                                    {selectedConsentForm?.is_signed
                                        ? "Signed Consent Form Preview"
                                        : editingTemplate
                                            ? "Consent Form Editor"
                                            : "Consent Actions"}
                                </h3>
                                {!selectedConsentForm?.is_signed && (
                                    <div className={styles.actionButtons}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCreateBlankTemplate}
                                            disabled={savingTemplate}
                                            className={styles.actionButton}
                                        >
                                            <i className="fas fa-plus me-2"></i> New Blank Form
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
                                )}
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
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

export default function ConsentFormsPage() {
    return (
        <Suspense fallback={<FullPageSkeleton showHeader={true} showStats={false} contentType="default" showSidebar={false} />}>
            <ConsentFormsPageClient />
        </Suspense>
    );
}

export const revalidate = 0;