"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from 'next-themes';
import { logout, isAuthenticated, getAuthHeaders } from '../../utils/auth';
import { fetchPagesData } from '../../utils/fetchPagesData';
import { consentFormsAPI } from '../../utils/api';
import '../../styles/admin.css';
import Image from "next/image";
import { FaUser } from 'react-icons/fa';
import { FaSun, FaMoon } from "react-icons/fa";
import { LogOut, ChevronRight, Menu, Phone, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
  const [isConsentDropdownOpen, setIsConsentDropdownOpen] = useState(false);
  const [consentForms, setConsentForms] = useState([]);
  const [consentFormsLoading, setConsentFormsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [generatingConsentForm, setGeneratingConsentForm] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
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
      name: 'Consent Forms',
      href: null, // No direct navigation
      icon: (
        <span className="admin-nav-icon">
          <Image
            src="/assets/images/icons/consent-form-icon.svg"
            alt="Consent Forms"
            width={isCollapsed ? 24 : 20}
            height={isCollapsed ? 24 : 20}
          />
        </span>
      ),
      current: currentPath.startsWith('/admin/consent-forms'),
      hasDropdown: true,
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
    if (href) {
      router.push(href);
      onClose?.();
    }
  };

  const fetchConsentForms = async () => {
    try {
      setConsentFormsLoading(true);
      const data = await consentFormsAPI?.getConsentFormsWithoutLead(1, 100, '');
      const formsArray = data.results ?? [];
      setConsentForms(formsArray);
    } catch (error) {
      console.error("Error fetching consent forms:", error);
    } finally {
      setConsentFormsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/leads/organization-templates/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTemplates(data.results || []);
    } catch (err) {
      console.error("Templates fetch error:", err);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleGenerateConsentForm = async (templateId) => {
    try {
      setGeneratingConsentForm(true);
      setLoadingMessage('Generating form...');

      if (!templateId) {
        throw new Error("No template selected");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const templateResponse = await fetch(`${baseUrl}/leads/organization-templates/${templateId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (templateResponse.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!templateResponse.ok) {
        throw new Error(`Failed to fetch template: ${templateResponse.status}`);
      }

      const templateData = await templateResponse.json();
      if (!templateData?.template?.trim()) {
        throw new Error("Template HTML is missing or empty");
      }

      // Navigate to consent forms page with template data
      router.push('/admin/consent-forms?template=' + encodeURIComponent(JSON.stringify({
        name: templateData.name || "Generated Consent Form",
        template: templateData.template,
      })));
      setIsConsentDropdownOpen(false);
      onClose?.();
    } catch (err) {
      console.error("Error in handleGenerateConsentForm:", err);
      alert(err.message || "Could not generate consent form. Please try again.");
    } finally {
      setGeneratingConsentForm(false);
      setLoadingMessage('');
    }
  };

  const handleConsentFormClick = () => {
    if (!isConsentDropdownOpen) {
      fetchConsentForms();
    }
    setIsConsentDropdownOpen(!isConsentDropdownOpen);
  };

  const handleNewFormClick = () => {
    router.push('/admin/consent-forms?new=true');
    setIsConsentDropdownOpen(false);
    onClose?.();
  };

  const handleConsentFormSelect = (consentForm) => {
    // Pass the selected consent form data via URL params
    const consentFormData = {
      id: consentForm.id,
      name: consentForm.name,
      template: consentForm.consent_data,
      created_at: consentForm.created_at
    };
    router.push('/admin/consent-forms?consentForm=' + encodeURIComponent(JSON.stringify(consentFormData)));
    setIsConsentDropdownOpen(false);
    onClose?.();
  };

  const handlePrintConsentForm = (consentForm, e) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to enable printing.");
      return;
    }
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consent Form - ${consentForm.name || `Form ${consentForm.id}`}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; background: white; padding: 1in; max-width: 8.5in; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header h1 { font-size: 18pt; font-weight: bold; margin-bottom: 10px; }
          .header .meta { font-size: 10pt; color: #666; }
          .content { margin-bottom: 30px; }
          .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 { margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
          .content h1 { font-size: 16pt; } .content h2 { font-size: 14pt; } .content h3 { font-size: 13pt; } .content h4 { font-size: 12pt; }
          .content p { margin-bottom: 10px; text-align: justify; }
          .content table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .content table, .content th, .content td { border: 1px solid #000; }
          .content th, .content td { padding: 8px; text-align: left; }
          .content th { background-color: #f5f5f5; font-weight: bold; }
          .signature-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; }
          .signature-section h4 { margin-bottom: 15px; }
          .signature-section img { max-width: 300px; max-height: 100px; border: 1px solid #ccc; padding: 5px; margin-bottom: 10px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; color: #666; text-align: center; }
          @media print { body { padding: 0.5in; } .no-print { display: none; } .page-break { page-break-before: always; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${`Consent Form - ${consentForm.name}`}</h1>
          <div class="meta">
            <p><strong>Status:</strong> ${consentForm.is_signed ? 'Signed' : 'Unsigned'}</p>
            <p><strong>Lead:</strong> ${consentForm.lead_email || 'N/A'}</p>
            ${consentForm.signed_at ? `<p><strong>Signed Date:</strong> ${new Date(consentForm.signed_at).toLocaleDateString()}</p>` : ''}
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        <div class="content">
          ${consentForm.consent_data || '<p>No content available</p>'}
        </div>
        <div class="footer">
          <p>This document was generated from the clinic management system.</p>
        </div>
        <script>
          window.onload = function() { window.focus(); window.print(); };
          window.onafterprint = function() {};
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "Unknown date", time: "", full: "Unknown date" };
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        full: date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      };
    } catch (error) {
      return { date: "Invalid date", time: "", full: "Invalid date" };
    }
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          {orgData?.media ? (
            <Image
              src={orgData.media}
              alt={orgData?.name || "Clinic Logo"}
              width={isCollapsed ? 32 : 120}
              height={32}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div className="admin-sidebar-avatar">
              {orgData?.name?.[0] || 'C'}
            </div>
          )}

          {!isCollapsed && !orgData?.media && (
            <span className="admin-sidebar-title">
              {orgData?.name || 'Clinic Admin'}
            </span>
          )}
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        {navigation.map((item) => (
          <div key={item.name}>
            <button
              onClick={item.hasDropdown ? handleConsentFormClick : () => handleNavigation(item.href)}
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
            
            {/* Consent Forms Dropdown */}
            {item.hasDropdown && isConsentDropdownOpen && (
              <div className="consent-forms-dropdown">
                <div className="dropdown-header">
                  <h3>Available Consent Forms</h3>
                  <div className="action-buttons">
                    <button
                      onClick={handleNewFormClick}
                      className="new-form-button"
                    >
                      <i className="fas fa-plus"></i> New Form
                    </button>
                    <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchTemplates()}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="generate-form-button"
                          disabled={generatingConsentForm}
                        >
                          {generatingConsentForm ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i>
                              {loadingMessage || 'Loading...'}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-alt"></i> Generate Form
                            </>
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {templatesLoading ? (
                          <DropdownMenuItem disabled>
                            <i className="fas fa-spinner fa-spin me-2"></i> Loading templates...
                          </DropdownMenuItem>
                        ) : templates.length > 0 ? (
                          templates.map((template) => (
                            <DropdownMenuItem
                              key={template.id}
                              onClick={() => handleGenerateConsentForm(template.id)}
                            >
                              {template.name}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>No templates available</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="dropdown-content">
                  {consentFormsLoading ? (
                    <div className="loading-state">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading consent forms...</p>
                    </div>
                  ) : consentForms.length > 0 ? (
                    <div className="consent-forms-list">
                      {consentForms.map((consentForm) => (
                        <div
                          key={consentForm.id}
                          className="consent-form-item"
                          onClick={() => handleConsentFormSelect(consentForm)}
                        >
                          <div className="consent-form-info">
                            <h4 className="consent-form-name">
                              {consentForm.name || `Consent Form ${consentForm.id}`}
                            </h4>
                          </div>
                          <div className="consent-form-actions">
                            <button
                              onClick={(e) => handlePrintConsentForm(consentForm, e)}
                              className="print-button"
                              title="Print form"
                            >
                              <i className="fas fa-print"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-file-signature"></i>
                      <p>No consent forms found</p>
                      <small>Create your first consent form</small>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
                {leadData.first_name && leadData.last_name
                  ? `${leadData.first_name} ${leadData.last_name}`
                  : 'Unknown Lead'}
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