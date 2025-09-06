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

const columnHelper = createColumnHelper();

const TemplatesListPage = () => {
  const router = useRouter();
  
  const { showError, showSuccess } = useToast();
  const templatesHook = useTemplates();

  // Fetch data on mount
  useEffect(() => {
    templatesHook.fetchTemplates();
  }, []);

  // Template columns definition
  const templateColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Template Name',
        enableSorting: false,
        cell: ({ getValue }) => {
          return (
            <div style={{ fontWeight: '500' }}>{getValue()}</div>
          );
        },
      }),
      columnHelper.accessor('updated_at', {
        header: 'Last Updated',
        enableSorting: false,
        cell: ({ getValue }) => {
          if (!getValue()) return '—';
          return new Date(getValue()).toLocaleDateString();
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
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

  // Page header actions
  const pageActions = useMemo(() => {
    return [
      {
        label: 'Add Template',
        icon: '+',
        onClick: handleAddTemplate,
      },
    ];
  }, [handleAddTemplate]);

  // Stats
  const pageStats = useMemo(() => {
    return [
      {
        label: 'Total Templates',
        value: templatesHook.templates.length || 0,
        variant: 'info',
      },
    ];
  }, [templatesHook.templates.length]);

  // Breadcrumb
  const breadcrumbItems = [
    { name: 'Template Management' },
  ];

  return (
    <AppShell
      pageTitle="Template Management"
      breadcrumbItems={breadcrumbItems}
      // pageActions={pageActions}
    >
      <div className="admin-container">
        {/* Page Header */}
        <PageHeader
          title="Template Management"
          description="Create and manage consent form templates."
          actions={pageActions}
          stats={pageStats}
        />

        {/* Content */}
        {templatesHook.loading ? (
          <TableSkeleton rows={5} columns={3} />
        ) : (
          <DataTable
            data={templatesHook.templates}
            columns={templateColumns}
            searchPlaceholder="Search templates by name..."
            emptyState={
              <EmptyState
                icon="📄"
                title="No templates found"
                description="Start by adding your first template using the 'Add Template' button above."
                action={{
                  label: 'Add Template',
                  onClick: handleAddTemplate,
                }}
              />
            }
          />
        )}
      </div>
    </AppShell>
  );
};

export default TemplatesListPage;