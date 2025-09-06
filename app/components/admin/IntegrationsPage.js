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
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailFilters, setGmailFilters] = useState({
    subjectKeywords: '',
    fromEmails: '',
    dateRange: '30',
    labelFilters: ''
  });
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailData, setGmailData] = useState(null);

  useEffect(() => {
    fetchIntegrations();
    checkGmailConnection();
  }, []);

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
      fetchIntegrations();
    } catch (err) {
      setError('Failed to disconnect Gmail');
      console.error('Gmail disconnect error:', err);
    }
  };

  const handleSaveFilters = async () => {
    // TODO: Implement when filter API is available
    setShowGmailModal(false);
    setError('Filter configuration not yet implemented');
  };

  const handleSyncGmail = async () => {
    // TODO: Implement when sync API is available
    setError('Gmail sync not yet implemented');
  };

  const breadcrumbItems = [
    { name: 'Integrations', href: '/integrations' }
  ];

  const pageActions = gmailConnected ? [
    {
      label: 'Sync Gmail (Coming Soon)',
      icon: '🔄',
      onClick: handleSyncGmail,
      disabled: true
    }
  ] : [];

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
                      style={{ fontSize: '0.875rem', opacity: 0.6, cursor: 'not-allowed' }}
                      disabled
                    >
                      ⚙️ Configure (Coming Soon)
                    </button>
                    <button
                      onClick={handleSyncGmail}
                      className="admin-button admin-button-secondary"
                      style={{ fontSize: '0.875rem', opacity: 0.6, cursor: 'not-allowed' }}
                      disabled
                    >
                      🔄 Sync Now (Coming Soon)
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
                  <label className="admin-label">Subject Keywords</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., appointment, consultation, inquiry"
                    value={gmailFilters.subjectKeywords}
                    onChange={(e) => setGmailFilters(prev => ({ ...prev, subjectKeywords: e.target.value }))}
                  />
                  <div className="admin-input-help">
                    Comma-separated keywords to search for in email subjects
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-label">From Email Addresses</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., info@clinic.com, contact@clinic.com"
                    value={gmailFilters.fromEmails}
                    onChange={(e) => setGmailFilters(prev => ({ ...prev, fromEmails: e.target.value }))}
                  />
                  <div className="admin-input-help">
                    Comma-separated email addresses to filter by sender
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-label">Date Range (days)</label>
                  <select
                    className="admin-input"
                    value={gmailFilters.dateRange}
                    onChange={(e) => setGmailFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="admin-label">Gmail Labels</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g., INBOX, Important, Leads"
                    value={gmailFilters.labelFilters}
                    onChange={(e) => setGmailFilters(prev => ({ ...prev, labelFilters: e.target.value }))}
                  />
                  <div className="admin-input-help">
                    Comma-separated Gmail labels to filter by
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowGmailModal(false)}
                  className="admin-button admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFilters}
                  className="admin-button admin-button-primary"
                >
                  Save Configuration
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