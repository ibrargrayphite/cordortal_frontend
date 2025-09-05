"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getAuthHeaders, isAuthenticated, logout } from "../../utils/auth";
import { fetchPagesData } from "../../utils/fetchPagesData";
import { useToast } from "../../components/Toast";
import { PageLoader, DataLoader, ButtonLoader } from "../../components/LoadingSpinner";
import { consentFormsAPI } from "../../utils/api";
import LeadsHeader from "../../components/Leads/LeadsHeader";
import styles from "./leadDetail.module.css";
import theme from "../../styles/adminTheme.module.css";

const TemplateForm = dynamic(() => import("../../components/TemplateForm/TemplateForm"), { ssr: false });
const BundledEditor = dynamic(() => import("../../components/BundledEditor/BundledEditor"), { ssr: false });

function LeadDetailClient() {
  const [lead, setLead] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  const [notesPage, setNotesPage] = useState(1);
  const [notesTotalPages, setNotesTotalPages] = useState(1);
  const [notesPageSize] = useState(5);
  const [loadingMoreNotes, setLoadingMoreNotes] = useState(false);
  const [hasMoreNotes, setHasMoreNotes] = useState(false);
  const [consentForms, setConsentForms] = useState([]);
  const [filteredConsentForms, setFilteredConsentForms] = useState([]);
  const [consentFormsLoading, setConsentFormsLoading] = useState(false);
  const [consentSearchQuery, setConsentSearchQuery] = useState("");
  const [consentFormsPage, setConsentFormsPage] = useState(1);
  const [consentFormsTotalPages, setConsentFormsTotalPages] = useState(1);
  const [consentFormsPageSize] = useState(5);
  const [loadingMoreConsentForms, setLoadingMoreConsentForms] = useState(false);
  const [hasMoreConsentForms, setHasMoreConsentForms] = useState(false);
  const [selectedConsentForm, setSelectedConsentForm] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [fromNotesFlow, setFromNotesFlow] = useState(false);
  const [generatingConsentForm, setGeneratingConsentForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");
  const { showError, showSuccess, showWarning } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [showCancelView, setShowCancelView] = useState(false);

  // Open a blank editor + live preview
  const handleCreateBlankTemplate = () => {
    setSelectedConsentForm(null); // Clear selected consent form
    setShowCancelView(false); // Reset cancel view
    setEditingTemplate({
      template: "",
      name: "",
    });
    setActiveTab("consent");
    setFromNotesFlow(false);
    //showSuccess("Blank template ready for editing!");
  };

  const handleCancelConsentForm = () => {
    setSelectedConsentForm(null);
    setEditingTemplate(null);
    setShowCancelView(true);
    //showSuccess("Consent form canceled.");
  };

  // Fetch templates for dropdown
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
      showError("Failed to load templates. Please try again.");
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Handle generating consent form from template
  const handleGenerateConsentForm = async (templateId) => {
    try {
      setGeneratingConsentForm(true);
      setSavingTemplate(true);
      setSelectedConsentForm(null); // Clear selected consent form
      setShowCancelView(false); // Reset cancel view

      if (!templateId) {
        throw new Error("No template selected");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const templateResponse = await fetch(`${baseUrl}/leads/organization-templates/${templateId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!templateResponse.ok) {
        throw new Error(`Failed to fetch template: ${templateResponse.status}`);
      }

      const templateData = await templateResponse.json();
      if (!templateData?.template?.trim()) {
        throw new Error("Template HTML is missing or empty");
      }

      if (activeTab === "consent") {
        // Consent tab: Load template HTML directly
        setEditingTemplate({
          name: templateData.name || "Generated Consent Form",
          template: templateData.template,
        });
        setActiveTab("consent");
        setFromNotesFlow(false);
        //showSuccess("Consent form template loaded successfully!");
      } else {
        // Notes tab: Generate consent form with notes
        const noteText = selectedNote ? selectedNote.notes : newNote;
        if (!noteText || !noteText.trim()) {
          showError("Please write something in note");
          return;
        }

        const payload = {
          template_html: templateData.template,
          notes_text: noteText.trim(),
        };

        const response = await fetch(`${baseUrl}/leads/render/consent-form/`, {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.template_html?.[0] || errorData.detail || "Failed to generate consent form");
        }

        const data = await response.json();
        if (!data?.html) {
          throw new Error("No html field in API response");
        }

        setEditingTemplate({
          name: templateData.name || "Generated Consent Form",
          template: data.html,
          notes_text: data.notes_text || noteText.trim(),
        });
        setActiveTab("consent");
        setFromNotesFlow(true);
        //showSuccess("Consent form loaded into editor");
      }
    } catch (err) {
      console.error("Error in handleGenerateConsentForm:", err);
      showError(err.message || "Could not generate consent form. Please try again.");
    } finally {
      setGeneratingConsentForm(false);
      setSavingTemplate(false);
    }
  };

  const handleFormChange = (field, value) => {
    setEditingTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle canceling
  const handleTemplateCancel = () => {
    setEditingTemplate(null);
    setSelectedConsentForm(null);
    setFromNotesFlow(false);
    setShowCancelView(true); // Show cancel view after canceling
  };

  // Handle saving
  const handleTemplateSave = async (savedConsentForm) => {
    try {
      // Refresh the consent forms list to show the new/updated record
      await fetchConsentForms();
      
      // If we have the saved consent form data, update the selected consent form
      if (savedConsentForm && savedConsentForm.id) {
        setSelectedConsentForm(savedConsentForm);
        
        // If the consent form is signed, clear the editing state to show preview
        if (savedConsentForm.is_signed) {
          setEditingTemplate(null);
          setShowCancelView(false);
        } else {
          // Update the editing template with the saved data to ensure we're in edit mode
          setEditingTemplate({
            id: savedConsentForm.id,
            template: savedConsentForm.consent_data || "",
            name: savedConsentForm.name || "",
            is_signed: savedConsentForm.is_signed,
          });
        }
      }
      
      // Success message is already shown in TemplateForm component
    } catch (error) {
      console.error("Error in handleTemplateSave:", error);
      showError("Failed to refresh consent forms list");
    }
  };

  // Handle editing or previewing a consent form
  const handleTemplateEdit = (consentForm) => {
    setSelectedConsentForm(consentForm);
    setShowCancelView(false); // Reset cancel view
    setEditingTemplate({
      id: consentForm.id,
      template: consentForm.consent_data || "",
      name: consentForm.name || "",
    });
  };

  // Handle back navigation
  const handleBackToLeads = async () => {
    setNavigatingBack(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push("/leads");
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.replace("/login");
  };

  // Search and filter notes
  const handleSearchNotes = (query = searchQuery, dateFilterValue = dateFilter) => {
    setSearchQuery(query);
    if (!query.trim() && !dateFilterValue) {
      const sortedNotes = [...notes].sort((a, b) => {
        const aDate = new Date(a.created_at || a.date_created);
        const bDate = new Date(b.created_at || b.date_created);
        return bDate - aDate;
      });
      setFilteredNotes(sortedNotes);
      return;
    }

    let filtered = [...notes];
    if (query.trim()) {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter((note) =>
        searchTerms.every((term) => note.notes.toLowerCase().includes(term))
      );
    }

    if (dateFilterValue) {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.created_at || note.date_created);
        switch (dateFilterValue) {
          case "today":
            return noteDate >= todayStart;
          case "yesterday":
            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            const yesterdayEnd = new Date(todayStart);
            return noteDate >= yesterdayStart && noteDate < yesterdayEnd;
          case "this_week":
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            return noteDate >= weekStart;
          case "last_week":
            const lastWeekEnd = new Date(todayStart);
            lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay());
            const lastWeekStart = new Date(lastWeekEnd);
            lastWeekStart.setDate(lastWeekStart.getDate() - 7);
            return noteDate >= lastWeekStart && noteDate < lastWeekEnd;
          case "this_month":
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return noteDate >= monthStart;
          case "last_month":
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);
            return noteDate >= lastMonthStart && noteDate < lastMonthEnd;
          case "this_year":
            const yearStart = new Date(today.getFullYear(), 0, 1);
            return noteDate >= yearStart;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      const aDate = new Date(a.created_at || a.date_created);
      const bDate = new Date(b.created_at || b.date_created);
      return bDate - aDate;
    });

    setFilteredNotes(filtered);
  };

  const handleDateFilterChange = (newDateFilter) => {
    setDateFilter(newDateFilter);
    handleSearchNotes(searchQuery, newDateFilter);
    setShowDateFilter(false);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setShowDateFilter(false);
    handleSearchNotes("", "");
  };

  // Search consent forms by name
  const handleSearchConsentForms = (query) => {
    setConsentSearchQuery(query);
    if (!query.trim()) {
      setFilteredConsentForms(consentForms);
      return;
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    const filtered = consentForms.filter((form) =>
      searchTerms.every((term) => 
        (form.name || `Consent Form ${form.id}`).toLowerCase().includes(term)
      )
    );
    setFilteredConsentForms(filtered);
  };

  const clearConsentSearch = () => {
    setConsentSearchQuery("");
    setFilteredConsentForms(consentForms);
  };

  const getDateFilterLabel = (filter) => {
    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      this_week: "This week",
      last_week: "Last week",
      this_month: "This month",
      last_month: "Last month",
      this_year: "This year",
    };
    return labels[filter] || "All dates";
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

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/login");
      return;
    }

    if (!leadId) {
      showError("Lead ID is required");
      setLoading(false);
      return;
    }

    fetchLeadData();
    fetchOrgData();
    fetchNotes();
  }, [leadId]);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleSearchNotes(searchQuery, dateFilter);
  }, [notes]);

  useEffect(() => {
    if (activeTab === "consent" && consentForms.length === 0) {
      fetchConsentForms();
    }
  }, [activeTab, consentForms.length]);

  const fetchConsentForms = async (page = 1, loadMore = false) => {
    if (!leadId) return;
    try {
      if (loadMore) {
        setLoadingMoreConsentForms(true);
      } else {
        setConsentFormsLoading(true);
      }

      const data = await consentFormsAPI.getConsentForms(leadId, page, consentFormsPageSize);
      let formsArray = data.results || [];
      let totalCount = data.count || 0;
      let hasNext = !!data.next;

      if (loadMore) {
        const newForms = [...consentForms, ...formsArray];
        setConsentForms(newForms);
        setFilteredConsentForms(newForms);
      } else {
        setConsentForms(formsArray);
        setFilteredConsentForms(formsArray);
      }

      setConsentFormsPage(page);
      setConsentFormsTotalPages(Math.ceil(totalCount / consentFormsPageSize));
      setHasMoreConsentForms(hasNext);
    } catch (error) {
      console.error("Error fetching consent forms:", error);
      showError("Failed to fetch consent forms");
    } finally {
      setConsentFormsLoading(false);
      setLoadingMoreConsentForms(false);
    }
  };

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/leads/${leadId}/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (response.status === 404) {
        showError("Lead not found");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const leadData = await response.json();
      setLead(leadData);
    } catch (err) {
      console.error("Lead fetch error:", err);
      let errorMessage = "Failed to load lead details";
      if (err.name === "AbortError") {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgData = async () => {
    try {
      const data = await fetchPagesData();
      setOrgData(data);
    } catch (err) {
      console.error("Org data fetch error:", err);
    }
  };

  const fetchNotes = async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMoreNotes(true);
      } else {
        setNotesLoading(true);
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(
        `${baseUrl}/leads/notes/?lead_id=${leadId}&page=${page}&page_size=${notesPageSize}`,
        { headers: getAuthHeaders() }
      );

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notesData = await response.json();
      let notesArray = notesData.results || [];
      let totalCount = notesData.count || 0;
      let hasNext = !!notesData.next;

      if (loadMore) {
        setNotes([...notes, ...notesArray]);
      } else {
        setNotes(notesArray);
      }

      setNotesPage(page);
      setNotesTotalPages(Math.ceil(totalCount / notesPageSize));
      setHasMoreNotes(hasNext);
    } catch (err) {
      console.error("Notes fetch error:", err);
      showError("Failed to load notes. Please try again.");
    } finally {
      setNotesLoading(false);
      setLoadingMoreNotes(false);
    }
  };

  const loadMoreNotes = () => {
    if (hasMoreNotes && !loadingMoreNotes) {
      fetchNotes(notesPage + 1, true);
    }
  };

  const handleNotesScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreNotes && !loadingMoreNotes) {
      loadMoreNotes();
    }
  };

  const loadMoreConsentForms = () => {
    if (hasMoreConsentForms && !loadingMoreConsentForms) {
      fetchConsentForms(consentFormsPage + 1, true);
    }
  };

  const handleConsentFormsScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreConsentForms && !loadingMoreConsentForms) {
      loadMoreConsentForms();
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) {
      showWarning("Please enter a note before saving.");
      return;
    }

    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const payload = {
        notes: newNote.trim(),
        lead: parseInt(leadId),
      };

      const response = await fetch(`${baseUrl}/leads/notes/`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotesPage(1);
      fetchNotes(1, false);
      setNewNote("");
      showSuccess("Note saved successfully!");
    } catch (err) {
      console.error("Create note error:", err);
      showError("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (noteId, updatedContent) => {
    if (!updatedContent.trim()) {
      showWarning("Note cannot be empty.");
      return;
    }

    try {
      setEditingNote(noteId);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const payload = {
        notes: updatedContent.trim(),
        lead: parseInt(leadId),
      };

      const response = await fetch(`${baseUrl}/leads/notes/${noteId}/`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedNote = await response.json();
      setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
      setSelectedNote(null);
      showSuccess("Note updated successfully!");
    } catch (err) {
      console.error("Update note error:", err);
      showError("Failed to update note. Please try again.");
    } finally {
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setDeletingNote(noteId);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/leads/notes/${noteId}/`, {
        method: "DELETE",
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

      setNotes(notes.filter((note) => note.id !== noteId));
      setSelectedNote(null);
      showSuccess("Note deleted successfully!");
    } catch (err) {
      console.error("Delete note error:", err);
      showError("Failed to delete note. Please try again.");
    } finally {
      setDeletingNote(null);
    }
  };

  const handleDeleteConsentForm = async (consentFormId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/leads/consent-forms/${consentFormId}/`, {
        method: "DELETE",
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

      // Remove from consent forms list
      setConsentForms(consentForms.filter((form) => form.id !== consentFormId));
      setFilteredConsentForms(filteredConsentForms.filter((form) => form.id !== consentFormId));
      
      // Reset selected form and editing state
      setSelectedConsentForm(null);
      setEditingTemplate(null);
      setShowCancelView(false);
      
      showSuccess("Consent form deleted successfully!");
    } catch (err) {
      console.error("Delete consent form error:", err);
      showError("Failed to delete consent form. Please try again.");
    }
  };

  if (loading) {
    return <PageLoader message="Loading lead details..." />;
  }

  if (!lead) {
    return <PageLoader message="Lead not found. Redirecting..." />;
  }

  return (
    <div className={`${styles.modernLeadContainer} ${fadeIn ? styles.fadeIn : ""}`}>
      {/* Modern Header */}
      <div className={styles.modernHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Button
              variant="ghost"
              onClick={handleBackToLeads}
              disabled={navigatingBack}
              className={`${styles.backButton} ${navigatingBack ? styles.loading : ""}`}
            >
              {navigatingBack ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-left me-2"></i> Back to Leads
                </>
              )}
            </Button>
            <div className={styles.leadInfo}>
              <h1 className={styles.leadTitle}>Lead Details</h1>
              <p className={styles.leadEmail}>{lead.email}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.orgName}>{orgData?.name || orgData?.title || "Clinic Admin"}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <i className="fas fa-sign-out-alt me-2"></i> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className={styles.topNavTabs}>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.topTab} ${activeTab === "notes" ? styles.active : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <i className="fas fa-sticky-note me-2"></i> 
            <span>Notes</span>
            {notes.length > 0 && (
              <span className={styles.tabBadge}>
                {searchQuery ? `${filteredNotes.length}/${notes.length}` : notes.length}
              </span>
            )}
          </button>
          <button
            className={`${styles.topTab} ${activeTab === "consent" ? styles.active : ""}`}
            onClick={() => setActiveTab("consent")}
          >
            <i className="fas fa-file-signature me-2"></i> 
            <span>Consent Forms</span>
            {consentForms.length > 0 && (
              <span className={styles.tabBadge}>
                {consentSearchQuery ? `${filteredConsentForms.length}/${consentForms.length}` : consentForms.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentWrapper}>
        <div className={styles.mainLayout}>
          {/* Left Sidebar for Data */}
          <div className={styles.dataSidebar}>

            {activeTab === "notes" && (
              <>
                <div className={styles.searchSection}>
                  <div className={styles.searchInputWrapper}>
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => handleSearchNotes(e.target.value, dateFilter)}
                      className={styles.searchInput}
                    />
                    {(searchQuery || dateFilter) && (
                      <button
                        onClick={clearAllFilters}
                        className={styles.clearSearch}
                        title="Clear all filters"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className={styles.filterControls}>
                    <button
                      onClick={() => setShowDateFilter(!showDateFilter)}
                      className={`${styles.dateFilterToggle} ${dateFilter ? styles.active : ""} ${dateFilter ? styles.withClear : ""}`}
                    >
                      <div className={styles.dateFilterContent}>
                        <i className="fas fa-calendar-alt me-1"></i>
                        <span className={styles.dateFilterText}>
                          {dateFilter ? getDateFilterLabel(dateFilter) : "Filter by date"}
                        </span>
                      </div>
                      <div className={styles.dateFilterActions}>
                        {dateFilter && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDateFilterChange("");
                              setShowDateFilter(false);
                            }}
                            className={styles.clearDateFilter}
                            title="Clear date filter"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDateFilterChange("");
                                setShowDateFilter(false);
                              }
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </span>
                        )}
                        <i
                          className={`fas fa-chevron-${showDateFilter ? "up" : "down"} ${styles.chevronIcon}`}
                        ></i>
                      </div>
                    </button>
                  </div>

                  {showDateFilter && (
                    <div className={styles.dateFilterOptions}>
                      {["", "today", "yesterday", "this_week", "last_week", "this_month", "last_month", "this_year"].map(
                        (filter) => (
                          <button
                            key={filter}
                            onClick={() => handleDateFilterChange(filter)}
                            className={`${styles.dateOption} ${dateFilter === filter ? styles.selected : ""}`}
                          >
                            {getDateFilterLabel(filter)}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {(searchQuery || dateFilter) && (
                    <div className={styles.searchResults}>
                      <span className={styles.resultCount}>
                        {filteredNotes.length} of {notes.length} notes
                      </span>
                      {filteredNotes.length > 0 && (
                        <span className={styles.resultInfo}>
                          {searchQuery && dateFilter
                            ? "• text & date filtered"
                            : searchQuery
                              ? "• text filtered"
                              : dateFilter
                                ? "• date filtered"
                                : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.notesList} onScroll={handleNotesScroll}>
                  {notesLoading ? (
                    <div className={styles.notesLoading}>
                      <DataLoader message="Loading notes..." />
                    </div>
                  ) : filteredNotes.length > 0 ? (
                    <>
                      {filteredNotes.map((note) => {
                        const dateTime = formatDateTime(note.created_at || note.date_created);
                        const previewText = note.notes.length > 50 ? `${note.notes.substring(0, 50)}...` : note.notes;

                        return (
                          <div
                            key={note.id}
                            className={`${styles.noteItem} ${selectedNote?.id === note.id ? styles.active : ""}`}
                            onClick={() => setSelectedNote(note)}
                          >
                            <div className={styles.notePreview}>{previewText}</div>
                            <div className={styles.noteDate}>
                              <span className={styles.dateText}>{dateTime.date}</span>
                              <span className={styles.timeText}>{dateTime.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : searchQuery || dateFilter ? (
                    <div className={styles.emptyNotes}>
                      <i className="fas fa-search"></i>
                      <p>No notes found</p>
                      <small>Try a different search term</small>
                    </div>
                  ) : (
                    <div className={styles.emptyNotes}>
                      <i className="fas fa-sticky-note"></i>
                      <p>No notes yet</p>
                      <small>Start writing your first note</small>
                    </div>
                  )}
                </div>
                
                {hasMoreNotes && !searchQuery && !dateFilter && (
                  <div className={styles.loadMoreNotes}>
                    {loadingMoreNotes ? (
                      <div className={styles.loadingMore}>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Loading more notes...</span>
                      </div>
                    ) : (
                      <button onClick={loadMoreNotes} className={styles.loadMoreButton}>
                        <i className="fas fa-chevron-down"></i> Load more notes
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            {activeTab === "consent" && (
              <>
                <div className={styles.searchSection}>
                  <div className={styles.searchInputWrapper}>
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search consent forms..."
                      value={consentSearchQuery}
                      onChange={(e) => handleSearchConsentForms(e.target.value)}
                      className={styles.searchInput}
                    />
                    {consentSearchQuery && (
                      <button
                        onClick={clearConsentSearch}
                        className={styles.clearSearch}
                        title="Clear search"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  {consentSearchQuery && (
                    <div className={styles.searchResults}>
                      <span className={styles.resultCount}>
                        {filteredConsentForms.length} of {consentForms.length} consent forms
                      </span>
                      <span className={styles.resultInfo}>• name filtered</span>
                    </div>
                  )}
                </div>

                <div className={styles.consentList} onScroll={handleConsentFormsScroll}>
                  {consentFormsLoading ? (
                  <div className={styles.loadingState}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading consent forms...</p>
                  </div>
                ) : filteredConsentForms.length > 0 ? (
                  <>
                    {filteredConsentForms?.map((consentForm) => (
                      <div
                        key={consentForm.id}
                        className={`${styles.consentFormItem} ${selectedConsentForm?.id === consentForm.id ? styles.selected : ""}`}
                        onClick={() => handleTemplateEdit(consentForm)}
                      >
                        <div className={styles.consentFormInfo}>
                          <div className={styles.consentFormTitle}>
                            <i className="fas fa-file-signature"></i>
                            {consentForm.name || `Consent Form ${consentForm.id}`}
                          </div>
                          <div className={styles.consentFormStatus}>
                            <span
                              className={`${styles.statusBadge} ${consentForm.is_signed ? styles.signed : styles.unsigned}`}
                            >
                              {consentForm.is_signed ? "Signed" : "Unsigned"}
                            </span>
                          </div>
                        </div>
                        <div className={styles.consentFormActions}>
                          <button
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTemplateEdit(consentForm);
                            }}
                            title={consentForm.is_signed ? "View Consent Form" : "Edit Consent Form"}
                          >
                            <i className={`fas ${consentForm.is_signed ? "fa-eye" : "fa-edit"}`}></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : consentSearchQuery ? (
                  <div className={styles.emptyNotes}>
                    <i className="fas fa-search"></i>
                    <p>No consent forms found</p>
                    <small>Try a different search term</small>
                  </div>
                ) : (
                  <div className={styles.emptyNotes}>
                    <i className="fas fa-file-signature"></i>
                    <p>No consent forms yet</p>
                    <small>Generate your first consent form</small>
                  </div>
                )}
                </div>
                
                {hasMoreConsentForms && !consentSearchQuery && (
                  <div className={styles.loadMoreConsentForms}>
                    {loadingMoreConsentForms ? (
                      <div className={styles.loadingMore}>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Loading more consent forms...</span>
                      </div>
                    ) : (
                      <button onClick={loadMoreConsentForms} className={styles.loadMoreButton}>
                        <i className="fas fa-chevron-down"></i> Load more consent forms
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Right Panel for Actions/Editing */}
          <div className={styles.actionPanel}>
            <div className={styles.actionPanelHeader}>
              <h3 className={styles.panelTitle}>
                {activeTab === "notes" && (selectedNote ? "Edit Note" : "Create Note")}
                {activeTab === "consent" && (
                  selectedConsentForm?.is_signed 
                    ? "Signed Consent Form Preview" 
                    : editingTemplate 
                      ? "Consent Form Editor" 
                      : "Consent Actions"
                )}
              </h3>
              {activeTab === "consent" && !selectedConsentForm?.is_signed && (
                <div className={styles.actionButtons}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateBlankTemplate}
                    disabled={savingTemplate}
                    className={styles.actionButton}
                  >
                    <i className="fas fa-plus me-2"></i> New Blank Form
                  </Button>
                  <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchTemplates()}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={savingTemplate}
                        className={styles.primaryActionButton}
                      >
                        {savingTemplate ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i> Loading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-alt me-2"></i> Generate Form
                          </>
                        )}
                      </Button>
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
              )}
            </div>

            {activeTab === "notes" && (
              <div className={styles.notesActionContent}>
                {selectedNote ? (
                  <div className={styles.editNoteInterface}>
                    <div className={styles.noteMetaInfo}>
                      <small className={styles.noteTimestamp}>
                        Created: {formatDateTime(selectedNote.created_at || selectedNote.date_created).full}
                      </small>
                      <div className={styles.noteActions}>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteNote(selectedNote.id)}
                          disabled={deletingNote === selectedNote.id}
                          className={styles.dangerButton}
                        >
                          {deletingNote === selectedNote.id ? (
                            <>
                              <div className={styles.spinner}></div> Deleting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trash me-1"></i> Delete
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedNote(null)}
                          className={styles.secondaryButton}
                        >
                          <i className="fas fa-times me-1"></i> Cancel
                        </Button>
                      </div>
                    </div>
                    <div className={styles.editArea}>
                      <textarea
                        className={styles.noteTextarea}
                        value={selectedNote.notes}
                        onChange={(e) => setSelectedNote({ ...selectedNote, notes: e.target.value })}
                        placeholder="Write your note here..."
                        rows={15}
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="default"
                          onClick={() => handleUpdateNote(selectedNote.id, selectedNote.notes)}
                          disabled={editingNote === selectedNote.id || !selectedNote.notes.trim()}
                          className={theme.successButton}
                        >
                          {editingNote === selectedNote.id ? (
                            <>
                              <div className={styles.spinner}></div> Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i> Save Changes
                            </>
                          )}
                        </Button>
                        <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchTemplates()} className="ms-2">
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={savingTemplate}
                            >
                              {savingTemplate ? (
                                <>
                                  <i className="fas fa-spinner fa-spin me-2"></i> Loading...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-file-alt me-2"></i> Generate Consent Form
                                </>
                              )}
                            </Button>
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
                  </div>
                ) : (
                  <div className={styles.newNoteInterface}>
                    <div className={styles.editArea}>
                      <textarea
                        className={styles.noteTextarea}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Start writing a new note for this lead..."
                        rows={15}
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="primary"
                          onClick={handleCreateNote}
                          disabled={saving || !newNote.trim()}
                          className={theme.successButton}
                        >
                          {saving ? (
                            <>
                              <div className={styles.spinner}></div> Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i> Save Note
                            </>
                          )}
                        </Button>
                        <DropdownMenu onOpenChange={(isOpen) => isOpen && fetchTemplates()} className="ms-2">
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={savingTemplate}
                            >
                              {savingTemplate ? (
                                <>
                                  <i className="fas fa-spinner fa-spin me-2"></i> Loading...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-file-alt me-2"></i> Generate Consent Form
                                </>
                              )}
                            </Button>
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
                  </div>
                )}
              </div>
            )}

            {activeTab === "consent" && (
              <div className={styles.consentActionContent}>
                {showCancelView ? (
                  <div className={styles.defaultConsentInterface}>
                    <div className={styles.consentPlaceholder}>
                      <i className="fas fa-file-signature"></i>
                      <h5>No Consent Form Selected</h5>
                      <p>Choose a consent form from the sidebar or select a template to create a new one</p>
                    </div>
                  </div>
                ) : selectedConsentForm?.is_signed ? (
                  <div className={styles.signedConsentPreviewPage}>
                    <div className={styles.previewPageHeader}>
                      <div className={styles.previewPageInfo}>
                        <h2 className={styles.previewPageTitle}>
                          {selectedConsentForm.name || `Consent Form ${selectedConsentForm.id}`}
                        </h2>
                        <div className={styles.previewPageMeta}>
                          <span className={`${styles.statusBadge} ${styles.signed}`}>
                            <i className="fas fa-check-circle me-2"></i>
                            Signed
                          </span>
                          <span className={styles.previewPageSubtitle}>
                            Lead: {selectedConsentForm.lead_email}
                          </span>
                          {selectedConsentForm.signed_at && (
                            <span className={styles.previewPageSubtitle}>
                              Signed: {formatDateTime(selectedConsentForm.signed_at).full}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.previewPageActions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedConsentForm(null);
                            setEditingTemplate(null);
                            setShowCancelView(false);
                          }}
                          className={styles.secondaryButton}
                        >
                          <i className="fas fa-arrow-left me-2"></i> Back to List
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteConsentForm(selectedConsentForm.id)}
                          className={styles.dangerButton}
                        >
                          <i className="fas fa-trash me-2"></i> Delete
                        </Button>
                      </div>
                    </div>
                    <div className={styles.previewPageContent}>
                      <div
                        className={styles.signedConsentDocument}
                        dangerouslySetInnerHTML={{
                          __html: selectedConsentForm.consent_data || "<p>No content available</p>",
                        }}
                      />
                    </div>
                  </div>
                ) : editingTemplate ? (
                  <TemplateForm
                    mode="consent"
                    handleFormChange={handleFormChange}
                    handleSave={handleTemplateSave}
                    saving={savingTemplate}
                    setIsEditing={setEditingTemplate}
                    setFormData={setEditingTemplate}
                    formData={editingTemplate}
                    template={editingTemplate}
                    handleCancel={handleTemplateCancel}
                    lead={lead}
                    fetchConsentForms={fetchConsentForms}
                    isSigned={selectedConsentForm?.is_signed || false}
                    fromNotesFlow={fromNotesFlow}
                    setFromNotesFlow={setFromNotesFlow}
                    handleCancelConsentForm={handleCancelConsentForm} // New prop
                  />
                ) : selectedConsentForm ? (
                  <div className={styles.viewConsentInterface}>
                    <div className={styles.consentMetaInfo}>
                      <div className={styles.consentInfo}>
                        <h4 className={styles.selectedConsentTitle}>
                          {selectedConsentForm.name || `Consent Form ${selectedConsentForm.id}`}
                        </h4>
                        <div className={styles.consentMeta}>
                          <span
                            className={`${styles.statusBadge} ${selectedConsentForm.is_signed ? styles.signed : styles.unsigned}`}
                          >
                            {selectedConsentForm.is_signed ? "Signed" : "Unsigned"}
                          </span>
                          <small className={styles.consentSubtitle}>Lead: {selectedConsentForm.lead_email}</small>
                        </div>
                      </div>
                      <div className={styles.consentActions}>
                        {!selectedConsentForm.is_signed && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleTemplateEdit(selectedConsentForm)}
                            className={styles.primaryButton}
                          >
                            <i className="fas fa-edit me-2"></i> Edit Form
                          </Button>
                        )}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setSelectedConsentForm(null)}
                          className={styles.secondaryButton}
                        >
                          <i className="fas fa-times me-2"></i> Close
                        </Button>
                      </div>
                    </div>
                    <div className={styles.fullWidthConsentPreview}>
                      <div
                        className={styles.fullWidthTemplatePreview}
                        dangerouslySetInnerHTML={{
                          __html: selectedConsentForm.consent_data || "<p>No content available</p>",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={styles.defaultConsentInterface}>
                    <div className={styles.consentPlaceholder}>
                      <i className="fas fa-file-signature"></i>
                      <h5>No Consent Form Selected</h5>
                      <p>Choose a consent form from the sidebar or select a template to create a new one</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  return (
    <Suspense fallback={<DataLoader />}>
      <LeadDetailClient />
    </Suspense>
  );
}

export const revalidate = 0;