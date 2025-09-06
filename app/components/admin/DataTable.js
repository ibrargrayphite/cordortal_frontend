"use client";

import React, { useState, useMemo } from 'react';
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
  onSearchChange = () => {},
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
  React.useEffect(() => {
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

  if (!loading && data.length === 0) {
    return (
      <div className="admin-card">
        {emptyState || (
          <div className="admin-empty-state">
            <div className="admin-empty-state-icon">📄</div>
            <h3 className="admin-empty-state-title">No data found</h3>
            <p className="admin-empty-state-description">
              There are no items to display.
            </p>
          </div>
        )}
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
            {table.getRowModel().rows.map((row) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && table.getPageCount() > 1 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: '1rem',
          gap: '1rem'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--admin-muted-foreground)' 
          }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
            >
              ←
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="admin-button admin-button-secondary"
              style={{ padding: '0.5rem' }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;