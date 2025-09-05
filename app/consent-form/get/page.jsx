"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
//import SignatureCanvas from "react-signature-canvas";
import { ButtonLoader, DataLoader } from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";
import styles from "../../consent-form/get/consentForm.module.css";
import theme from "../../styles/adminTheme.module.css";
const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
    ssr: false,
});

function ConsentFormPage() {
    const { showError } = useToast();
    const searchParams = useSearchParams();
    const [consentForm, setConsentForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signatureError, setSignatureError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const signatureCanvasRef = useRef(null);
    const token = searchParams.get("token");


    function base64ToBlob(base64, mime) {
        const byteChars = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }
        return new Blob([new Uint8Array(byteNumbers)], { type: mime });
    }

    // Fetch consent form
    useEffect(() => {
        console.log("token>>", token);

        if (!token) {
            showError("Invalid or missing token.");
            setLoading(false);
            return;
        }

        const fetchConsentForm = async () => {
            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                if (!baseUrl) {
                    throw new Error("Base URL is not defined.");
                }

                const response = await fetch(`${baseUrl}/leads/consent-form/get/${token}/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Failed to fetch consent form.");
                }

                const data = await response.json();
                if (!data) {
                    throw new Error("No consent form data returned.");
                }

                setConsentForm(data);

            } catch (error) {
                console.error("Error fetching consent form:", error);

                if (token) {
                    showError(error.message || "Failed to load consent form. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchConsentForm();
    }, [token]);


    const handleOpenSignatureModal = () => {
        if (consentForm?.is_signed) {
            showError("This form is already signed.");
            return;
        }
        setShowSignatureModal(true);
        setSignatureError("");
        if (signatureCanvasRef.current) {
            signatureCanvasRef.current.clear();
        }
    };

    const handleCloseSignatureModal = () => {
        setShowSignatureModal(false);
        setSignatureError("");
    };

    // Save signature
    const handleSaveSignature = async () => {
        if (!signatureCanvasRef.current || signatureCanvasRef.current.isEmpty()) {
            setSignatureError("Please provide a signature.");
            return;
        }

        try {
            setIsSubmitting(true);
            const canvas = signatureCanvasRef.current.getCanvas();
            const signatureDataUrl = canvas.toDataURL("image/png");
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const formData = new FormData();
            const sign = base64ToBlob(signatureDataUrl, "image/png");
            formData.append("sign", sign);

            const response = await fetch(`${baseUrl}/leads/consent-form/sign/${token}/`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to sign consent form.");
            }

            setConsentForm((prev) => ({ ...prev, is_signed: true }));

            window.location.href = window.location.origin;

        } catch (error) {
            console.error("Error signing consent form:", error);
            showError(error.message || "Failed to sign consent form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const canvasProps = useMemo(() => ({
        className: styles.signatureCanvas,
        width: 500,
        height: 200,
    }), []);

    if (loading) {
        return <DataLoader message="Loading consent form..." />;
    }

    if (!consentForm) {
        return (
            <div className={styles.adminContainer}>
                <div className={theme.modernHeader}>
                    <h1 className={theme.pageTitle}>Consent Form</h1>
                </div>
                <div className={styles.consentPlaceholder}>
                    <i className="fas fa-file-signature"></i>
                    <h5>Consent Form Not Found</h5>
                    <p>The requested consent form could not be loaded. Please check the link and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            <div className={theme.modernHeader}>
                <h1 className={theme.pageTitle}>
                    {consentForm.name || "Consent Form"}
                </h1>
                <div className={styles.consentMeta}>
                    <span
                        className={`${styles.statusBadge} ${consentForm.is_signed ? styles.signed : styles.unsigned}`}
                    >
                        {consentForm.is_signed ? "Signed" : "Unsigned"}
                    </span>
                    {consentForm.lead_email && (
                        <small className={styles.consentSubtitle}>
                            Lead: {consentForm.lead_email}
                        </small>
                    )}
                </div>
            </div>

            <div className={styles.consentInterface}>
                <div className={styles.consentPreview}>
                    <div className={styles.previewHeader}>
                        <h5>Consent Form Preview</h5>
                    </div>
                    <div
                        className={styles.templatePreview}
                        dangerouslySetInnerHTML={{
                            __html: consentForm || "<p>No content available</p>",
                        }}
                    />
                </div>

                <div className={styles.editActions}>
                    <Button
                        variant="default"
                        onClick={handleOpenSignatureModal}
                        disabled={consentForm.is_signed || isSubmitting}
                        className={theme.successButton}
                    >
                        {isSubmitting ? (
                            <ButtonLoader message="Signing..." />
                        ) : (
                            <>
                                <i className="fas fa-signature me-2"></i> Get Signed
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Dialog
                open={showSignatureModal}
                onOpenChange={handleCloseSignatureModal}
            >
                <DialogContent className={styles.signatureModal}>
                    <DialogHeader>
                        <DialogTitle>Add Your Signature</DialogTitle>
                    </DialogHeader>
                    <div className={styles.signatureCanvasWrapper}>
                        <SignatureCanvas
                            ref={signatureCanvasRef}
                            penColor="black"
                            canvasProps={canvasProps}
                        />
                        {signatureError && (
                            <div className={styles.signatureError}>{signatureError}</div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCloseSignatureModal}
                            className={theme.secondaryButton}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSaveSignature}
                            className={theme.successButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <ButtonLoader message="Saving..." /> : "Save Signature"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function Page() {
    return (
      <Suspense fallback={<DataLoader message="Loading consent form..." />}>
        <ConsentFormPage />
      </Suspense>
    );
  }