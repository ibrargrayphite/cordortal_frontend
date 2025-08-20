import React from 'react';
import theme from '../../styles/adminTheme.module.css';

const ActionButtons = React.memo(({ 
  onView, 
  onEdit, 
  onDelete, 
  viewDisabled = false,
  editDisabled = false,
  deleteDisabled = false,
  viewLoading = false,
  editLoading = false,
  deleteLoading = false,
  showView = true,
  showEdit = true,
  showDelete = true
}) => {
  return (
    <div className={theme.actionButtonsContainer}>
      {showView && (
        <button
          onClick={onView}
          disabled={viewDisabled || viewLoading}
          className={`${theme.smallActionButton} ${theme.smallViewButton}`}
          title="View"
        >
          {viewLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-eye"></i>
          )}
          <span>View</span>
        </button>
      )}
      
      {showEdit && (
        <button
          onClick={onEdit}
          disabled={editDisabled || editLoading}
          className={`${theme.smallActionButton} ${theme.smallEditButton}`}
          title="Edit"
        >
          {editLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-edit"></i>
          )}
          <span>Edit</span>
        </button>
      )}
      
      {showDelete && (
        <button
          onClick={onDelete}
          disabled={deleteDisabled || deleteLoading}
          className={`${theme.smallActionButton} ${theme.smallDeleteButton}`}
          title="Delete"
        >
          {deleteLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-trash"></i>
          )}
          <span>Delete</span>
        </button>
      )}
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons; 