import React from 'react';
import styles from '../../leads/leads.module.css';
import ActionButtons from './ActionButtons';

const LeadRow = React.memo(({ 
  lead, 
  onEdit, 
  onDelete, 
  onView, 
  editingId, 
  viewingId 
}) => {
  return (
    <tr key={lead.id} className={styles.tableRow}>
      <td className={styles.modernNameCell}>
        <div className={styles.modernProfileInfo}>
          <div className={styles.modernAvatar}>
            <img
              src={`https://ui-avatars.com/api/?name=${lead.first_name}+${lead.last_name}&background=3b82f6&color=fff&size=40`}
              alt="Avatar"
            />
          </div>
          <div className={styles.modernNameInfo}>
            <div className={styles.modernFullName}>
              {lead.first_name} {lead.last_name}
            </div>
          </div>
        </div>
      </td>
      <td className={styles.modernEmailCell}>
        <a
          href={`mailto:${lead.email}`}
          className={styles.modernEmailLink}
        >
          {lead.email}
        </a>
      </td>
      <td className={styles.modernPhoneCell}>
        <a
          href={`tel:${lead.phone}`}
          className={styles.modernPhoneLink}
        >
          {lead.phone}
        </a>
      </td>
      <td className={styles.modernSourceCell}>
        {lead.source ? (
          <span className={styles.modernSourceTag}>
            {lead.source}
          </span>
        ) : (
          <span className={styles.modernNoSource}>
            Not specified
          </span>
        )}
      </td>
      <td className={styles.modernActionCell}>
        <ActionButtons
          onView={() => onView(lead.id)}
          onEdit={() => onEdit(lead)}
          onDelete={() => onDelete(lead)}
          viewDisabled={viewingId === lead.id}
          editDisabled={editingId === lead.id}
          viewLoading={viewingId === lead.id}
          editLoading={editingId === lead.id}
        />
      </td>
    </tr>
  );
});

LeadRow.displayName = 'LeadRow';

export default LeadRow; 