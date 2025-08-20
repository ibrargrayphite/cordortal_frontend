import React from 'react';
import styles from '../../leads/leads.module.css';
import theme from '../../styles/adminTheme.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  pageLoading, 
  onPageChange, 
  onPrevious, 
  onNext,
  showPagination = true 
}) => {
  if (!showPagination || totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.modernPaginationWrapper}>
      <div className={styles.modernPaginationControls}>
        <button
          onClick={onPrevious}
          disabled={currentPage === 1 || pageLoading}
          className={`${styles.modernPaginationButton} ${theme.secondaryButton} ${currentPage === 1 ? styles.disabled : ""}`}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className={styles.modernPageNumbers}>
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={pageLoading}
                  className={`${styles.modernPageButton} ${currentPage === pageNum ? theme.primaryButton : theme.secondaryButton} ${currentPage === pageNum ? styles.modernActivePage : ""}`}
                >
                  {pageNum}
                </button>
              );
            }
          )}
        </div>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages || pageLoading}
          className={`${styles.modernPaginationButton} ${theme.secondaryButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination; 