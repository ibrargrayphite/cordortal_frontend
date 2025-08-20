import React from "react";
import { Button, Form, Card } from "react-bootstrap";
import styles from "../../templates/detail/templateDetail.module.css";
import leadStyle from "../../leads/leads.module.css";
import { getCookie } from "../../utils/cookiesHanlder";
import { ButtonLoader } from "../LoadingSpinner";
import theme from "../../styles/adminTheme.module.css";

// Import BundledEditor
import BundledEditor from "@/app/components/BundledEditor/BundledEditor";

function TemplateForm({
  handleFormChange,
  handleSave,
  saving,
  setIsEditing,
  setFormData,
  formData,
  template,
  handleCancel,
}) {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Template Name</Form.Label>
        <Form.Control
          type="text"
          value={formData.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
          placeholder="Enter template name"
          maxLength={255}
        />
      </Form.Group>

      {/* Full Page Rich Text Editor with Live Preview */}
      <div className={styles.fullPageEditorContainer}>
        <div className={styles.editorHeader}>
          <h5 className={styles.editorTitle}>
            <i className="fas fa-edit me-2"></i> Content Editor
          </h5>
          <h5 className={styles.previewTitle}>
            <i className="fas fa-eye me-2"></i> Live Preview
          </h5>
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.editorSection}>
            <BundledEditor
              value={formData.template}
              onEditorChange={(newValue) =>
                handleFormChange("template", newValue)
              }
              key={`template-editor-${template?.id || "new"}`}
              onChange={() => {}}
              init={{
                height: 700,
                menubar: false,
                plugins: ["lists", "autolink", "link", "pagebreak", "image"],
                toolbar:
                  "styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                spellchecker_rpc_url: "localhost/ephox-spelling",
                contextmenu: false,
                // Simplified image upload handler for client-side only
                images_upload_handler: async (blobInfo, progress) => {
                  try {
                    // create a FormData object
                    const csrftoken = getCookie("csrftoken");
                    const sessionId = getCookie("sessionid");

                    let formData = new FormData();
                    formData.append(
                      "upload",
                      blobInfo.blob(),
                      blobInfo.filename()
                    );

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/ckeditor/image_upload/`,
                      {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                        headers: {
                          Cookie: `csrftoken=${csrftoken}; sessionid=${sessionId}`,
                          "X-CSRFToken": csrftoken || "",
                        },
                      }
                    );

                    if (!res.ok) {
                      throw new Error("Upload failed: " + res.statusText);
                    }

                    const json = await res.json();
                    return json.url;
                  } catch (error) {
                    console.error("Image upload error:", error);
                    // Return a placeholder image or throw error
                    throw new Error("Image upload failed. Please try again.");
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
        </div>
      </div>

      <div className={styles.editActions}>
        <Button
          onClick={handleSave}
          disabled={saving}
          className={theme.successButton}
        >
          {saving ? (
            <div className={styles.buttonLoaderContainer}>
              <ButtonLoader message="Saving..." />
            </div>
          ) : (
            <>
              <i className="fas fa-save me-2"></i> Save Changes
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setIsEditing(false);
            template &&
              setFormData({
                name: template.name,
                template: template.template,
              });
            handleCancel?.();
          }}
          className={theme.secondaryButton}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default TemplateForm;
