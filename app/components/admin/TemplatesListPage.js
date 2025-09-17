"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import {
  AppShell,
  PageHeader,
  DataTable,
  ActionMenu,
  EmptyState,
  TableSkeleton
} from './index';
import { useTemplates } from '../../hooks/useTemplates';
import { useToast } from '../Toast';
import { Plus } from "lucide-react";
import Image from 'next/image';
import { Skeleton } from '../Skeleton';

const columnHelper = createColumnHelper();

const TemplatesListPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false); // New state to prevent initial empty state flash

  const { showError, showSuccess } = useToast();
  const templatesHook = useTemplates();

  // Fetch data on mount
  useEffect(() => {
    templatesHook.fetchTemplates().finally(() => setHasLoaded(true));
  }, []);

  // Update local search input when searchQuery changes
  useEffect(() => {
    setSearchInput(templatesHook.searchQuery || '');
  }, [templatesHook.searchQuery]);

  // Template columns definition
  const templateColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => <span style={{ fontWeight: 'bold' }}>Template Name</span>,
        cell: ({ getValue }) => (
          <div style={{ fontWeight: '500' }}>{getValue()}</div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span style={{ fontWeight: 'bold' }}>Actions</span>,
        enableSorting: false,
        cell: ({ row }) => {
          const template = row.original;
          return (
            <ActionMenu
              actions={[
                {
                  label: 'Edit Template',
                  onClick: () => handleEditTemplate(template),
                },
                {
                  label: 'Delete Template',
                  variant: 'destructive',
                  onClick: () => handleDeleteTemplate(template),
                  loading: templatesHook.deletingTemplateId === template.id,
                },
              ]}
            />
          );
        },
      }),
    ],
    [templatesHook.deletingTemplateId]
  );

  // Event handlers
  const handleAddTemplate = useCallback(() => {
    router.push('/templates/create/');
  }, [router]);

  const handleEditTemplate = useCallback((template) => {
    router.push(`/templates/detail?id=${template.id}`);
  }, [router]);

  const handleDeleteTemplate = useCallback(async (template) => {
    try {
      await templatesHook.deleteTemplate(template.id);
    } catch (err) {
      console.error('Delete template error:', err);
    }
  }, [templatesHook]);

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    // Update local state immediately for UI responsiveness
    setSearchInput(value);
    // Trigger search
    templatesHook.searchTemplates(value);
  }, [templatesHook]);

  // Page header actions
  const pageActions = useMemo(() => {
    return [
      {
        label: 'Add Template',
        icon: <Plus size={18} />,
        onClick: handleAddTemplate,
      },
    ];
  }, [handleAddTemplate]);

  // Stats with skeleton loading
  const pageStats = useMemo(() => {
    if (templatesHook.loading || !hasLoaded) {
      return [
        {
          label: 'Total Templates',
          value: <Skeleton width="40px" height="1.5rem" />,
          variant: 'info',
        },
      ];
    }
    return [
      {
        label: 'Total Templates',
        value: templatesHook.templates.length || 0,
        variant: 'info',
      },
    ];
  }, [templatesHook.templates.length, templatesHook.loading, hasLoaded]);

  // Breadcrumb
  const breadcrumbItems = [
    { name: 'Template Management' },
  ];

  return (
    <AppShell
      pageTitle="Template Management"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="admin-container">
        {/* Page Header */}
        <PageHeader
          title="Template Management"
          description="Create and manage consent form templates."
          actions={pageActions}
          stats={pageStats}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search templates ..."
          searchLoading={templatesHook.searchLoading}
          loading={templatesHook.loading || !hasLoaded}
        />

        {/* Content */}
        {templatesHook.loading || !hasLoaded ? (
          <div style={{
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <TableSkeleton rows={5} columns={2} />
          </div>
        ) : (
          <DataTable
            data={templatesHook.templates}
            columns={templateColumns}
            searchPlaceholder="Search templates by name..."
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            searchLoading={templatesHook.searchLoading}
            emptyState={
              <EmptyState
                icon={
                  <Image
                    src="/assets/images/icons/templates-icon.svg"
                    alt="Templates"
                    width={48}
                    height={48}
                  />
                }
                title="No templates found"
                description={
                  templatesHook.searchQuery || templatesHook.searchLoading
                    ? templatesHook.searchLoading
                      ? "Searching..."
                      : "No templates match your search criteria."
                    : "Start by adding your first template using the 'Add Template' button above."
                }
                action={
                  !templatesHook.searchQuery && !templatesHook.searchLoading
                    ? {
                      label: 'Add Template',
                      onClick: handleAddTemplate,
                    }
                    : null
                }
              />
            }
          />
        )}
      </div>
    </AppShell>
  );
};

export default TemplatesListPage;