"use client";

import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '../Skeleton';
import styles from './SkeletonComponents.module.css';

// Page Header Skeleton
export const PageHeaderSkeleton = ({ showBreadcrumb = true, showActions = true }) => (
  <div className={styles.pageHeaderSkeleton}>
    {showBreadcrumb && (
      <div className={styles.breadcrumbSkeleton}>
        <Skeleton width="80px" height="14px" />
        <Skeleton width="12px" height="14px" />
        <Skeleton width="120px" height="14px" />
      </div>
    )}
    <div className={styles.headerContent}>
      <div className={styles.headerLeft}>
        <Skeleton width="200px" height="24px" />
        <Skeleton width="300px" height="16px" style={{ marginTop: '8px' }} />
      </div>
      {showActions && (
        <div className={styles.headerActions}>
          <Skeleton width="120px" height="36px" borderRadius="6px" />
          <Skeleton width="100px" height="36px" borderRadius="6px" />
        </div>
      )}
    </div>
  </div>
);

// Stats Cards Skeleton
export const StatsCardsSkeleton = ({ count = 4 }) => (
  <div className={styles.statsCardsSkeleton}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={styles.statCardSkeleton}>
        <div className={styles.statCardHeader}>
          <Skeleton width="24px" height="24px" borderRadius="6px" />
          <Skeleton width="80px" height="16px" />
        </div>
        <Skeleton width="60px" height="32px" style={{ marginTop: '8px' }} />
        <Skeleton width="100px" height="14px" style={{ marginTop: '4px' }} />
      </div>
    ))}
  </div>
);

// Table Skeleton with enhanced styling
export const EnhancedTableSkeleton = ({ rows = 5, columns = 4, showHeader = true }) => (
  <div className={styles.tableSkeletonContainer}>
    <div className={styles.tableSkeleton}>
      {showHeader && (
        <div className={styles.tableHeaderSkeleton}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className={styles.tableHeaderCell}>
              <Skeleton width="80%" height="16px" />
            </div>
          ))}
        </div>
      )}
      <div className={styles.tableBodySkeleton}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.tableRowSkeleton}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className={styles.tableCellSkeleton}>
                <Skeleton 
                  width={`${Math.random() * 30 + 50}%`} 
                  height="16px" 
                  style={{ 
                    animationDelay: `${(rowIndex + colIndex) * 0.1}s` 
                  }} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Card Grid Skeleton
export const CardGridSkeleton = ({ cards = 6, columns = 3 }) => (
  <div className={styles.cardGridSkeleton} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className={styles.cardSkeleton}>
        <Skeleton width="100%" height="120px" borderRadius="8px" />
        <div className={styles.cardContentSkeleton}>
          <Skeleton width="80%" height="20px" />
          <Skeleton width="60%" height="16px" style={{ marginTop: '8px' }} />
          <Skeleton width="40%" height="14px" style={{ marginTop: '12px' }} />
        </div>
        <div className={styles.cardActionsSkeleton}>
          <Skeleton width="80px" height="32px" borderRadius="6px" />
          <Skeleton width="60px" height="32px" borderRadius="6px" />
        </div>
      </div>
    ))}
  </div>
);

// Form Skeleton
export const FormSkeleton = ({ fields = 5, showActions = true }) => (
  <div className={styles.formSkeleton}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className={styles.formFieldSkeleton}>
        <Skeleton width="120px" height="16px" />
        <Skeleton width="100%" height="40px" borderRadius="6px" style={{ marginTop: '8px' }} />
      </div>
    ))}
    {showActions && (
      <div className={styles.formActionsSkeleton}>
        <Skeleton width="100px" height="40px" borderRadius="6px" />
        <Skeleton width="80px" height="40px" borderRadius="6px" />
      </div>
    )}
  </div>
);

// Sidebar Skeleton
export const SidebarSkeleton = () => (
  <div className={styles.sidebarSkeleton}>
    <div className={styles.sidebarHeaderSkeleton}>
      <SkeletonCircle size="32px" />
      <Skeleton width="120px" height="20px" />
    </div>
    <div className={styles.sidebarNavSkeleton}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.navItemSkeleton}>
          <Skeleton width="20px" height="20px" />
          <Skeleton width="80px" height="16px" />
        </div>
      ))}
    </div>
  </div>
);

// Content Area Skeleton
export const ContentAreaSkeleton = ({ type = 'default' }) => {
  switch (type) {
    case 'table':
      return <EnhancedTableSkeleton rows={8} columns={6} />;
    case 'cards':
      return <CardGridSkeleton cards={9} columns={3} />;
    case 'form':
      return <FormSkeleton fields={6} />;
    case 'list':
      return (
        <div className={styles.listSkeleton}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.listItemSkeleton}>
              <SkeletonCircle size="40px" />
              <div className={styles.listItemContent}>
                <Skeleton width="200px" height="18px" />
                <Skeleton width="150px" height="14px" style={{ marginTop: '4px' }} />
              </div>
              <Skeleton width="60px" height="32px" borderRadius="16px" />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className={styles.defaultContentSkeleton}>
          <Skeleton width="100%" height="200px" borderRadius="8px" />
          <div className={styles.contentTextSkeleton}>
            <Skeleton width="80%" height="20px" />
            <Skeleton width="60%" height="16px" style={{ marginTop: '8px' }} />
            <Skeleton width="40%" height="16px" style={{ marginTop: '8px' }} />
          </div>
        </div>
      );
  }
};

// Full Page Skeleton
export const FullPageSkeleton = ({ 
  showHeader = true, 
  showStats = false, 
  contentType = 'default',
  showSidebar = false 
}) => (
  <div className={styles.fullPageSkeleton}>
    {showSidebar && <SidebarSkeleton />}
    <div className={styles.mainContentSkeleton}>
      {showHeader && <PageHeaderSkeleton />}
      {showStats && <StatsCardsSkeleton />}
      <div className={styles.contentSkeleton}>
        <ContentAreaSkeleton type={contentType} />
      </div>
    </div>
  </div>
);

// Loading State Wrapper
export const LoadingStateWrapper = ({ 
  isLoading, 
  children, 
  skeleton, 
  minLoadingTime = 500 
}) => {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, minLoadingTime);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [isLoading, minLoadingTime]);

  if (showSkeleton) {
    return skeleton || <FullPageSkeleton />;
  }

  return children;
};

export default FullPageSkeleton;