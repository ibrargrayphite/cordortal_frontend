"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from 'next-themes';
import { logout, isAuthenticated } from '../../utils/auth';
import { fetchPagesData } from '../../utils/fetchPagesData';
import '../../styles/admin.css';
import Image from "next/image";
import { FaUser } from 'react-icons/fa';
import { FaSun, FaMoon } from "react-icons/fa";
import { LogOut, ChevronRight, Menu, Phone, User } from "lucide-react";
import UserProfileModal from './UserProfileModal';

// const ThemeToggle = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return (
//       <label className="theme-toggle disabled">
//         <span className="slider">
//           <FaSun className="icon sun" />
//           <FaMoon className="icon moon" />
//         </span>
//         <span className="knob"></span>
//       </label>
//     );
//   }

//   return (
//     <label className="theme-toggle">
//       <input
//         type="checkbox"
//         checked={theme === "dark"}
//         onChange={() => setTheme(theme === "light" ? "dark" : "light")}
//       />
//       <span className="slider">
//         <FaSun className="icon sun" />
//         <FaMoon className="icon moon" />
//       </span>
//       <span className="knob"></span>
//     </label>
//   );
// };

const Sidebar = ({ isOpen, onClose, currentPath, orgData, isCollapsed }) => {
  const router = useRouter();
  const navigation = [
    {
      name: 'Leads',
      href: '/leads',
      icon: <span className="admin-nav-icon">
        <Image
          src="/assets/images/icons/leads-icon.svg"
          alt="Leads"
          width={isCollapsed ? 24 : 20}
          height={isCollapsed ? 24 : 20}
        />
      </span>,
      current: currentPath === '/leads' || currentPath.startsWith('/leads/detail'),
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: <span className="admin-nav-icon">
        <Image
          src="/assets/images/icons/templates-icon.svg"
          alt="Templates"
          width={isCollapsed ? 24 : 20}
          height={isCollapsed ? 24 : 20}
        />
      </span>
      ,
      current: currentPath.startsWith('/templates'),
    },
    {
      name: 'Integrations',
      href: '/integrations',
      icon: <span className="admin-nav-icon">
        <Image
          src="/assets/images/icons/integrations-icon.svg"
          alt="Integrations"
          width={isCollapsed ? 24 : 20}
          height={isCollapsed ? 24 : 20}
        />
      </span>
      ,
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
            {item.current && (
              <span className="admin-nav-arrow">
                <ChevronRight size={16} />
              </span>
            )}

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
            <ChevronRight
              size={14}
              className="admin-breadcrumb-separator"
              style={{ margin: '0 0.5rem', color: 'var(--admin-muted-foreground)' }}
            />
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

const TopBar = ({ onMenuClick, breadcrumbItems, pageTitle, actions, pageActions, orgData, leadData, currentUserId }) => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const handleEditProfile = () => {
    console.log('Edit profile clicked, currentUserId:', currentUserId);
    setShowProfileModal(true);
    setShowUserMenu(false);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          className="admin-button admin-button-ghost"
          style={{ padding: '0.5rem' }}
        >
          <Menu size={20} />
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
                {leadData.first_name + '' + leadData.last_name || 'Unknown Lead'}
              </div>
            </div>
            {leadData.phone && (
              <div style={{ fontSize: '0.75rem', color: 'var(--admin-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={14} />
                {leadData.phone}
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
        {/* <ThemeToggle /> */}

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="admin-button admin-button-ghost"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          >
            <div
              className="admin-sidebar-avatar"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--admin-muted-foreground)',
                borderRadius: '50%',
              }}
            >
              <FaUser style={{ width: '20px', height: '20px', color: 'white' }} />
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
                onClick={handleEditProfile}
                className="admin-button admin-button-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '0.75rem'
                }}
              >
                <User size={18} style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </button>
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
                <LogOut size={18} style={{ marginRight: '0.5rem' }} />
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

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        userId={currentUserId}
      />
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
  const [orgData, setOrgData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return;
    }

    // Fetch organization data and user ID
    const fetchData = async () => {
      try {
        const data = await fetchPagesData();
        setOrgData(data);
        
        // Fetch current user to get user ID
        const { userAPI } = await import('../../utils/api');
        const userData = await userAPI.getCurrentUser();
        console.log('Fetched user data in AppShell:', userData);
        
        // Handle case where API returns array or single object
        const user = Array.isArray(userData) ? userData[0] : userData;
        console.log('Processed user data in AppShell:', user);
        
        // Set user ID from the response
        if (user && user.id) {
          setCurrentUserId(user.id);
        } else {
          console.error('No user ID found in response:', user);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      // mobile
      setIsSidebarOpen((prev) => !prev);
    } else {
      // md & lg
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

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
          currentUserId={currentUserId}
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

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath={pathname}
        orgData={orgData}
        isCollapsed={isSidebarCollapsed}
        onMenuClick={handleMenuClick}
      />

      {/* Top Bar */}
      <TopBar
        onMenuClick={handleMenuClick}
        breadcrumbItems={breadcrumbWithLeadData}
        pageTitle={pageTitle}
        actions={actions}
        pageActions={pageActions}
        orgData={orgData}
        leadData={leadData}
        currentUserId={currentUserId}
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