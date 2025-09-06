"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from 'next-themes';
import { logout, isAuthenticated } from '../../utils/auth';
import { fetchPagesData } from '../../utils/fetchPagesData';
import '../../styles/admin.css';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="admin-button admin-button-ghost" style={{ width: '36px', height: '36px', padding: 0 }}>
        ☀️
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="admin-button admin-button-ghost"
      style={{ width: '36px', height: '36px', padding: 0 }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const Sidebar = ({ isOpen, onClose, currentPath, orgData, isCollapsed, onToggleCollapse }) => {
  const router = useRouter();
  
  const navigation = [
    {
      name: 'Leads',
      href: '/leads',
      icon: '👥',
      current: currentPath === '/leads' || currentPath.startsWith('/leads/detail'),
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: '📄',
      current: currentPath.startsWith('/templates'),
    },
    {
      name: 'Integrations',
      href: '/integrations',
      icon: '🔗',
      current: currentPath.startsWith('/integrations'),
    },
  ];

  const handleNavigation = (href) => {
    router.push(href);
    onClose?.();
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-avatar">
            {orgData?.name?.[0] || 'C'}
          </div>
          {!isCollapsed && (
            <span className="admin-sidebar-title">
              {orgData?.name || 'Clinic Admin'}
            </span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="admin-sidebar-toggle"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      
      <nav className="admin-sidebar-nav">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href)}
            className={`admin-nav-item ${item.current ? 'active' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            {!isCollapsed && item.name}
            {item.current && <span className="admin-nav-arrow">▶</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

const Breadcrumb = ({ items }) => {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
          {index > 0 && (
            <span className="admin-breadcrumb-separator" style={{ margin: '0 0.5rem' }}>›</span>
          )}
          {item.href ? (
            <a href={item.href} className="admin-breadcrumb-item">
              {item.name}
            </a>
          ) : (
            <span className="admin-breadcrumb-item" style={{ fontWeight: 500 }}>
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

const TopBar = ({ onMenuClick, breadcrumbItems, pageTitle, actions, pageActions, orgData, leadData }) => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  const handleAddLead = () => {
    if (actions?.onAddLead) {
      actions.onAddLead();
    }
  };

  const handleAddTemplate = () => {
    router.push('/templates/create');
  };

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          className="admin-button admin-button-ghost md:hidden"
          style={{ padding: '0.5rem' }}
        >
          ☰
        </button>
        
        <div className="hidden md:block">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="md:hidden">
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            {leadData ? `${leadData.full_name || leadData.email}` : pageTitle}
          </h1>
        </div>

        {/* Lead Data Display for Desktop */}
        {leadData && (
          <div className="hidden md:flex admin-lead-info" style={{ 
            marginLeft: '1rem', 
            padding: '0.5rem 1rem', 
            backgroundColor: 'var(--admin-muted)', 
            borderRadius: '0.5rem',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {leadData.first_name+''+leadData.last_name || 'Unknown Lead'}
              </div>
            </div>
            {leadData.phone && (
              <div style={{ fontSize: '0.75rem', color: 'var(--admin-muted-foreground)' }}>
                📞 {leadData.phone}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="admin-topbar-actions">
        {/* Page Actions */}
        {pageActions && pageActions.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
            {pageActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`admin-button ${action.variant === 'secondary' ? 'admin-button-secondary' : 'admin-button-primary'}`}
                style={{ fontSize: '0.875rem' }}
              >
                {action.icon && (
                  <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="admin-button admin-button-ghost"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          >
            <div className="admin-sidebar-avatar" style={{ width: '32px', height: '32px' }}>
              {orgData?.name?.[0] || 'U'}
            </div>
          </button>
          
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '200px',
                backgroundColor: 'var(--admin-card)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                boxShadow: 'var(--admin-shadow-lg)',
                zIndex: 50
              }}
            >
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {orgData?.name || 'Admin User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-muted-foreground)' }}>
                  {orgData?.title || 'Clinic Administrator'}
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)' }} />
              <button
                onClick={handleLogout}
                className="admin-button admin-button-ghost"
                style={{ 
                  width: '100%', 
                  justifyContent: 'flex-start',
                  color: '#dc2626',
                  padding: '0.75rem'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>🚪</span>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div
          onClick={() => setShowUserMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
        />
      )}
    </header>
  );
};

const AppShell = ({ 
  children, 
  pageTitle, 
  breadcrumbItems = [], 
  actions,
  pageActions,
  showSidebar = true,
  leadData = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return;
    }

    // Fetch organization data
    const fetchOrgData = async () => {
      try {
        const data = await fetchPagesData();
        setOrgData(data);
      } catch (err) {
        console.error('Failed to fetch org data:', err);
      }
    };

    fetchOrgData();
  }, []);

  // Default breadcrumb items based on current path
  const defaultBreadcrumbs = [
    { name: 'Dashboard', href: '/leads' },
    ...(breadcrumbItems || [])
  ];

  // Add lead data to breadcrumb if available
  const breadcrumbWithLeadData = leadData ? [
    { name: 'Dashboard', href: '/leads' },
    { name: 'Leads', href: '/leads' },
    { name: leadData.full_name || leadData.email, href: '#' }
  ] : defaultBreadcrumbs;

  if (!showSidebar) {
    return (
      <div className="admin-shell">
        <TopBar
          breadcrumbItems={defaultBreadcrumbs}
          pageTitle={pageTitle}
          actions={actions}
          pageActions={pageActions}
          orgData={orgData}
        />
        <main className="admin-main-content" style={{ marginLeft: 0, marginTop: '64px' }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPath={pathname}
        orgData={orgData}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top Bar */}
      <TopBar
        onMenuClick={() => setSidebarOpen(true)}
        breadcrumbItems={breadcrumbWithLeadData}
        pageTitle={pageTitle}
        actions={actions}
        pageActions={pageActions}
        orgData={orgData}
        leadData={leadData}
      />
      
      {/* Main content */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

// Wrapper component that provides theme context
const AppShellWithTheme = (props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AppShell {...props} />
    </ThemeProvider>
  );
};

export default AppShellWithTheme;