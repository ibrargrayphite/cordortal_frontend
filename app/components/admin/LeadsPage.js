"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { 
  AppShell, 
  PageHeader, 
  DataTable, 
  StatusBadge, 
  ConfirmDialog,
  ActionMenu,
  EmptyState,
  CopyableText,
  TableSkeleton
} from './index';
import LeadModal from './LeadModal';
import { useLeads } from '../../hooks/useLeads';
import { useTemplates } from '../../hooks/useTemplates';
import { useToast } from '../Toast';

const columnHelper = createColumnHelper();

const LeadsPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    source: '',
  });
  const [saving, setSaving] = useState(false);

  const { showError, showSuccess } = useToast();
  const leadsHook = useLeads();

  // Fetch data on mount
  useEffect(() => {
    leadsHook.fetchLeads(1, false, '');
  }, []);

  // Lead columns definition
  const leadColumns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Name',
        enableSorting: false,
        cell: ({ row }) => {
          const lead = row.original;
          const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.email;
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--admin-primary)',
                  color: 'var(--admin-primary-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                {fullName[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{fullName}</div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        enableSorting: false,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="email" showIcon={false} />
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        enableSorting: false,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="phone" showIcon={false} />
        ),
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        enableSorting: false,
        cell: ({ getValue }) => (
          <StatusBadge variant="source">
            {getValue() || 'Unknown'}
          </StatusBadge>
        ),
      }),
      columnHelper.accessor('notes_count', {
        header: 'Notes',
        enableSorting: false,
        cell: ({ getValue }) => (
          <StatusBadge variant="notes" count={getValue() || 0} />
        ),
      }),
      columnHelper.accessor('consent_forms_count', {
        header: 'Consent Forms',
        enableSorting: false,
        cell: ({ getValue }) => (
          <StatusBadge variant="consent" count={getValue() || 0} />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <ActionMenu
              actions={[
                {
                  label: 'View Details',
                  onClick: () => handleViewLead(lead.id),
                },
                {
                  label: 'Edit Lead',
                  onClick: () => handleEditLead(lead),
                },
                {
                  label: 'Delete Lead',
                  variant: 'destructive',
                  onClick: () => handleDeleteLead(lead),
                },
              ]}
            />
          );
        },
      }),
    ],
    []
  );


  // Event handlers
  const handleViewLead = useCallback((leadId) => {
    router.push(`/leads/detail?id=${leadId}`);
  }, [router]);

  const handleAddLead = useCallback(() => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      message: '',
      source: '',
    });
    setShowAddModal(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setSelectedLead(lead);
    setFormData({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      message: lead.message || '',
      source: lead.source || '',
    });
    setShowEditModal(true);
  }, []);

  const handleDeleteLead = useCallback((lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  }, []);

  const handleSaveLead = useCallback(async () => {
    try {
      setSaving(true);
      if (showEditModal) {
        await leadsHook.updateLead(selectedLead.id, formData);
      } else {
        await leadsHook.createLead(formData);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedLead(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        source: '',
      });
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }, [showEditModal, selectedLead, formData, leadsHook]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setSaving(true);
      await leadsHook.deleteLead(selectedLead.id);
      setShowDeleteModal(false);
      setSelectedLead(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setSaving(false);
    }
  }, [selectedLead, leadsHook]);


  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
    leadsHook.handleSearch(value);
  }, [leadsHook]);

  // Page header actions
  const pageActions = useMemo(() => {
    return [
      {
        label: 'Add Lead',
        icon: '+',
        onClick: handleAddLead,
      },
    ];
  }, [handleAddLead]);

  // Stats
  const pageStats = useMemo(() => {
    return [
      {
        label: 'Total Leads',
        value: leadsHook.leadsCount || 0,
        variant: 'info',
      },
    ];
  }, [leadsHook.leadsCount]);

  // Breadcrumb
  const breadcrumbItems = [
    { name: 'Lead Management' },
  ];

  return (
    <AppShell
      pageTitle="Lead Management"
      breadcrumbItems={breadcrumbItems}
      actions={{ onAddLead: handleAddLead }}
    >
      <div className="admin-container">
        {/* Page Header */}
        <PageHeader
          title="Lead Management"
          description="Capture, track, and manage leads."
          actions={pageActions}
          stats={pageStats}
        />

        {leadsHook.loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <DataTable
            data={leadsHook.leads}
            columns={leadColumns}
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search leads by name, email, or phone..."
            showPagination={true}
            pageSize={leadsHook.pageSize || 10}
            emptyState={
              <EmptyState
                icon="👥"
                title="No leads found"
                description={
                  leadsHook.searchQuery
                    ? "No leads match your search criteria."
                    : "Start by adding your first lead using the 'Add Lead' button above."
                }
                action={
                  !leadsHook.searchQuery
                    ? {
                        label: 'Add Lead',
                        onClick: handleAddLead,
                      }
                    : null
                }
              />
            }
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <LeadModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onSave={handleSaveLead}
        mode={showEditModal ? 'edit' : 'add'}
        formData={formData}
        onFormChange={(field, value) => {
          setFormData(prev => ({ ...prev, [field]: value }));
        }}
        saving={saving}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead for ${selectedLead?.first_name} ${selectedLead?.last_name}? This action cannot be undone.`}
        confirmText="Delete Lead"
        loading={saving}
      />
    </AppShell>
  );
};

export default LeadsPage;