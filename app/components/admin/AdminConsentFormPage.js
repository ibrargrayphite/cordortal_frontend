"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { flushSync } from "react-dom";
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
    console.log("in the pge ----->");
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showError, showSuccess } = useToast();
    const [consentForms, setConsentForms] = useState([]);
    const [consentFormsLoading, setConsentFormsLoading] = useState(false);
    const [selectedConsentForm, setSelectedConsentForm] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    
    // Simple fetch consent forms
    const fetchConsentForms = async () => {
        try {
            setConsentFormsLoading(true);
            const data = await consentFormsAPI?.getConsentFormsWithoutLead(1, 100, '');
            setConsentForms(data?.results ?? []);
        } catch (error) {
            console.error("Error fetching consent forms:", error);
            showError("Failed to fetch consent forms");
        } finally {
            setConsentFormsLoading(false);
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
    }, []);

    // Auto-open editor when isNewForm is true, templateData is provided, or consentForm is provided
    useEffect(() => {
        if (isNewForm || templateData) {
            setEditingTemplate(templateData || {
                template: "",
                name: "",
            });
            setSelectedConsentForm(null);
        }
    }, [isNewForm, templateData]);

    // Handle consent form from URL params
    useEffect(() => {
        const consentFormParam = searchParams.get('consentForm');
        if (consentFormParam) {
            try {
                const consentFormData = JSON.parse(decodeURIComponent(consentFormParam));
                setSelectedConsentForm(consentFormData);
                setEditingTemplate({
                    id: consentFormData.id,
                    template: consentFormData.template || "",
                    name: consentFormData.name || "",
                });
                // Clean up URL params after processing
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('consentForm');
                window.history.replaceState({}, '', newUrl);
            } catch (error) {
                console.error("Error parsing consent form data from URL:", error);
            }
        }
    }, [searchParams]);

    // Simple create blank form
    const handleCreateBlankForm = () => {
        setSelectedConsentForm(null);
        setEditingTemplate({
            template: "",
            name: "",
        });
        setIsDropdownOpen(false);
    };

    // Simple cancel form
    const handleCancelForm = () => {
        setSelectedConsentForm(null);
        setEditingTemplate(null);
    };

    // Simple form change handler
    const handleFormChange = (field, value) => {
        console.log("handleFormChange called with field:", field, "value:", value);
        setEditingTemplate((prev) => {
            const newState = {
                ...prev,
                [field]: value,
            };
            console.log("handleFormChange - prev state:", prev);
            console.log("handleFormChange - new state:", newState);
            return newState;
        });
    };

    // Simple save function
    const handleSaveConsentForm = async (formData) => {
        try {
            setSavingTemplate(true);
            console.log("=== SAVE FUNCTION CALLED ===");
            console.log("formData ----->", formData);
            console.log("editingTemplate ----->", editingTemplate);
            console.log("selectedConsentForm ----->", selectedConsentForm);
            
            // Use editingTemplate state as the source of truth for ID
            const currentId = editingTemplate?.id || formData?.id;
            console.log("Using ID:", currentId);
            console.log("ID type:", typeof currentId);
            console.log("ID truthy:", !!currentId);
            
            // Validate name is required
            if (!formData?.name?.trim()) {
                showError("Please enter a consent form name.");
                return;
            }
            
            const consentFormData = {
                name: formData.name,
                consent_data: formData.template
            };

            let savedConsentForm;

            if (currentId) {
                console.log("🔵 UPDATING existing form with ID:", currentId);
                console.log("🔵 Calling updateConsentFormWithoutLead with:", currentId, consentFormData);
                // Update existing form - use API function without lead field
                savedConsentForm = await consentFormsAPI.updateConsentFormWithoutLead(currentId, consentFormData);
                console.log("🔵 Update successful:", savedConsentForm);
            } else {
                console.log("🟢 CREATING new form");
                console.log("🟢 Calling createConsentFormWithoutLead with:", consentFormData);
                // Create new form - use API function without lead field
                savedConsentForm = await consentFormsAPI.createConsentFormWithoutLead(consentFormData);
                console.log("🟢 Create successful:", savedConsentForm);
            }

            showSuccess(currentId ? "Consent form updated successfully!" : "Consent form created successfully!");
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

    // Simple click handler for consent forms
    const handleConsentFormClick = (consentForm) => {
        console.log("=== CONSENT FORM CLICKED ===");
        console.log("consentForm clicked ----->", consentForm);
        console.log("consentForm.id ----->", consentForm.id);
        console.log("typeof consentForm.id ----->", typeof consentForm.id);
        console.log("consentForm.id truthy ----->", !!consentForm.id);
        
        setSelectedConsentForm(consentForm);
        const editingData = {
            id: consentForm.id,
            template: consentForm.consent_data || "",
            name: consentForm.name || "",
        };
        console.log("Setting editingTemplate to:", editingData);
        console.log("editingData.id ----->", editingData.id);
        console.log("editingData.id type ----->", typeof editingData.id);
        setEditingTemplate(editingData);
        
        // Add a small delay to check the state after it's set
        setTimeout(() => {
            console.log("editingTemplate state after setting:", editingTemplate);
        }, 100);
        
        setIsDropdownOpen(false);
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
            showSuccess("Consent form deleted successfully!");
        } catch (err) {
            console.error("Delete consent form error:", err);
            showError("Failed to delete consent form. Please try again.");
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
                        
                        {/* Simple Consent Forms Dropdown */}
                        {isDropdownOpen && (
                        <div className={styles.consentFormsDropdown}>
                            <div className={styles.dropdownHeader}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCreateBlankForm}
                                    disabled={savingTemplate}
                                    className={styles.actionButton}
                                >
                                    <i className="fas fa-plus me-2"></i> New Form
                                </Button>
                            </div>
                            
                            <div className={styles.dropdownContent}>
                                {consentFormsLoading ? (
                                    <div className={styles.loadingState}>
                                        <i className="fas fa-spinner fa-spin me-2"></i>
                                        <p>Loading...</p>
                                    </div>
                                ) : consentForms.length > 0 ? (
                                    <div className={styles.consentFormsList}>
                                        {consentForms.map((consentForm) => (
                                            <div
                                                key={consentForm.id}
                                                className={`${styles.consentFormItem} ${
                                                    selectedConsentForm?.id === consentForm.id ? styles.selected : ''
                                                }`}
                                                onClick={() => handleConsentFormClick(consentForm)}
                                            >
                                                <div className={styles.consentFormInfo}>
                                                    <h4 className={styles.consentFormName}>
                                                        {consentForm.name || `Consent Form ${consentForm.id}`}
                                                    </h4>
            
                                                </div>
                                                <div className={styles.consentFormActions}>
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
                                        <small>Create your first consent form</small>
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
                            {/* Right Panel - Form Editor/Preview - Always show */}
                            <div className={`${styles.actionPanel} ${styles.fullWidthActionPanel}`}>
                                <div className={styles.actionPanelHeader}>
                                    <h3 className={styles.panelTitle}>
                                        {editingTemplate
                                            ? "Consent Form Editor"
                                            : "Consent Form Management"}
                                    </h3>
                                </div>
                                <div className={styles.consentActionContent}>
                                    {editingTemplate ? (
                                        <TemplateForm
                                            key={editingTemplate.id || 'new-form'}
                                            mode="consent"
                                            handleFormChange={handleFormChange}
                                            handleSave={handleSaveConsentForm}
                                            saving={savingTemplate}
                                            setIsEditing={setEditingTemplate}
                                            setFormData={setEditingTemplate}
                                            formData={editingTemplate}
                                            template={editingTemplate}
                                            handleCancel={handleCancelForm}
                                            fetchConsentForms={fetchConsentForms}
                                            isSigned={false}
                                            hideLeadSpecificActions={true}
                                        />
                                    ) : (
                                        <div className={styles.defaultConsentInterface}>
                                            <div className={styles.consentPlaceholder}>
                                                <i className="fas fa-file-signature"></i>
                                                <h5>Consent Forms Management</h5>
                                                <p>Select a consent form from the sidebar to edit, or create a new one using the "New Form" button.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
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