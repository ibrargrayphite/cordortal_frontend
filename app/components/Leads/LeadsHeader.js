import React from 'react';
import styles from '../../leads/leads.module.css';
import theme from '../../styles/adminTheme.module.css';

const LeadsHeader = ({
  leadsCount,
  searchInput,
  searchQuery,
  isSearching,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onAddLead
}) => {
  return (
    <>
      <div className={theme.modernHeader}>
        <div className={styles.headerContent}>
          <div className={theme.headerLeft}>
            <h1 className={theme.pageTitle}>Lead Management</h1>
          </div>
          <div className={theme.headerRight}>
            <button onClick={onAddLead} className={theme.primaryButton}>
              <i className="fas fa-plus me-2"></i>
               Add Lead
            </button>
          </div>
        </div>
      </div>

      <div className={theme.searchSection}>
        <form onSubmit={onSearchSubmit} className={styles.modernSearchForm}>
          <div className={styles.modernSearchInputWrapper}>
            <input
              type="text"
              placeholder="Search leads by name, email, or phone..."
              value={searchInput}
              onChange={onSearchInputChange}
              className={theme.searchInput}
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className={styles.clearSearchButton}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            {isSearching && (
              <div className={styles.modernSearchLoading}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            )}
          </div>
        </form>
        {searchQuery && (
          <div className={styles.modernSearchResults}>
            {leadsCount} leads found for "{searchQuery}"
          </div>
        )}
      </div>
    </>
  );
};

export default LeadsHeader; 