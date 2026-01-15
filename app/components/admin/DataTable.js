"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,FileText, FastForwardIcon, ChevronLast, ChevronFirst } from "lucide-react";

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pageSize = 10,
  showPagination = true,
  emptyState = null,
  className = '',
  density = 'normal', // 'compact' | 'normal' | 'comfortable',
  onRowClick,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const densityClasses = {
    compact: { padding: '0.75rem 1rem' },
    normal: { padding: '1rem' },
    comfortable: { padding: '1.25rem' }
  };

  const cellStyle = densityClasses[density];

  // New handler to prevent row click on interactive elements
  const handleRowClick = useCallback((event, row) => {
    const interactiveSelectors = [
      'button',
      'a',
      'input',
      'select',
      '.admin-action-menu',
      '[role="menuitem"]',
      '[role="button"]'
    ];

    const isInteractive = interactiveSelectors.some(selector =>
      event.target.closest(selector)
    );

    if (isInteractive) {
      event.stopPropagation();
      return;
    }

    if (onRowClick && typeof onRowClick === 'function') {
      onRowClick(row.original);
    }
  }, [onRowClick]);

  if (loading) {
    return (
      <div className="admin-card">
        <div className="admin-loading">
          <div className="admin-spinner" style={{ marginRight: '0.5rem' }} />
          Loading data...
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`admin-card ${className}`}
      style={{
        background: 'var(--admin-card)',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius)',
        boxShadow: 'var(--admin-shadow-sm)',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ minWidth: '100%', backgroundColor: 'var(--admin-card)' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      ...cellStyle,
                      userSelect: 'none',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      backgroundColor: 'transparent',
                      color: 'var(--admin-muted-foreground, var(--content-color))',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'background-color 0.15s ease',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    onMouseEnter={(e) => {
                      if (header.column.getCanSort()) {
                        e.currentTarget.style.backgroundColor = 'var(--admin-muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            {header.column.getIsSorted() === 'asc' && <ArrowUp size={16} />}
                            {header.column.getIsSorted() === 'desc' && <ArrowDown size={16} />}
                            {!header.column.getIsSorted() && <ArrowUpDown size={16} style={{ opacity: 0.4 }} />}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={(e) => handleRowClick(e, row)}
                  className={onRowClick ? "cursor-pointer" : ""}
                  style={{
                    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.03)';
                    e.currentTarget.style.boxShadow = 'inset 2px 0 0 var(--admin-primary, var(--main-accent-color))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={cellStyle}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

              ))
            ) : (
              // Show empty state in a single row spanning all columns
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    ...cellStyle,
                    textAlign: 'center',
                    height: '200px',
                    verticalAlign: 'middle'
                  }}
                >
                  {emptyState || (
                    <div className="admin-empty-state">
                      <div className="admin-empty-state-icon"><FileText size={22} strokeWidth={2} /></div>
                      <h3 className="admin-empty-state-title">No data found</h3>
                      <p className="admin-empty-state-description">
                        There are no items to display.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Only show if there are items */}
      {showPagination && table.getRowModel().rows.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          padding: '1rem'
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
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              {table.getPageCount() === 1 && ` (${data.length} items)`}
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
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
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
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
              title="Go to first page"
            >
              <ChevronFirst size={16} />
            </button>
            {/* Previous Page Button */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: '0.25rem', margin: '0 0.5rem' }}>
              {(() => {
                const currentPage = table.getState().pagination.pageIndex;
                const totalPages = table.getPageCount();
                const pages = [];
                // Show first page
                if (currentPage > 2) {
                  pages.push(
                    <button
                      key={0}
                      onClick={() => table.setPageIndex(0)}
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
                const startPage = Math.max(0, currentPage - 1);
                const endPage = Math.min(totalPages - 1, currentPage + 1);
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => table.setPageIndex(i)}
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
                      {i + 1}
                    </button>
                  );
                }
                // Show last page
                if (currentPage < totalPages - 3) {
                  if (currentPage < totalPages - 4) {
                    pages.push(
                      <span key="ellipsis2" style={{ padding: '0.5rem', color: 'var(--admin-muted-foreground)' }}>
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages - 1}
                      onClick={() => table.setPageIndex(totalPages - 1)}
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
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
              title="Next page"
            >
              <ChevronRight size={16} />
            </button>
            {/* To End Button */}
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
              title="Go to last page"
            >
              <ChevronLast size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;