import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import styles from '../../leads/leads.module.css';
import LeadRow from './LeadRow';

const LeadsTable = ({ 
  leads, 
  loading, 
  fadeOut, 
  pageLoading, 
  onEdit, 
  onDelete, 
  onView, 
  editingId, 
  viewingId 
}) => {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingState}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading leads...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* <div className={styles.modernContentHeader}>
        <div className={styles.contentHeaderLeft}>
         
        </div>
      </div> */}

      <div
        className={`${styles.tableContainer} ${fadeOut ? styles.fadeOut : styles.fadeIn} ${pageLoading ? styles.loading : ""}`}
      >
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>SOURCE</TableHead>
              <TableHead className={styles.actionHeader} style={{ textAlign: "center" }}>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  editingId={editingId}
                  viewingId={viewingId}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className={styles.emptyRow}>
                  <div className={styles.emptyState}>
                    <i className="fas fa-users"></i>
                    <h4>No leads found</h4>
                    <p>
                      Start by adding your first lead using the "Add Lead" button above.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsTable; 