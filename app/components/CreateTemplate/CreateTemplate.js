import React from 'react'
import styles from "../../templates/detail/templateDetail.module.css";
import TemplateForm from '../TemplateForm/TemplateForm';


function CreateTemplate({
    handleFormChange,
    handleSave,
    saving,
    setIsEditing,
    setFormData,
    formData,
}) {
    return (
        <div className={styles.templateDetailsSection}>
            <div className={styles.templateDetailsCard}>
                <div className={styles.templateDetailsHeader}>
                    <h3 className={styles.templateDetailsTitle}>
                        <i className="fas fa-file-alt me-2"></i> Template Details
                    </h3>
                    <Button
                        onClick={() => setIsEditing(true)}
                        className={styles.editButton}
                    >
                        <i className="fas fa-edit me-2"></i> Add new template
                    </Button>
                </div>
                <div className={styles.templateDetailsContent}>
                    <TemplateForm
                        handleFormChange={handleFormChange}
                        handleSave={handleSave}
                        saving={saving}
                        setIsEditing={setIsEditing}
                        setFormData={setFormData}
                        formData={formData}
                    />

                </div>
            </div>
        </div>
    )
}

export default CreateTemplate
