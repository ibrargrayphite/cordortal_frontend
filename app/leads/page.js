"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated, logout } from "../utils/auth";
import { fetchPagesData } from "../utils/fetchPagesData";
import { useToast } from "../components/Toast";
import { DataLoader } from "../components/LoadingSpinner";
import { useLeads } from "../hooks/useLeads";
import { useTemplates } from "../hooks/useTemplates";
import LeadsHeader from "../components/Leads/LeadsHeader";
import LeadsTable from "../components/Leads/LeadsTable";
import Pagination from "../components/Leads/Pagination";
import LeadModal from "../components/Leads/LeadModal";
import TemplatesTab from "../components/Leads/TemplatesTab";
import styles from "./leads.module.css";
import theme from "../styles/adminTheme.module.css";

const InnerLeadsPage = () => {
  const searchParams = useSearchParams();
  const seletedTab = searchParams.get("tab");
  const [orgData, setOrgData] = useState(null);
  const [activeTab, setActiveTab] = useState(
    seletedTab === "templates" ? "templates" : "leads"
  );
  const [searchInput, setSearchInput] = useState("");
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [viewingLeadId, setViewingLeadId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    source: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);

  const router = useRouter();
  const { showError, showSuccess, showWarning } = useToast();
  
  // Custom hooks
  const leadsHook = useLeads();
  const templatesHook = useTemplates();

  useEffect(() => {
    // Check auth and fetch data immediately
    if (!isAuthenticated()) {
      window.location.replace("/login");
      return;
    }

    // Fetch both leads and organization data in parallel
    Promise.all([leadsHook.fetchLeads(1, false, ""), fetchOrgData()]);
  }, []);

  // Fetch templates when templates tab is active
  useEffect(() => {
    if (activeTab === "templates" && templatesHook.templates.length === 0) {
      templatesHook.fetchTemplates();
    }
  }, [activeTab, templatesHook.templates.length]);

  const fetchOrgData = async () => {
    try {
      const data = await fetchPagesData();
      setOrgData(data);
    } catch (err) {
      console.error("Org data fetch error:", err);
    }
  };

  const handleLogout = useCallback(() => {
    logout();
    window.location.replace("/login");
  }, []);

  const handleLeadClick = useCallback((leadId) => {
    setViewingLeadId(leadId);
      router.push(`/leads/detail?id=${leadId}`);
  }, [router]);

  // CRUD Functions
  const handleAddLead = useCallback(() => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: "",
      source: "",
    });
    setShowAddModal(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setEditingLeadId(lead.id);
      setSelectedLead(lead);
      setFormData({
        first_name: lead.first_name || "",
        last_name: lead.last_name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        message: lead.message || "",
        source: lead.source || "",
      });
      setShowEditModal(true);
      setEditingLeadId(null);
  }, []);

  const handleDeleteLead = useCallback((lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  }, []);

  const handleSaveLead = useCallback(async () => {
    try {
      setSaving(true);

      if (showEditModal) {
        await leadsHook.updateLead(selectedLead.id, formData);
      } else {
        await leadsHook.createLead(formData);
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedLead(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
        source: "",
      });
    } catch (err) {
      console.error("Save error:", err);
      // Error is already handled by the hook
    } finally {
      setSaving(false);
    }
  }, [showEditModal, selectedLead, formData, leadsHook]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setSaving(true);
      await leadsHook.deleteLead(selectedLead.id);
      setShowDeleteModal(false);
      setSelectedLead(null);
    } catch (err) {
      console.error("Delete error:", err);
      // Error is already handled by the hook
    } finally {
      setSaving(false);
    }
  }, [selectedLead, leadsHook]);

  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Template CRUD Functions
  const handleAddTemplate = useCallback(() => {
    router.push("/templates/create/");
  }, [router]);

  const handleEditTemplate = useCallback((template) => {
    router.push(`/templates/detail?id=${template.id}`);
  }, [router]);

  const handleDeleteTemplate = useCallback(async (template) => {
    try {
      setDeletingTemplateId(template.id);
      await templatesHook.deleteTemplate(template.id);
    } catch (err) {
      console.error("Delete template error:", err);
      // Error is already handled by the hook
    } finally {
      setDeletingTemplateId(null);
    }
  }, [templatesHook]);

  const handleConfirmDeleteTemplate = async () => {
    try {
      setDeletingTemplateId(selectedTemplate.id);
      await templatesHook.deleteTemplate(selectedTemplate.id);
      setShowDeleteTemplateModal(false);
      setSelectedTemplate(null);
    } catch (err) {
      console.error("Template delete error:", err);
      // Error is already handled by the hook
    } finally {
      setDeletingTemplateId(null);
    }
  };

  // Search handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    leadsHook.handleSearch(searchInput);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    leadsHook.clearSearch();
  };

  return (
    <div className={styles.adminContainer}>
      {/* Simple Header - Only Domain Name and Logout */}
      <div className={theme.domainHeader}>
        <div className={styles.headerContent}>
          <h1 className={theme.domainName}>
            {orgData?.name || orgData?.title || "Clinic Admin"}
          </h1>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
            className={theme.logoutButton}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </Button>
        </div>
      </div>

      <div className={styles.mainWrapper}>
        {/* Modern EFC-POS Style Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarSection}>
              <ul className={styles.navList}>
                <li
                  className={`${styles.navItem} ${activeTab === "leads" ? styles.active : ""}`}
                  onClick={() => setActiveTab("leads")}
                >
                  <i className="fas fa-users"></i>
                  Leads
                </li>
                <li
                  className={`${styles.navItem} ${activeTab === "templates" ? styles.active : ""}`}
                  onClick={() => setActiveTab("templates")}
                >
                  <i className="fas fa-file-alt"></i>
                  Templates
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {activeTab === "leads" && (
            <>
              <LeadsHeader
                leadsCount={leadsHook.leadsCount}
                onAddLead={handleAddLead}
                searchInput={searchInput}
                onSearchInputChange={handleSearchInputChange}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={handleClearSearch}
                searchQuery={leadsHook.searchQuery}
                isSearching={leadsHook.isSearching}
              />

              <div className={theme.modernCard}>
                <div className={theme.tableHeader}>
                  <div className={styles.tableHeaderContent}>
                    <div className={styles.tableHeaderControls}>
                      <h3 className={theme.tableTitle}>All Leads</h3>
                      {!leadsHook.loading && (
                        <div className={styles.tableHeaderControls}>
                          <span className={styles.totalLeadsCount}>
                            Total Leads: {leadsHook.leadsCount}
                      </span>
                          <div className={styles.pageSizeWrapper}>
                            <span className={styles.perPageText}>Show:</span>
                      <select
                              className={theme.pageSizeSelect}
                              value={leadsHook.pageSize}
                        onChange={(e) => {
                          const newPageSize = parseInt(e.target.value);
                                leadsHook.handlePageSizeChange(newPageSize);
                        }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                            <span className={styles.perPageText}>per page</span>
                  </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <LeadsTable
                  leads={leadsHook.leads}
                  loading={leadsHook.loading}
                  fadeOut={leadsHook.fadeOut}
                  pageLoading={leadsHook.pageLoading}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onView={handleLeadClick}
                  editingId={editingLeadId}
                  viewingId={viewingLeadId}
                />
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={leadsHook.currentPage}
                totalPages={leadsHook.totalPages}
                pageLoading={leadsHook.pageLoading}
                onPageChange={leadsHook.handlePageChange}
                onPrevious={leadsHook.handlePreviousPage}
                onNext={leadsHook.handleNextPage}
                showPagination={!leadsHook.searchQuery}
              />
            </>
          )}

          {activeTab === "templates" && (
            <TemplatesTab
              templates={templatesHook.templates}
              loading={templatesHook.loading}
              onAddTemplate={handleAddTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              deletingTemplateId={deletingTemplateId}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <LeadModal
        show={showAddModal || showEditModal}
        onHide={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        mode={showEditModal ? 'edit' : 'add'}
        lead={selectedLead}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSaveLead}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the lead for{" "}
          {selectedLead?.first_name} {selectedLead?.last_name}? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              "Delete Lead"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Template Confirmation Modal */}
      <Modal
        show={showDeleteTemplateModal}
        onHide={() => setShowDeleteTemplateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the template "{selectedTemplate?.name}
          "? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteTemplateModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDeleteTemplate}
            disabled={deletingTemplateId}
          >
            {deletingTemplateId ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              "Delete Template"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default function LeadsPage() {
  return (
    <Suspense fallback={<DataLoader />}>
      <InnerLeadsPage />
    </Suspense>
  );
}
// export default LeadsPage;
