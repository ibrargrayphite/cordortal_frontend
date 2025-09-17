import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "../../components/Toast";
import SendLinkModal from '../SendLinkModal/SendLinkModal';
import styles from "../../templates/detail/templateDetail.module.css";
import theme from "../../styles/adminTheme.module.css";
import { getCookie } from "../../utils/cookiesHanlder";
import { ButtonLoader } from "../LoadingSpinner";
import { getAuthHeaders, logout } from "../../utils/auth";
import BundledEditor from "@/app/components/BundledEditor/BundledEditor";
import { Skeleton } from '../Skeleton'; // Import Skeleton component
import { consentFormsAPI } from "@/app/utils/api";

function TemplateForm({
  mode = "template",
  handleFormChange,
  handleSave,
  saving,
  setIsEditing,
  setFormData,
  formData,
  template,
  handleCancel,
  lead,
  fetchConsentForms,
  isSigned = false,
  fromNotesFlow = false,
  setFromNotesFlow = () => { },
}) {
  const { showError: originalShowError, showSuccess: originalShowSuccess } = useToast();
  const showError = useCallback(
    (message) => {
      originalShowError(message);
    },
    [originalShowError]
  );
  const showSuccess = useCallback(
    (message) => {
      originalShowSuccess(message);
    },
    [originalShowSuccess]
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [hasSignature, setHasSignature] = useState(isSigned);
  const [signatureData, setSignatureData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const signatureCanvasRef = useRef(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // New state for skeleton

  // Initial load completion
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  function base64ToBlob(base64, mime) {
    const byteChars = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: mime });
  }

  // Handler for Send Link button - opens modal
  const handleGetLink = () => {
    if (!formData?.id) {
      showError("Consent form ID is missing.");
      return;
    }
    setShowSendLinkModal(true);
  };

  // Handler for actually sending the link with email data
  const handleSendLinkWithEmail = async (emailData) => {
    try {
      setIsSendingLink(true);
      const domain = window.location.origin;
      const payload = {
        consent_form_id: formData.id,
        domain: `${domain}/consent-form/get/`,
        email_to: emailData.to,
        email_subject: emailData.subject,
        email_message: emailData.message,
      };
      console.log("Payload ---->", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/leads/consent-form/create-link/`,
        {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to send link.";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text.slice(0, 100));
          errorMessage = `Server returned ${response.status}: ${text.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      showSuccess("Link sent successfully!");
      setShowSendLinkModal(false);
    } catch (error) {
      console.error("Error sending link:", error);
      showError(error.message || "Failed to send link. Please try again.");
    } finally {
      setIsSendingLink(false);
    }
  };

  // Signature modal handlers
  const handleOpenSignatureModal = () => {
    if (isSigned) {
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

  const handleSaveSignature = () => {
    if (!signatureCanvasRef.current || signatureCanvasRef.current.isEmpty()) {
      setSignatureError("Please provide a signature.");
      return;
    }
    const canvas = signatureCanvasRef.current.getCanvas();
    const signatureDataUrl = canvas.toDataURL("image/png");
    setSignatureData(signatureDataUrl);
    setHasSignature(true);
    handleCloseSignatureModal();
  };

  // Consent form save
  const handleSaveConsentForm = async () => {
    if (isSigned) {
      showError("This form is already signed.");
      return;
    }
    // if (formData.lead !== false && !lead?.id) {
    //   showError("Lead ID is missing.");
    //   return;
    // }
    if (!formData?.template) {
      showError("Consent data is missing.");
      return;
    }
    if (!formData?.name?.trim()) {
      showError("Please enter a consent form name.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const consentData = hasSignature
        ? `${formData.template}<div class="signature-section"><h4>Signature</h4><img src="${signatureData}" alt="Signature"/><p>Signed on ${new Date().toLocaleDateString()}</p></div>`
        : formData.template;

      const payload = {
        consent_data: consentData,
        name: formData.name,
        is_signed: hasSignature,
        ...(formData.lead !== false && { lead: lead.id }),
        ...(fromNotesFlow && { notes_text: formData.notes_text || "" }),
      };

      if (formData.lead === false) {
        payload.lead = false;
      }

      const response = await fetch(
        formData.id
          ? `${baseUrl}/leads/consent-forms/${formData.id}/`
          : `${baseUrl}/leads/consent-forms/`,
        {
          method: formData.id ? "PUT" : "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to save consent form.";
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          errorMessage = responseData.detail || errorMessage;
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text.slice(0, 100));
          errorMessage = `Server returned ${response.status}: ${text.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      // Get the saved consent form data from response
      const savedConsentForm = await response.json();

      showSuccess(hasSignature ? "Consent form signed!" : "Consent form saved!");
      await fetchConsentForms();

      // Update formData with the ID from the saved consent form
      setFormData((prev) => ({
        ...prev,
        id: savedConsentForm.id,
        is_signed: hasSignature,
      }));
      setPreviewMode(true);
      setFromNotesFlow(false);

      if (handleSave) {
        await handleSave(savedConsentForm);
      }
    } catch (error) {
      console.error(error);
      showError(error.message || "Failed to save consent form.");
    }
  };

  // Delete consent form
  const handleDeleteConsentForm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (formData?.id) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/leads/consent-forms/${formData.id}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (response.status === 401) {
          logout();
          window.location.replace("/login");
          return;
        }
        if (!response.ok && response.status !== 204) {
          const contentType = response.headers.get("content-type");
          let errorMessage = "Delete failed";
          if (contentType && contentType.includes("application/json")) {
            const responseData = await response.json();
            errorMessage = responseData.detail || errorMessage;
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text.slice(0, 100));
            errorMessage = `Server returned ${response.status}: ${text.slice(0, 100)}...`;
          }
          throw new Error(errorMessage);
        }
      }
      setIsEditing(false);
      setFormData(null);
      setHasSignature(false);
      setSignatureData(null);
      await fetchConsentForms?.();
      handleCancel();
    } catch (error) {
      console.error(error);
      showError("Failed to delete consent form.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!formData) return null;

  // Skeleton loader
  if (!hasLoaded) {
    return (
      <div>
        {/* Skeleton for name input section */}
        <div className="mb-3 space-y-2">
          <Skeleton width="150px" height="1rem" />
          <Skeleton width="100%" height="2.5rem" />
        </div>

        {/* Skeleton for editor and preview */}
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

        {/* Skeleton for action buttons */}
        <div className={styles.editActions}>
          <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
          {mode === "consent" && (
            <>
              <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
              <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
              <Skeleton width="120px" height="2.5rem" style={{ marginRight: '1rem' }} />
            </>
          )}
          <Skeleton width="120px" height="2.5rem" /> {/* Cancel */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 space-y-2">
        <Label htmlFor="template-name" className="text-black dark:text-black">
          {mode === "template" || mode === "create" ? "Template Name" : "Consent Form Name"}
        </Label>
        <Input
          id="template-name"
          type="text"
          value={formData.name || ""}
          onChange={(e) => handleFormChange("name", e.target.value)}
          placeholder={(mode === "template" || mode === "create")
            ? "Enter template name"
            : "Enter consent form name"}
          maxLength={255}
          disabled={isSigned}
          className="bg-white text-black"
        />
      </div>

      <div className={styles.fullPageEditorContainer}>
        <div className={styles.editorHeader}>
          {!isSigned && (
            <h5 className={styles.editorTitle}>
              <i className="fas fa-edit me-2"></i> Content Editor
            </h5>
          )}
          <h5 className={styles.previewTitle}>
            <i className="fas fa-eye me-2"></i> Live Preview
          </h5>
        </div>

        <div className={`${styles.editorContainer} ${isSigned ? styles.fullPreview : ""}`}>
          {isSigned ? (
            <div className={`${styles.previewSection} ${styles.fullWidthPreview}`}>
              <div className={styles.previewContainer}>
                <div
                  className={styles.htmlPreview}
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.template ||
                      '<p class="text-muted">No content available.</p>',
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.editorSection}>
                <BundledEditor
                  value={formData.template || ""}
                  onEditorChange={(newValue) => handleFormChange("template", newValue)}
                  key={`template-editor-${template?.id || "new"}`}
                  init={{
                    height: "100%", // Use flexible height instead of fixed
                    menubar: false,
                    plugins: ["lists", "autolink", "link", "pagebreak", "image"],
                    toolbar:
                      "styles | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    images_upload_handler: async (blobInfo) => {
                      try {
                        const csrftoken = getCookie("csrftoken");
                        const sessionId = getCookie("sessionid");
                        let fd = new FormData();
                        fd.append("upload", blobInfo.blob(), blobInfo.filename());
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/leads/image/upload/`,
                          {
                            method: "POST",
                            credentials: "include",
                            body: fd,
                            headers: {
                              Cookie: `csrftoken=${csrftoken}; sessionid=${sessionId}`,
                              "X-CSRFToken": csrftoken || "",
                            },
                          }
                        );
                        if (!res.ok) throw new Error("Upload failed");
                        const json = await res.json();
                        return json.url;
                      } catch (err) {
                        console.error(err);
                        throw new Error("Image upload failed.");
                      }
                    },
                  }}
                />
              </div>

              <div className={styles.previewSection}>
                <div className={styles.previewContainer}>
                  <div
                    className={styles.htmlPreview}
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.template ||
                        '<p className="text-black">Start typing to see the preview...</p>',
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.editActions}>
        {mode === "consent" ? (
          <>
            {isSigned ? (
              <>
                <Button
                  variant="outline-danger"
                  onClick={handleDeleteConsentForm}
                  disabled={saving || isDeleting || isSendingLink || !formData.id}
                  className={theme.dangerButton}
                >
                  {isDeleting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i> Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-2"></i> Delete
                    </>
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                  disabled={saving || isDeleting || isSendingLink}
                  className={styles.cancelButton}
                >
                  <i className="fas fa-times me-2"></i> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleOpenSignatureModal}
                  disabled={saving || isDeleting || isSendingLink}
                  className={styles.primaryActionButton}
                >
                  <i className="fas fa-signature me-2"></i> Get Signed
                </Button>
                <Button
                  onClick={handleGetLink}
                  disabled={saving || isDeleting || isSendingLink}
                  className={styles.primaryActionButton}
                >
                  {isSendingLink ? (
                    <ButtonLoader message="Sending..." />
                  ) : (
                    <>
                      <i className="fas fa-link me-2"></i> Send Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSaveConsentForm}
                  disabled={saving || isDeleting || isSendingLink}
                  className={styles.primaryActionButton}
                >
                  {saving ? (
                    <ButtonLoader message="Saving..." />
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i> Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleDeleteConsentForm}
                  disabled={saving || isDeleting || isSendingLink || !formData.id}
                  className={theme.dangerButton}
                >
                  {isDeleting ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i> Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-2"></i> Delete
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(null);
                    handleCancel();
                  }}
                  disabled={saving || isDeleting || isSendingLink}
                  className={styles.cancelButton}
                >
                  <i className="fas fa-times me-2"></i> Cancel
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name?.trim() || !formData.template?.trim()}
              className={styles.primaryActionButton}
            >
              {saving ? <ButtonLoader message="Saving..." /> : <><i className="fas fa-save me-2"></i> Save Changes</>}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleCancel();
                setIsEditing(false);
                setFormData({ name: "", template: "" });
              }}
              disabled={saving}
              className={styles.cancelButton}
            >
              <i className="fas fa-times me-2"></i> Cancel
            </Button>
          </>
        )}
      </div>

      {mode === "consent" && (
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
                canvasProps={{ className: styles.signatureCanvas, width: 500, height: 200 }}
              />
              {signatureError && <div className={styles.signatureError}>{signatureError}</div>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseSignatureModal}
                className={`${styles.cancelButton} min-w-[100px]`}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveSignature}
                className={`${theme.successButton} min-w-[120px]`}
              >
                Save Signature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Link Modal */}
      <SendLinkModal
        show={showSendLinkModal}
        onHide={() => setShowSendLinkModal(false)}
        onSendLink={handleSendLinkWithEmail}
        leadData={lead}
        formData={formData}
        isSending={isSendingLink}
      />
    </div>
  );
}

export default TemplateForm;