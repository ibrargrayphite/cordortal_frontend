import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import styles from '../../leads/leads.module.css';
import LeadRow from './LeadRow';
import { TableSkeleton } from './index';

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
  // Show skeleton loader when loading or pageLoading is true
  if (loading || pageLoading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingState}>
          <TableSkeleton rows={5} columns={7} /> {/* Adjust columns to match table headers */}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div
        className={`${styles.tableContainer} ${fadeOut ? styles.fadeOut : styles.fadeIn}`}
      >
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>SOURCE</TableHead>
              <TableHead className="text-center">NOTES</TableHead>
              <TableHead className="text-center">CONSENT FORMS</TableHead>
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
                <TableCell colSpan={7} className={styles.emptyRow}>
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