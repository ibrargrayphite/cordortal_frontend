import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../leads/leads.module.css';
import theme from '../../styles/adminTheme.module.css';
import { DataLoader } from '../LoadingSpinner';
import Pagination from './Pagination';
import ActionButtons from './ActionButtons';

const TemplatesTab = ({ 
  templates, 
  loading, 
  onAddTemplate, 
  onEditTemplate, 
  onDeleteTemplate, 
  deletingTemplateId 
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleViewTemplate = (templateId) => {
    router.push(`/templates/detail?id=${templateId}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(templates.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTemplates = templates.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Modern Templates Header - Same as leads page */}
      <div className={theme.modernHeader}>
        <div className={theme.headerLeft}>
          <h1 className={theme.pageTitle}>Template Management</h1>
          <p className={theme.pageSubtitle}>Create and manage consent form templates</p>
        </div>
        <div className={theme.headerRight}>
          <button
            onClick={onAddTemplate}
            className={theme.primaryButton}
          >
            <i className="fas fa-plus"></i>
            Add New Template
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <DataLoader message="Loading templates..." />
      )}

      {/* Modern Templates Content Card */}
      {!loading && (
        <div className={theme.modernCard}>
          <div className={theme.tableHeader}>
            <div className={styles.tableHeaderContent}>
              <div className={styles.tableHeaderControls}>
                <h3 className={theme.tableTitle}>All Templates</h3>
                <div className={styles.pageSizeWrapper}>
                  <span className={styles.totalLeadsCount}>
                    Total Templates: {templates.length}
                  </span>
                  <span className={styles.perPageText}>Show:</span>
                  <select
                    className={theme.pageSizeSelect}
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className={styles.perPageText}>per page</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>NAME</th>
                  <th className={styles.actionHeader} style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentTemplates.length > 0 ? (
                  currentTemplates.map((template) => (
                    <TemplateRow
                      key={template.id}
                      template={template}
                      onView={handleViewTemplate}
                      onEdit={onEditTemplate}
                      onDelete={onDeleteTemplate}
                      deletingTemplateId={deletingTemplateId}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className={styles.emptyRow}>
                      <div className={styles.emptyState}>
                        <i className="fas fa-file-alt"></i>
                        <h4>No templates found</h4>
                        <p>
                          Start by adding your first template using the
                          "Add Template" button above.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageLoading={false}
          onPageChange={handlePageChange}
          onPrevious={() => handlePageChange(currentPage - 1)}
          onNext={() => handlePageChange(currentPage + 1)}
          showPagination={true}
        />
      )}
    </>
  );
};

// Template Row Component with action buttons
const TemplateRow = React.memo(({ template, onView, onEdit, onDelete, deletingTemplateId }) => {
  return (
    <tr className={styles.tableRow}>
      <td className={styles.modernNameCell}>
        <div className={styles.modernProfileInfo}>
          <div className={styles.modernAvatar}>
            <i
              className="fas fa-file-alt"
              style={{
                color: "#3b82f6",
                fontSize: "1.5rem",
              }}
            ></i>
          </div>
          <div className={styles.modernNameInfo}>
            <div className={styles.modernFullName}>
              {template.name}
            </div>
          </div>
        </div>
      </td>

      <td className={styles.modernActionCell}>
        <ActionButtons
          onView={() => onView(template.id)}
          onEdit={() => onEdit(template)}
          onDelete={() => onDelete(template)}
          deleteDisabled={deletingTemplateId === template.id}
          deleteLoading={deletingTemplateId === template.id}
        />
      </td>
    </tr>
  );
});

TemplateRow.displayName = 'TemplateRow';

export default TemplatesTab; 