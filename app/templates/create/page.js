"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from '../../components/ui/button';
import { useRouter } from "next/navigation";
import { getAuthHeaders, isAuthenticated, logout } from "../../utils/auth";
import { useToast } from "../../components/Toast";
import { PageLoader } from "../../components/LoadingSpinner";
import styles from "../detail/templateDetail.module.css";
import theme from "../../styles/adminTheme.module.css";
// import TemplateForm from "../../components/TemplateForm/TemplateForm";
const TemplateForm = dynamic(
    () => import("../../components/TemplateForm/TemplateForm"),
    { ssr: false, loading: () => <PageLoader message="Loading editor..." /> }
);
import { fetchPagesData } from "@/app/utils/fetchPagesData";

const TemplateDetailClient = () => {
    const [orgData, setOrgData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        template: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();
    const { showError, showSuccess } = useToast();

    const fetchOrgData = async () => {
        try {
            const data = await fetchPagesData();
            setOrgData(data);
        } catch (err) {
            console.error("Org data fetch error:", err);
        }
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.replace("/login");
            return;
        }
    }, []);

    useEffect(() => {
        fetchOrgData();
        setFadeIn(true);
    }, []);

    const handleLogout = () => {
        logout();
        window.location.replace("/login");
    };

    const handleBackToTemplates = () => {
        router.push("/leads?tab=templates");
    };

    const handleSaveTemplate = async () => {
        try {
            setSaving(true);
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const payload = {
                name: formData.name,
                template: formData.template,
            };

            let response;

            response = await fetch(`${baseUrl}/leads/organization-templates/`, {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 401) {
                logout();
                window.location.replace("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showSuccess("Template created successfully!");

            setFormData({ name: "", template: "" });
            handleBackToTemplates();
        } catch (err) {
            console.error("Template save error:", err);
            showError("Failed to save template. Please try again.");
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

    return (
        <div
            className={`${styles.templateDetailContainer} ${fadeIn ? styles.fadeIn : ""
                }`}
        >
            {/* Modern Header */}
            <div className={theme.domainHeader}>
                <div className={styles.headerContent}>
                    <h1 className={theme.domainName}>
                        {orgData?.name || orgData?.title || "Clinic Admin"}
                    </h1>
                    <Button variant="destructive" onClick={handleLogout} className={theme.logoutButton}>
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {/* Simple Content Header */}
                <div className={styles.simpleContentHeader}>
                    <div className={styles.templateInfo}>
                        <Button variant="ghost" onClick={handleBackToTemplates} className={theme.backButton}>
                            <i className="fas fa-arrow-left me-2"></i> Back to Templates
                        </Button>
                    </div>
                </div>

                {/* Template Details Section */}
                <div className={styles.templateDetailsSection}>
                    <div className={styles.templateDetailsCard}>
                        <div className={styles.templateDetailsHeader}>
                            <h3 className={styles.templateDetailsTitle}>
                                <i className="fas fa-file-alt me-2"></i> Add new template
                            </h3>
                        </div>
                        <div className={styles.templateDetailsContent}>
                            <TemplateForm
                                handleFormChange={handleFormChange}
                                handleSave={handleSaveTemplate}
                                saving={saving}
                                setIsEditing={setIsEditing}
                                setFormData={setFormData}
                                formData={formData}
                                handleCancel={() => {
                                    router.push("/leads?tab=templates");
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function TemplateCreatePage() {
    return <TemplateDetailClient />;
}  
