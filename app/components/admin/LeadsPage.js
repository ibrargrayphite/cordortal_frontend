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
import { Plus } from "lucide-react";

const columnHelper = createColumnHelper();

const LeadsPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [sorting, setSorting] = useState([]);
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
      columnHelper.accessor(
        row => `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email,
        {
          id: 'full_name',
          header: () => <span style={{ fontWeight: 'bold' }}>Name</span>,
          enableSorting: true,
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
        }
      )
      ,
      columnHelper.accessor('email', {
        header: () => <span style={{ fontWeight: 'bold' }}>Email</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="email" showIcon={false} />
        ),
      }),
      columnHelper.accessor('phone', {
        header: () => <span style={{ fontWeight: 'bold' }}>Phone</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="phone" showIcon={false} />
        ),
      }),
      columnHelper.accessor('source', {
        header: () => <span style={{ fontWeight: 'bold' }}>Source</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <StatusBadge variant="source">
            {getValue() || 'Unknown'}
          </StatusBadge>
        ),
      }),
      columnHelper.accessor('notes_count', {
        header: () => <span style={{ fontWeight: 'bold' }}>Notes</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <StatusBadge variant="notes" count={getValue() || 0} />
        ),
      }),
      columnHelper.accessor('consent_count', {
        header: () => <span style={{ fontWeight: 'bold' }}>Consent Forms</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <StatusBadge variant="consent" count={getValue() || 0} />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span style={{ fontWeight: 'bold' }}>Actions</span>,
        enableSorting: false,
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
    // Update local state immediately for UI responsiveness
    setSearchInput(value);
    // Trigger debounced search
    leadsHook.handleSearch(value);
  }, [leadsHook]);

  // Page header actions
  const pageActions = useMemo(() => {
    return [
      {
        label: 'Add Lead',
        icon: <Plus size={18} />,
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
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search leads ..."
          searchLoading={leadsHook.isSearching}
        />

        {leadsHook.loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <DataTable
            data={leadsHook.leads}
            columns={leadColumns}
            searchValue={searchInput}
            sorting={sorting}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search leads by name, email, or phone..."
            showPagination={false}
            pageSize={leadsHook.pageSize || 10}
            searchLoading={leadsHook.isSearching}
            emptyState={
              <EmptyState
                icon="👥"
                title="No leads found"
                description={
                  leadsHook.searchQuery || leadsHook.isSearching
                    ? leadsHook.isSearching
                      ? "Searching..."
                      : "No leads match your search criteria."
                    : "Start by adding your first lead using the 'Add Lead' button above."
                }
                action={
                  !leadsHook.searchQuery && !leadsHook.isSearching
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

        {/* Custom Pagination Controls */}
        {!leadsHook.loading && leadsHook.totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Page Info and Page Size */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--admin-muted-foreground)'
              }}>
                Page {leadsHook.currentPage} of {leadsHook.totalPages}
                {leadsHook.totalPages === 1 && ` (${leadsHook.leadsCount} items)`}
              </div>

              {/* Page Size Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  color: 'var(--admin-muted-foreground)'
                }}>
                  Show:
                </label>
                <select
                  value={leadsHook.pageSize}
                  onChange={(e) => leadsHook.handlePageSizeChange(Number(e.target.value))}
                  className="admin-input"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.875rem',
                    minWidth: '60px'
                  }}
                >
                  {[5, 10, 20, 50, 100].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              {/* To Start Button */}
              <button
                onClick={() => leadsHook.handlePageChange(1)}
                disabled={leadsHook.currentPage === 1}
                className="admin-button admin-button-secondary"
                style={{ padding: '0.5rem' }}
                title="Go to first page"
              >
                ⏮
              </button>

              {/* Previous Page Button */}
              <button
                onClick={leadsHook.handlePreviousPage}
                disabled={leadsHook.currentPage === 1}
                className="admin-button admin-button-secondary"
                style={{ padding: '0.5rem' }}
                title="Previous page"
              >
                ←
              </button>

              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: '0.25rem', margin: '0 0.5rem' }}>
                {(() => {
                  const currentPage = leadsHook.currentPage;
                  const totalPages = leadsHook.totalPages;
                  const pages = [];

                  // Show first page
                  if (currentPage > 2) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => leadsHook.handlePageChange(1)}
                        className="admin-button admin-button-secondary"
                        style={{ padding: '0.5rem', minWidth: '2rem' }}
                      >
                        1
                      </button>
                    );
                    if (currentPage > 3) {
                      pages.push(
                        <span key="ellipsis1" style={{ padding: '0.5rem', color: 'var(--admin-muted-foreground)' }}>
                          ...
                        </span>
                      );
                    }
                  }

                  // Show pages around current page
                  const startPage = Math.max(1, currentPage - 1);
                  const endPage = Math.min(totalPages, currentPage + 1);

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => leadsHook.handlePageChange(i)}
                        className={`admin-button ${i === currentPage ? 'admin-button-primary' : 'admin-button-secondary'}`}
                        style={{ padding: '0.5rem', minWidth: '2rem' }}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Show last page
                  if (currentPage < totalPages - 2) {
                    if (currentPage < totalPages - 3) {
                      pages.push(
                        <span key="ellipsis2" style={{ padding: '0.5rem', color: 'var(--admin-muted-foreground)' }}>
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => leadsHook.handlePageChange(totalPages)}
                        className="admin-button admin-button-secondary"
                        style={{ padding: '0.5rem', minWidth: '2rem' }}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next Page Button */}
              <button
                onClick={leadsHook.handleNextPage}
                disabled={leadsHook.currentPage === leadsHook.totalPages}
                className="admin-button admin-button-secondary"
                style={{ padding: '0.5rem' }}
                title="Next page"
              >
                →
              </button>

              {/* To End Button */}
              <button
                onClick={() => leadsHook.handlePageChange(leadsHook.totalPages)}
                disabled={leadsHook.currentPage === leadsHook.totalPages}
                className="admin-button admin-button-secondary"
                style={{ padding: '0.5rem' }}
                title="Go to last page"
              >
                ⏭
              </button>
            </div>
          </div>
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