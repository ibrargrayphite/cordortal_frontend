"use client";

import React from 'react';

const InlineSpinner = ({ size = 'sm' }) => {
  const sizes = {
    xs: { width: '12px', height: '12px' },
    sm: { width: '16px', height: '16px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' }
  };

  return (
    <div
      className="admin-spinner"
      style={sizes[size]}
    />
  );
};

const PageSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="admin-loading" style={{ minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="admin-spinner" style={{ marginBottom: '1rem' }} />
        <p style={{ color: 'var(--admin-muted-foreground)', textAlign: 'center' }}>
          {message}
        </p>
      </div>
    </div>
  );
};

const InlineSkeleton = ({ rows = 5 }) => {
  return (
    <div style={{ padding: '1rem' }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            height: '1rem',
            backgroundColor: 'var(--admin-muted)',
            borderRadius: '0.25rem',
            marginBottom: '0.75rem',
            opacity: 0.6,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} style={{ padding: '0.75rem' }}>
                <div
                  style={{
                    height: '1rem',
                    backgroundColor: 'var(--admin-muted)',
                    borderRadius: '0.25rem',
                    width: '80%',
                    opacity: 0.6
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} style={{ padding: '0.75rem' }}>
                  <div
                    style={{
                      height: '1rem',
                      backgroundColor: 'var(--admin-muted)',
                      borderRadius: '0.25rem',
                      opacity: 0.6,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      animationDelay: `${(rowIndex + colIndex) * 0.1}s`,
                      width: `${Math.random() * 40 + 50}%`
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export { InlineSpinner, PageSpinner, InlineSkeleton, TableSkeleton };
export default PageSpinner;