"use client";

import React, { useState, useEffect } from 'react';
import { 
  AppShell, 
  PageHeader, 
  PageSpinner 
} from './index';
import { fetchPagesData } from '../../utils/fetchPagesData';
import api from '../../utils/api';

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailFilters, setGmailFilters] = useState({
    emails: [],
    subjects: []
  });
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailData, setGmailData] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [filtersLoading, setFiltersLoading] = useState(false);

  useEffect(() => {
    fetchIntegrations();
    checkGmailConnection();
    if (gmailConnected) {
      fetchGmailFilters();
    }
  }, [gmailConnected]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      // Gmail integration card
      const gmailIntegration = {
        id: 'gmail',
        name: 'Gmail',
        description: 'Import leads from Gmail emails automatically',
        icon: '/assets/images/gmail-logo.svg',
        status: 'available',
        connected: gmailConnected,
        lastSync: gmailData?.lastSync || null
      };
      setIntegrations([gmailIntegration]);
    } catch (err) {
      setError('Failed to fetch integrations');
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkGmailConnection = async () => {
    try {
      // Check if Gmail is already connected
      const response = await api.get('/user/gmail/status/');
      if (response.data.connected) {
        setGmailConnected(true);
        setGmailData(response.data);
      } else {
        setGmailConnected(false);
        setGmailData(null);
      }
    } catch (err) {
      console.log('Gmail not connected yet');
      setGmailConnected(false);
      setGmailData(null);
    }
  };

  const handleGmailConnect = async () => {
    try {
      const response = await api.post('/user/gmail/login/');
      if (response.data.auth_url) {
        // Redirect to Gmail OAuth
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to get Gmail authorization URL');
      }
    } catch (err) {
      setError('Failed to connect to Gmail');
      console.error('Gmail connection error:', err);
    }
  };

  const handleGmailDisconnect = async () => {
    try {
      const response = await api.post('/user/gmail/disconnect/');
      // The disconnect API returns a success message, so we can assume it worked
      setGmailConnected(false);
      setGmailData(null);
      setGmailFilters({ emails: [], subjects: [] });
      fetchIntegrations();
    } catch (err) {
      setError('Failed to disconnect Gmail');
      console.error('Gmail disconnect error:', err);
    }
  };

  const fetchGmailFilters = async () => {
    try {
      setFiltersLoading(true);
      const response = await api.get('user/gmail/filters/');
      if (response.data) {
        setGmailFilters({
          emails: response.data.emails || [],
          subjects: response.data.subjects || []
        });
      }
    } catch (err) {
      console.error('Error fetching Gmail filters:', err);
      // Don't show error for filters, just use empty state
    } finally {
      setFiltersLoading(false);
    }
  };

  const saveGmailFilters = async () => {
    try {
      setFiltersLoading(true);
      const payload = {
        emails: gmailFilters.emails,
        subjects: gmailFilters.subjects
      };
      
      const response = await api.post('user/gmail/filters/', payload);
      if (response.data) {
        setError(null);
        setSuccessMessage('Gmail filters saved successfully!');
        setShowGmailModal(false);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError('Failed to save Gmail filters');
      console.error('Gmail filters save error:', err);
    } finally {
      setFiltersLoading(false);
    }
  };

  const addEmail = () => {
    if (emailInput.trim()) {
      setGmailFilters(prev => ({
        ...prev,
        emails: [...prev.emails, emailInput.trim()]
      }));
      setEmailInput('');
    }
  };

  const removeEmail = (index) => {
    setGmailFilters(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  const addSubject = () => {
    if (subjectInput.trim()) {
      setGmailFilters(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (index) => {
    setGmailFilters(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSaveFilters = async () => {
    await saveGmailFilters();
  };


  const breadcrumbItems = [
    { name: 'Integrations', href: '/integrations' }
  ];

  const pageActions = [];

  if (loading) {
    return (
      <AppShell
        pageTitle="Integrations"
        breadcrumbItems={breadcrumbItems}
        pageActions={pageActions}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <PageSpinner message="Loading integrations..." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      pageTitle="Integrations"
      breadcrumbItems={breadcrumbItems}
      pageActions={pageActions}
    >
      <div className="admin-page">
        <PageHeader
          title="Integrations"
          description="Connect external services to import leads automatically"
          stats={[
            { label: 'Connected', value: integrations.filter(i => i.connected).length },
            { label: 'Available', value: integrations.filter(i => i.status === 'available').length }
          ]}
        />

        {error && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="admin-alert" style={{ 
            marginBottom: '1rem', 
            backgroundColor: '#d1fae5', 
            color: '#065f46', 
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem'
          }}>
            {successMessage}
          </div>
        )}

        <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {integrations.map((integration) => (
            <div key={integration.id} className="admin-card admin-integration-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {integration.icon.endsWith('.svg') ? (
                    <img 
                      src={integration.icon} 
                      alt={integration.name}
                      style={{ width: '32px', height: '32px' }}
                    />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>{integration.icon}</span>
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                    {integration.name}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--admin-muted-foreground)' }}>
                    {integration.description}
                  </p>
                </div>
              </div>

              {integration.connected && (
                <div style={{ marginBottom: '1rem' }}>
                  <span className="admin-status-badge connected">
                    Connected
                  </span>
                  {gmailData?.email && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-muted-foreground)', marginTop: '0.5rem' }}>
                      Email: {gmailData.email}
                    </div>
                  )}
                  {integration.lastSync && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-muted-foreground)', marginTop: '0.5rem' }}>
                      Last sync: {new Date(integration.lastSync).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {integration.connected ? (
                  <>
                    <button
                      onClick={() => setShowGmailModal(true)}
                      className="admin-button admin-button-secondary"
                      style={{ fontSize: '0.875rem' }}
                    >
                      ⚙️ Configure Filters
                    </button>
                    <button
                      onClick={handleGmailDisconnect}
                      className="admin-button admin-button-ghost"
                      style={{ fontSize: '0.875rem', color: '#dc2626' }}
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGmailConnect}
                    className="admin-button admin-button-primary"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Connect Gmail
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gmail Configuration Modal */}
        {showGmailModal && (
          <div className="admin-modal-overlay" onClick={() => setShowGmailModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>Gmail Configuration</h2>
                <button
                  onClick={() => setShowGmailModal(false)}
                  className="admin-button admin-button-ghost"
                  style={{ padding: '0.5rem' }}
                >
                  ✕
                </button>
              </div>
              
              <div className="admin-modal-body">
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-label">Email Addresses</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g., billing@stripe.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                    />
                    <button
                      onClick={addEmail}
                      className="admin-button admin-button-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="admin-input-help">
                    Add email addresses to filter by sender
                  </div>
                  
                  {/* Display added emails */}
                  {gmailFilters.emails.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {gmailFilters.emails.map((email, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.25rem 0.5rem',
                          margin: '0.25rem 0',
                          backgroundColor: 'var(--admin-muted)',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}>
                          <span>{email}</span>
                          <button
                            onClick={() => removeEmail(index)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#dc2626', 
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-label">Subject Keywords</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g., invoice, payment failed"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <button
                      onClick={addSubject}
                      className="admin-button admin-button-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="admin-input-help">
                    Add subject keywords to filter emails
                  </div>
                  
                  {/* Display added subjects */}
                  {gmailFilters.subjects.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {gmailFilters.subjects.map((subject, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.25rem 0.5rem',
                          margin: '0.25rem 0',
                          backgroundColor: 'var(--admin-muted)',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}>
                          <span>{subject}</span>
                          <button
                            onClick={() => removeSubject(index)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#dc2626', 
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowGmailModal(false)}
                  className="admin-button admin-button-secondary"
                  disabled={filtersLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFilters}
                  className="admin-button admin-button-primary"
                  disabled={filtersLoading}
                >
                  {filtersLoading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default IntegrationsPage;