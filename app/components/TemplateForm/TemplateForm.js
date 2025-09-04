import React, { useState, useRef, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "../../components/Toast";
import styles from "../../templates/detail/templateDetail.module.css";
import theme from "../../styles/adminTheme.module.css";
import { getCookie } from "../../utils/cookiesHanlder";
import { ButtonLoader } from "../LoadingSpinner";
import { getAuthHeaders, logout } from "../../utils/auth";
import BundledEditor from "@/app/components/BundledEditor/BundledEditor";

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
  setFromNotesFlow = () => {},
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
  const signatureCanvasRef = useRef(null);
  const [previewMode, setPreviewMode] = useState(false);

  function base64ToBlob(base64, mime) {
    const byteChars = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: mime });
  }

  // Handler for Send Link button
  const handleGetLink = async () => {
    if (!formData?.id) {
      showError("Consent form ID is missing.");
      return;
    }

    try {
      setIsSendingLink(true);
      const domain = window.location.origin;
      const payload = {
        consent_form_id: formData.id,
        domain: `${domain}/consent-form/get/`,
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

      showSuccess("Link is sent successfully.");
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
    if (!lead?.id) {
      showError("Lead ID is missing.");
      return;
    }
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
        lead: lead.id,
        ...(fromNotesFlow && { notes_text: formData.notes_text || "" }),
      };

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

      showSuccess(hasSignature ? "Consent form signed!" : "Consent form saved!");
      await fetchConsentForms();
      setFormData((prev) => ({
        ...prev,
        is_signed: hasSignature,
      }));
      setPreviewMode(true);
      setFromNotesFlow(false);
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

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>{mode === "template" ? "Template Name" : "Consent Form Name"}</Form.Label>
        <Form.Control
          type="text"
          value={formData.name || ""}
          onChange={(e) => handleFormChange("name", e.target.value)}
          placeholder={mode === "template" ? "Enter template name" : "Enter consent form name"}
          maxLength={255}
          disabled={isSigned}
        />
      </Form.Group>

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
                    height: 700,
                    menubar: false,
                    plugins: ["lists", "autolink", "link", "pagebreak", "image"],
                    toolbar:
                      "styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                    images_upload_handler: async (blobInfo) => {
                      try {
                        const csrftoken = getCookie("csrftoken");
                        const sessionId = getCookie("sessionid");
                        let fd = new FormData();
                        fd.append("upload", blobInfo.blob(), blobInfo.filename());
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/ckeditor/image_upload/`,
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
                        '<p class="text-muted">Start typing to see the preview...</p>',
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
                  className={theme.secondaryButton}
                >
                  <i className="fas fa-times me-2"></i> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleOpenSignatureModal}
                  disabled={saving || isDeleting || isSendingLink}
                  className={theme.successButton}
                >
                  <i className="fas fa-signature me-2"></i> Get Signed
                </Button>
                <Button
                  onClick={handleGetLink}
                  disabled={saving || isDeleting || isSendingLink}
                  className={theme.successButton}
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
                  className={theme.primaryButton}
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
                  className={theme.secondaryButton}
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
              className={theme.primaryButton}
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
              className={theme.secondaryButton}
            >
              <i className="fas fa-times me-2"></i> Cancel
            </Button>
          </>
        )}
      </div>

      {mode === "consent" && (
        <Modal
          show={showSignatureModal}
          onHide={handleCloseSignatureModal}
          centered
          className={styles.signatureModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Your Signature</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.signatureCanvasWrapper}>
              <SignatureCanvas
                ref={signatureCanvasRef}
                penColor="black"
                canvasProps={{ className: styles.signatureCanvas, width: 500, height: 200 }}
              />
              {signatureError && <div className={styles.signatureError}>{signatureError}</div>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={handleCloseSignatureModal}
              className={theme.secondaryButton}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveSignature}
              className={theme.successButton}
            >
              Save Signature
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Form>
  );
}

export default TemplateForm;