"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Skeleton } from '../Skeleton';

const StatPill = ({ label, value, variant = "default", loading = false }) => {
  const variantClasses = {
    default: "admin-badge",
    success: "admin-badge admin-badge-success",
    warning: "admin-badge admin-badge-warning",
    error: "admin-badge admin-badge-error",
    info: "admin-badge admin-badge-info",
  };

  return (
    <div className={variantClasses[variant]}>
      <span style={{ fontWeight: 600 }}>{label}:</span>
      <span style={{ marginLeft: "0.25rem" }}>
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
                <h1 className="admin-page-title">{title}</h1>
                {description && (
                  <p className="admin-page-description">{description}</p>
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