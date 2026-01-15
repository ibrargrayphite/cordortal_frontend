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
import Image from 'next/image';
import { Skeleton } from '../Skeleton';

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
  // Add state to enforce minimum skeleton display time
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

  const { showError, showSuccess } = useToast();
  const leadsHook = useLeads();

  // Loading time for skeleton
  useEffect(() => {
    if (leadsHook.loading) {
      setMinLoadingTimePassed(false);
      const timer = setTimeout(() => {
        setMinLoadingTimePassed(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!leadsHook.loading && minLoadingTimePassed === false) {
      const remainingTimer = setTimeout(() => {
        setMinLoadingTimePassed(true);
      }, 500);
      return () => clearTimeout(remainingTimer);
    }
  }, [leadsHook.loading]);

  // Fetch data on mount
  useEffect(() => {
    leadsHook.fetchLeads(1, false, '');
  }, []);

  // Event handlers
  const handleViewLead = useCallback((leadId, tab = null) => {
    const url = tab 
      ? `/leads/detail?id=${leadId}&tab=${tab}`
      : `/leads/detail?id=${leadId}`;
    router.push(url);
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

  const leadColumns = useMemo(
    () => [
      columnHelper.accessor(
        row => `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email,
        {
          id: 'full_name',
          header: () => <span>NAME</span>,
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
                    background: 'linear-gradient(135deg, var(--admin-primary, var(--main-accent-color)), var(--admin-secondary, var(--main-accent-dark)))',
                    color: 'var(--admin-primary-foreground, var(--primary-foreground))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    boxShadow: 'var(--admin-shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--admin-shadow-md)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {fullName[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--admin-foreground, var(--headline-color))' }}>{fullName}</div>
                </div>
              </div>
            );
          },
        }
      ),
      columnHelper.accessor('email', {
        header: () => <span>EMAIL</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="email" showIcon={false} />
        ),
      }),
      columnHelper.accessor('phone', {
        header: () => <span>PHONE</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <CopyableText text={getValue()} type="phone" showIcon={false} />
        ),
      }),
      columnHelper.accessor('source', {
        header: () => <span>SOURCE</span>,
        enableSorting: true,
        cell: ({ getValue }) => (
          <StatusBadge variant="source">
            {getValue() || 'Unknown'}
          </StatusBadge>
        ),
      }),
      columnHelper.accessor('notes_count', {
        header: () => <span>NOTES</span>,
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <StatusBadge 
            variant="notes" 
            count={getValue() || 0} 
            onClick={() => handleViewLead(row.original.id, 'notes')}
          />
        ),
      }),
      columnHelper.accessor('consent_count', {
        header: () => <span>CONSENT FORMS</span>,
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <StatusBadge 
            variant="consent" 
            count={getValue() || 0} 
            onClick={() => handleViewLead(row.original.id, 'consent')}
          />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span>ACTIONS</span>,
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
    [handleViewLead, handleEditLead, handleDeleteLead]
  );

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

  // Stats with skeleton loading
  const pageStats = useMemo(() => {
    if (leadsHook.loading) {
      return [
        {
          label: 'Total Leads',
          value: <Skeleton width="40px" height="1.5rem" />,
          variant: 'info',
        },
      ];
    }

    return [
      {
        label: 'Total Leads',
        value: leadsHook.leadsCount || 0,
        variant: 'info',
      },
    ];
  }, [leadsHook.leadsCount, leadsHook.loading]);

  // Breadcrumb
  const breadcrumbItems = [
    { name: 'Lead Management' },
  ];

  // Determine if we should still show skeleton: either loading is true or min loading time hasn't passed
  const shouldShowSkeleton = leadsHook.loading || !minLoadingTimePassed;

  return (
    <AppShell
      pageTitle="Lead Management"
      breadcrumbItems={breadcrumbItems}
      actions={{ onAddLead: handleAddLead }}
    >
      <div className="admin-container" style={{ padding: '1.5rem' }}>
        {/* Page Header with Skeleton Loading */}
        <PageHeader
          title="Lead Management"
          description="Capture, track, and manage leads."
          actions={pageActions}
          stats={pageStats}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search leads ..."
          searchLoading={leadsHook.isSearching}
          loading={leadsHook.loading}
        />

        {/* Main Content Area with Skeleton Loading */}
        {shouldShowSkeleton ? (
          <div style={{
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <TableSkeleton rows={5} columns={7} /> {/* Updated columns to 7 to match the table (added Actions) */}

            {/* Pagination Skeleton */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <Skeleton width="120px" height="1.5rem" />
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center'
              }}>
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
                <Skeleton width="2rem" height="2rem" borderRadius="4px" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: '1rem' }}>
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
                onRowClick={(lead) => handleViewLead(lead.id)}
                emptyState={
                <EmptyState
                  icon={
                    <Image
                      src="/assets/images/icons/leads-icon.svg"
                      alt="Leads"
                      width={48}
                      height={48}
                    />
                  }
                  title="No leads found"
                  description={
                    leadsHook.searchQuery || leadsHook.isSearching
                      ? leadsHook.isSearching
                        ? "Searching..."
                        : "No leads match your search criteria."
                      : "Start by adding your first lead using the 'Add Lead' button above."
                  }
                // action={
                //   !leadsHook.searchQuery && !leadsHook.isSearching
                //     ? {
                //       label: 'Add Lead',
                //       onClick: handleAddLead,
                //     }
                //     : null
                // }
                />
              }
              />
            </div>

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
                            style={{
                              padding: '0.5rem',
                              minWidth: '2rem',
                              ...(i === currentPage ? {
                                backgroundColor: 'var(--admin-primary, var(--main-accent-color))',
                                color: 'var(--admin-primary-foreground, var(--primary-foreground))',
                                borderColor: 'var(--admin-primary, var(--main-accent-color))',
                                boxShadow: 'var(--admin-shadow-sm)',
                              } : {})
                            }}
                            onMouseEnter={(e) => {
                              if (i === currentPage) {
                                e.currentTarget.style.boxShadow = 'var(--admin-shadow-md)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (i === currentPage) {
                                e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
                              }
                            }}
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
          </>
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