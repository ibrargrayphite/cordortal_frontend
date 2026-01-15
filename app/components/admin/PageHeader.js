"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Skeleton } from '../Skeleton';

const StatPill = ({ label, value, variant = "default", loading = false }) => {
  // Light teal rectangular badge with rounded corners matching the design
  // Using CSS variables from admin/website theme
  const statPillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--admin-radius)', // Rounded rectangle using admin radius
    backgroundColor: 'color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 15%, transparent)',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 1px 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 20%, transparent), 0 0 8px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)',
  };

  return (
    <div style={statPillStyle}>
      <span style={{ 
        color: 'var(--admin-primary, var(--main-accent-color))', 
        fontWeight: 500,
        textShadow: '0 0 2px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 30%, transparent)',
      }}>
        {label}:
      </span>
      <span style={{ 
        color: 'var(--admin-primary, var(--main-accent-color))',
        fontWeight: 600,
        textShadow: '0 0 2px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 30%, transparent)',
      }}>
        {loading ? <Skeleton width="40px" height="1rem" /> : value}
      </span>
    </div>
  );
};

const PageHeader = ({
  title,
  description,
  actions = [],
  stats = [],
  breadcrumbItems = [],
  searchValue = "",
  onSearchChange = () => { },
  searchPlaceholder = "Search...",
  searchLoading = false,
  hideSearch = false,
  loading = false, // New prop for skeleton loading
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLocalSearchValue(value);
      if (value === "") {
        onSearchChange("");
      }
    },
    [onSearchChange]
  );

  const handleSearchKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onSearchChange(localSearchValue);
      }
    },
    [localSearchValue, onSearchChange]
  );

  return (
    <div className="admin-page-header">
      <div className="admin-container">
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: stats.length > 0 || onSearchChange ? "1rem" : "0.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: "200px" }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Title skeleton */}
                <Skeleton width="250px" height="2rem" />

                {/* Description skeleton */}
                <Skeleton width="250px" height="1rem" />
              </div>
            ) : (
              <>
                <h1 
                  className="admin-page-title" 
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--admin-foreground, var(--headline-color))',
                    marginBottom: '0.5rem',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </h1>
                {description && (
                  <p 
                    className="admin-page-description"
                    style={{
                      color: 'var(--admin-muted-foreground, var(--subheadline-color))',
                      fontSize: '0.9375rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {description}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              {loading ? (
                // Skeleton for actions
                <Skeleton width="120px" height="2.5rem" borderRadius="8px" />
              ) : (
                actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`admin-button ${action.variant === "secondary"
                      ? "admin-button-secondary"
                      : "admin-button-primary"
                      }`}
                    style={action.variant !== "secondary" ? {
                      backgroundColor: 'var(--admin-primary, var(--main-accent-color))',
                      color: 'var(--admin-primary-foreground, var(--primary-foreground))',
                      borderColor: 'var(--admin-primary, var(--main-accent-color))',
                      boxShadow: 'var(--admin-shadow-lg)',
                    } : {}}
                    onMouseEnter={(e) => {
                      if (action.variant !== "secondary" && !action.disabled) {
                        e.currentTarget.style.boxShadow = 'var(--admin-shadow-lg)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (action.variant !== "secondary" && !action.disabled) {
                        e.currentTarget.style.boxShadow = 'var(--admin-shadow-lg)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {action.icon && (
                      <span style={{ marginRight: "0.5rem" }}>{action.icon}</span>
                    )}
                    {action.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Stats + Search */}
        {(stats.length > 0 || (onSearchChange && !hideSearch)) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {stats.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  flex: "1 1 auto",
                }}
              >
                {loading ? (
                  // Skeleton for stats
                  <>
                    <Skeleton width="100px" height="2rem" borderRadius="24px" />

                  </>
                ) : (
                  stats.map((stat, index) => (
                    <StatPill
                      key={index}
                      label={stat.label}
                      value={stat.value}
                      variant={stat.variant}
                    />
                  ))
                )}
              </div>
            )}

            {/* Search bar */}
            {onSearchChange && !hideSearch && (
              <div
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  marginLeft: "auto",
                }}
              >
                {loading ? (
                  // Skeleton for search bar
                  <Skeleton width="250px" height="2.5rem" borderRadius="4px" />
                ) : (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        left: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "1rem",
                        color: "#6b7280",
                      }}
                    >
                      {searchLoading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </span>
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={localSearchValue}
                      onChange={handleSearchChange}
                      onKeyPress={handleSearchKeyPress}
                      className="admin-input"
                      style={{
                        paddingLeft: "2.5rem",
                        minWidth: "250px",
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--admin-primary, var(--main-accent-color))';
                        e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--admin-primary, var(--main-accent-color)) 10%, transparent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--admin-border)';
                        e.target.style.boxShadow = 'none';
                      }}
                      disabled={searchLoading}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
export { StatPill };