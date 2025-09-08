"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pageSize = 10,
  searchValue = '',
  onSearchChange = () => { },
  showPagination = true,
  showSearch = true,
  searchPlaceholder = 'Search...',
  emptyState = null,
  className = '',
  density = 'normal' // 'compact' | 'normal' | 'comfortable'
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState(searchValue);

  // Update global filter when searchValue prop changes
  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      onSearchChange(value);
    },
    globalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const densityClasses = {
    compact: { padding: '0.5rem' },
    normal: { padding: '0.75rem' },
    comfortable: { padding: '1rem' }
  };

  const cellStyle = densityClasses[density];

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
    <div className={`admin-card ${className}`}>
      {/* Search and Controls */}
      {showSearch && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          gap: '1rem'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.875rem'
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Row count */}
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--admin-muted-foreground)'
          }}>
            {table.getFilteredRowModel().rows.length} items
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ minWidth: '100%' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      ...cellStyle,
                      userSelect: 'none'
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={cellStyle}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                      <div className="admin-empty-state-icon">📄</div>
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
      {showPagination && table.getFilteredRowModel().rows.length > 0 && (
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
              ⏮
            </button>
            {/* Previous Page Button */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
              title="Previous page"
            >
              ←
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
                      style={{ padding: '0.5rem', minWidth: '2rem' }}
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
              →
            </button>
            {/* To End Button */}
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
  );
};

export default DataTable;