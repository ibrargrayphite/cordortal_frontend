"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from "next/dynamic";

import { getAuthHeaders, isAuthenticated, logout } from '../../utils/auth';
import { fetchPagesData } from '../../utils/fetchPagesData';
import { useToast } from '../../components/Toast';
import { PageLoader, DataLoader } from '../../components/LoadingSpinner';
import { consentFormsAPI } from '../../utils/api';
// import BundledEditor from '../../components/BundledEditor/BundledEditor';
const BundledEditor = dynamic(
  () => import("../../components/BundledEditor/BundledEditor"),
  { ssr: false }
);
import LeadsHeader from '../../components/Leads/LeadsHeader';
import styles from './leadDetail.module.css';
import theme from '../../styles/adminTheme.module.css';

function LeadDetailClient() {
  const [lead, setLead] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  
  // Notes management
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // Scroll pagination for notes
  const [notesPage, setNotesPage] = useState(1);
  const [notesTotalPages, setNotesTotalPages] = useState(1);
  const [notesPageSize] = useState(5); // 5 notes per page
  const [loadingMoreNotes, setLoadingMoreNotes] = useState(false);
  const [hasMoreNotes, setHasMoreNotes] = useState(false);
  
  // Consent forms management
  const [consentForms, setConsentForms] = useState([]);
  const [consentFormsLoading, setConsentFormsLoading] = useState(false);
  const [selectedConsentForm, setSelectedConsentForm] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get('id');
  const { showError, showSuccess, showWarning } = useToast();

  const handleBackToLeads = async () => {
    setNavigatingBack(true);
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    router.push('/leads');
  };

  const handleLogout = () => {
    logout();
    window.location.replace('/login');
  };

  // Enhanced search functionality for notes with date filtering
  const handleSearchNotes = (query = searchQuery, dateFilterValue = dateFilter) => {
    setSearchQuery(query);
    
    // If no filters are active, show original notes (sorted)
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
    
    // Apply text search filter
    if (query.trim()) {
      const searchTerms = query.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter(note => {
        const noteContent = note.notes.toLowerCase();
        return searchTerms.every(term => 
          noteContent.includes(term)
        );
      });
    }
    
    // Apply date filter
    if (dateFilterValue) {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.created_at || note.date_created);
        
        switch (dateFilterValue) {
          case 'today':
            return noteDate >= todayStart;
          case 'yesterday':
            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            const yesterdayEnd = new Date(todayStart);
            return noteDate >= yesterdayStart && noteDate < yesterdayEnd;
          case 'this_week':
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            return noteDate >= weekStart;
          case 'last_week':
            const lastWeekEnd = new Date(todayStart);
            lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay());
            const lastWeekStart = new Date(lastWeekEnd);
            lastWeekStart.setDate(lastWeekStart.getDate() - 7);
            return noteDate >= lastWeekStart && noteDate < lastWeekEnd;
          case 'this_month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return noteDate >= monthStart;
          case 'last_month':
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);
            return noteDate >= lastMonthStart && noteDate < lastMonthEnd;
          case 'this_year':
            const yearStart = new Date(today.getFullYear(), 0, 1);
            return noteDate >= yearStart;
          default:
            return true;
        }
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const aDate = new Date(a.created_at || a.date_created);
      const bDate = new Date(b.created_at || b.date_created);
      return bDate - aDate;
    });
    
    setFilteredNotes(filtered);
  };

  // Handle date filter change
  const handleDateFilterChange = (newDateFilter) => {
    setDateFilter(newDateFilter);
    handleSearchNotes(searchQuery, newDateFilter);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFilter('');
    setShowDateFilter(false);
    // This will trigger handleSearchNotes with empty filters, showing original notes
    handleSearchNotes('', '');
  };

  // Get label for date filter
  const getDateFilterLabel = (filter) => {
    const labels = {
      'today': 'Today',
      'yesterday': 'Yesterday', 
      'this_week': 'This week',
      'last_week': 'Last week',
      'this_month': 'This month',
      'last_month': 'Last month',
      'this_year': 'This year'
    };
    return labels[filter] || 'All dates';
  };

  // Format datetime for display
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        full: date.toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        })
      };
    } catch (error) {
      return {
        date: 'Invalid date',
        time: '',
        full: 'Invalid date'
      };
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace('/login');
      return;
    }

    if (!leadId) {
      showError('Lead ID is required');
      setLoading(false);
      return;
    }

    fetchLeadData();
    fetchOrgData();
    fetchNotes();
  }, [leadId]);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter notes when search query or notes change
  useEffect(() => {
    handleSearchNotes(searchQuery, dateFilter);
  }, [notes]);

  // Fetch consent forms when consent tab is active
  useEffect(() => {
    if (activeTab === 'consent' && consentForms.length === 0) {
      fetchConsentForms();
    }
  }, [activeTab, consentForms.length]);

  const fetchConsentForms = async () => {
    if (!leadId) return;
    
    try {
      setConsentFormsLoading(true);
      const data = await consentFormsAPI.getConsentForms(leadId);
      setConsentForms(data.results || []);
    } catch (error) {
      console.error('Error fetching consent forms:', error);
      showError('Failed to fetch consent forms');
    } finally {
      setConsentFormsLoading(false);
    }
  };

  const handleTemplateEdit = (consentForm) => {
    setSelectedConsentForm(consentForm);
    setEditingTemplate({
      id: consentForm.template,
      name: consentForm.template_name,
      body: consentForm.template_body
    });
  };

  const handleTemplateSave = async () => {
    if (!editingTemplate) return;
    
    try {
      setSavingTemplate(true);
      await consentFormsAPI.updateTemplate(editingTemplate.id, {
        body: editingTemplate.body
      });
      
      showSuccess('Template updated successfully');
      setEditingTemplate(null);
      setSelectedConsentForm(null);
      
      // Refresh consent forms to get updated data
      await fetchConsentForms();
    } catch (error) {
      console.error('Error updating template:', error);
      showError('Failed to update template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleTemplateCancel = () => {
    setEditingTemplate(null);
    setSelectedConsentForm(null);
  };

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const response = await fetch(`${baseUrl}/leads/${leadId}/`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (response.status === 404) {
        showError('Lead not found');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const leadData = await response.json();
      setLead(leadData);
    } catch (err) {
      console.error('Lead fetch error:', err);
      let errorMessage = 'Failed to load lead details';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection.';
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
      console.error('Org data fetch error:', err);
    }
  };

  // Notes API Functions with pagination
  const fetchNotes = async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMoreNotes(true);
      } else {
        setNotesLoading(true);
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const response = await fetch(`${baseUrl}/leads/notes/?lead_id=${leadId}&page=${page}&page_size=${notesPageSize}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notesData = await response.json();
      
      // Handle paginated response structure
      let notesArray = [];
      let totalCount = 0;
      let hasNext = false;
      
      if (notesData.results) {
        // Paginated response
        notesArray = notesData.results;
        totalCount = notesData.count || 0;
        hasNext = !!notesData.next;
      } else {
        // Non-paginated response (fallback)
        notesArray = Array.isArray(notesData) ? notesData : [];
        totalCount = notesArray.length;
        hasNext = false;
      }
      
      if (loadMore) {
        // Append new notes to existing ones
        const updatedNotes = [...notes, ...notesArray];
        setNotes(updatedNotes);
        // Don't update filteredNotes here - let the useEffect handle it
      } else {
        // Replace notes (first load)
        setNotes(notesArray);
        // Don't update filteredNotes here - let the useEffect handle it
      }
      
      setNotesPage(page);
      setNotesTotalPages(Math.ceil(totalCount / notesPageSize));
      setHasMoreNotes(hasNext);
      
    } catch (err) {
      console.error('Notes fetch error:', err);
      showError('Failed to load notes. Please try again.');
    } finally {
      setNotesLoading(false);
      setLoadingMoreNotes(false);
    }
  };

  // Load more notes function
  const loadMoreNotes = () => {
    if (hasMoreNotes && !loadingMoreNotes) {
      fetchNotes(notesPage + 1, true);
    }
  };

  // Scroll event handler for infinite scroll
  const handleNotesScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreNotes && !loadingMoreNotes) {
      loadMoreNotes();
    }
  };



  const handleCreateNote = async () => {
    if (!newNote.trim()) {
      showWarning('Please enter a note before saving.');
      return;
    }

    try {
      setSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const payload = {
        notes: newNote.trim(),
        lead: parseInt(leadId)
      };

      const response = await fetch(`${baseUrl}/leads/notes/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedNote = await response.json();
      // Reset pagination and reload notes to show the new note at the top
      setNotesPage(1);
      fetchNotes(1, false);
      setNewNote('');
      showSuccess('Note saved successfully!');
    } catch (err) {
      console.error('Create note error:', err);
      showError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (noteId, updatedContent) => {
    if (!updatedContent.trim()) {
      showWarning('Note cannot be empty.');
      return;
    }

    try {
      setEditingNote(noteId);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const payload = {
        notes: updatedContent.trim(),
        lead: parseInt(leadId)
      };

      const response = await fetch(`${baseUrl}/leads/notes/${noteId}/`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedNote = await response.json();
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      setSelectedNote(null);
      showSuccess('Note updated successfully!');
    } catch (err) {
      console.error('Update note error:', err);
      showError('Failed to update note. Please try again.');
    } finally {
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setDeletingNote(noteId);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const response = await fetch(`${baseUrl}/leads/notes/${noteId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        logout();
        window.location.replace('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotes(notes.filter(note => note.id !== noteId));
      setSelectedNote(null);
      showSuccess('Note deleted successfully!');
    } catch (err) {
      console.error('Delete note error:', err);
      showError('Failed to delete note. Please try again.');
    } finally {
      setDeletingNote(null);
    }
  };



  if (loading) {
    return <PageLoader message="Loading lead details..." />;
  }

  if (!lead) {
    return <PageLoader message="Lead not found. Redirecting..." />;
  }

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
      {/* Main Layout with Sidebar */}
      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Lead Info Header */}
          <div className={styles.sidebarHeader}>
            <Button
              variant="link"
              onClick={handleBackToLeads}
              disabled={navigatingBack}
                className={`${theme.smallBackButton} ${navigatingBack ? styles.loading : ''}`}
            >
              {navigatingBack ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Leads
                </>
              )}
            </Button>
            <div className={styles.leadHeaderInfo}>
              <h3 className={styles.leadEmail}>{lead.email}</h3>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.sidebarTabs}>
            <button
              className={`${styles.sidebarTab} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <i className="fas fa-sticky-note me-2"></i>
              Notes
              {notes.length > 0 && (
                <span className={styles.tabBadge}>
                  {searchQuery ? `${filteredNotes.length}/${notes.length}` : notes.length}
                </span>
              )}
            </button>
            <button
              className={`${styles.sidebarTab} ${activeTab === 'consent' ? styles.active : ''}`}
              onClick={() => setActiveTab('consent')}
            >
              <i className="fas fa-file-signature me-2"></i>
              Consent Forms
              {consentForms.length > 0 && <span className={styles.tabBadge}>{consentForms.length}</span>}
            </button>
          </div>

          {/* Notes List (ChatGPT-like) */}
          {activeTab === 'notes' && (
            <>
              {/* Search Input */}
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
                
                {/* Date Filter Controls */}
                <div className={styles.filterControls}>
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className={`${styles.dateFilterToggle} ${dateFilter ? styles.active : ''} ${dateFilter ? styles.withClear : ''}`}
                  >
                    <div className={styles.dateFilterContent}>
                      <i className="fas fa-calendar-alt me-1"></i>
                      <span className={styles.dateFilterText}>
                        {dateFilter ? getDateFilterLabel(dateFilter) : 'Filter by date'}
                      </span>
                    </div>
                    <div className={styles.dateFilterActions}>
                      {dateFilter && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateFilterChange('');
                            setShowDateFilter(false);
                          }}
                          className={styles.clearDateFilter}
                          title="Clear date filter"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDateFilterChange('');
                              setShowDateFilter(false);
                            }
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </span>
                      )}
                      <i className={`fas fa-chevron-${showDateFilter ? 'up' : 'down'} ${styles.chevronIcon}`}></i>
                    </div>
                  </button>
                </div>

                {/* Date Filter Options */}
                {showDateFilter && (
                  <div className={styles.dateFilterOptions}>
                    <button
                      onClick={() => handleDateFilterChange('')}
                      className={`${styles.dateOption} ${!dateFilter ? styles.selected : ''}`}
                    >
                      All dates
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('today')}
                      className={`${styles.dateOption} ${dateFilter === 'today' ? styles.selected : ''}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('yesterday')}
                      className={`${styles.dateOption} ${dateFilter === 'yesterday' ? styles.selected : ''}`}
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('this_week')}
                      className={`${styles.dateOption} ${dateFilter === 'this_week' ? styles.selected : ''}`}
                    >
                      This week
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('last_week')}
                      className={`${styles.dateOption} ${dateFilter === 'last_week' ? styles.selected : ''}`}
                    >
                      Last week
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('this_month')}
                      className={`${styles.dateOption} ${dateFilter === 'this_month' ? styles.selected : ''}`}
                    >
                      This month
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('last_month')}
                      className={`${styles.dateOption} ${dateFilter === 'last_month' ? styles.selected : ''}`}
                    >
                      Last month
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('this_year')}
                      className={`${styles.dateOption} ${dateFilter === 'this_year' ? styles.selected : ''}`}
                    >
                      This year
                    </button>
                  </div>
                )}

                {/* Search Results */}
                {(searchQuery || dateFilter) && (
                  <div className={styles.searchResults}>
                    <span className={styles.resultCount}>
                      {filteredNotes.length} of {notes.length} notes
                    </span>
                    {filteredNotes.length > 0 && (
                      <span className={styles.resultInfo}>
                        {searchQuery && dateFilter ? '• text & date filtered' : 
                         searchQuery ? '• text filtered' : 
                         dateFilter ? '• date filtered' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div 
                className={styles.notesList} 
                onScroll={handleNotesScroll}
              >
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
                          className={`${styles.noteItem} ${selectedNote?.id === note.id ? styles.active : ''}`}
                          onClick={() => setSelectedNote(note)}
                        >
                          <div className={styles.notePreview}>
                            {previewText}
                          </div>
                          <div className={styles.noteDate}>
                            <span className={styles.dateText}>{dateTime.date}</span>
                            <span className={styles.timeText}>{dateTime.time}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Load More Notes Button/Indicator - Only show when no filters are active */}
                    {hasMoreNotes && !searchQuery && !dateFilter && (
                      <div className={styles.loadMoreNotes}>
                        {loadingMoreNotes ? (
                          <div className={styles.loadingMore}>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Loading more notes...</span>
                          </div>
                        ) : (
                          <button 
                            onClick={loadMoreNotes}
                            className={styles.loadMoreButton}
                          >
                            <i className="fas fa-chevron-down"></i>
                            Load more notes
                          </button>
                        )}
                      </div>
                    )}
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
            </>
          )}

          {/* Consent Forms List */}
          {activeTab === 'consent' && (
            <div className={styles.consentList}>
                {consentFormsLoading ? (
                  <div className={styles.loadingState}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading consent forms...</p>
                  </div>
                ) : consentForms.length > 0 ? (
                  consentForms.map((consentForm) => (
                    <div
                      key={consentForm.id}
                      className={`${styles.consentFormItem} ${selectedConsentForm?.id === consentForm.id ? styles.selected : ''}`}
                      onClick={() => handleTemplateEdit(consentForm)}
                    >
                      <div className={styles.consentFormInfo}>
                        <div className={styles.consentFormTitle}>
                          <i className="fas fa-file-signature"></i>
                          {consentForm.template_name}
                        </div>
                        <div className={styles.consentFormStatus}>
                          <span className={`${styles.statusBadge} ${consentForm.is_signed ? styles.signed : styles.unsigned}`}>
                            {consentForm.is_signed ? 'Signed' : 'Unsigned'}
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
                          title="Edit Template"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
              <div className={styles.emptyConsent}>
                <i className="fas fa-file-signature"></i>
                    <p>No Consent Forms</p>
                    <small>No consent forms found for this lead</small>
              </div>
                )}
            </div>
          )}
        </div>

          {/* Content Area */}
        <div className={styles.contentArea}>
            {/* Lead Detail Header - Using LeadsHeader component structure */}
            <div className={theme.modernHeader}>
              <div className={styles.headerContent}>
                <div className={theme.headerLeft}>
                  <h1 className={theme.pageTitle}>Lead Details</h1>
                  <small className={styles.leadSubtitle}>{lead.email}</small>
                </div>
                <div className={theme.headerRight}>
                  {/* Removed duplicate Back to Leads button - keeping only the one in sidebar */}
                </div>
              </div>
            </div>

          {activeTab === 'notes' && (
            <div className={styles.notesInterface}>
              {selectedNote ? (
                // Edit existing note
                <div className={styles.editNoteInterface}>
                  <div className={styles.interfaceHeader}>
                    <div className={styles.noteInfo}>
                      <h4 className={styles.noteTitle}>
                        <i className="fas fa-edit me-2"></i>
                        Edit Note
                      </h4>
                      <small className={styles.noteTimestamp}>
                        Created: {formatDateTime(selectedNote.created_at || selectedNote.date_created).full}
                      </small>
                    </div>
                    <div className={styles.noteActions}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteNote(selectedNote.id)}
                        disabled={deletingNote === selectedNote.id}
                          className={theme.dangerButton}
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
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setSelectedNote(null)}
                          className={theme.secondaryButton}
                      >
                        <i className="fas fa-times me-1"></i> Cancel
                      </Button>
                    </div>
                  </div>
                  
                  <div className={styles.editArea}>
                    <textarea
                      className={styles.noteTextarea}
                      value={selectedNote.notes}
                      onChange={(e) => setSelectedNote({...selectedNote, notes: e.target.value})}
                      placeholder="Write your note here..."
                      rows={15}
                    />
                    <div className={styles.editActions}>
                      <Button
                        variant="primary"
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
                    </div>
                  </div>
                </div>
              ) : (
                // Create new note
                <div className={styles.newNoteInterface}>
                  <div className={styles.interfaceHeader}>
                    <h4 className={styles.noteTitle}>
                      <i className="fas fa-plus me-2"></i>
                      New Note
                    </h4>
                  </div>
                  
                  <div className={styles.writeArea}>
                    <textarea
                      className={styles.noteTextarea}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Start writing a new note for this lead..."
                      rows={15}
                    />
                    <div className={styles.writeActions}>
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'consent' && (
            <div className={styles.consentInterface}>
                {editingTemplate ? (
                  // Edit template interface
                  <div className={styles.editTemplateInterface}>
                    <div className={styles.interfaceHeader}>
                      <div className={styles.templateInfo}>
                        <h4 className={styles.templateTitle}>
                          <i className="fas fa-edit me-2"></i>
                          Edit Template Content: {editingTemplate.name}
                        </h4>
                      </div>
                      <div className={styles.templateActions}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleTemplateCancel}
                          className={theme.secondaryButton}
                        >
                          <i className="fas fa-times me-1"></i> Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleTemplateSave}
                          disabled={savingTemplate}
                          className={theme.successButton}
                        >
                          {savingTemplate ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-1"></i> Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i> Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className={styles.templateEditArea}>
                      <div className={styles.editorHeader}>
                        <h5 className={styles.editorTitle}>
                          <i className="fas fa-edit me-2"></i> Content Editor
                        </h5>
                        <h5 className={styles.previewTitle}>
                          <i className="fas fa-eye me-2"></i> Live Preview
                        </h5>
                      </div>

                      <div className={styles.editorContainer}>
                        <div className={styles.editorSection}>
                          <BundledEditor
                            value={editingTemplate.body}
                            onEditorChange={(content) => setEditingTemplate({...editingTemplate, body: content})}
                            key={`consent-editor-${editingTemplate.id}`}
                            onChange={() => {}}
                            init={{
                              height: 600,
                              menubar: false,
                              plugins: ["lists", "autolink", "link", "pagebreak", "image"],
                              toolbar:
                                "styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                              contextmenu: false,
                              resize: true,
                            }}
                          />
                        </div>
                        
                        <div className={styles.previewSection}>
                          <div className={styles.previewContainer}>
                            <div 
                              className={styles.htmlPreview}
                              dangerouslySetInnerHTML={{ __html: editingTemplate.body }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedConsentForm ? (
                  // View consent form interface
                  <div className={styles.viewConsentInterface}>
                    <div className={styles.interfaceHeader}>
                      <div className={styles.consentInfo}>
                        <h4 className={styles.consentTitle}>
                          <i className="fas fa-file-signature me-2"></i>
                          {selectedConsentForm.template_name}
                        </h4>
                        <div className={styles.consentMeta}>
                          <span className={`${styles.statusBadge} ${selectedConsentForm.is_signed ? styles.signed : styles.unsigned}`}>
                            {selectedConsentForm.is_signed ? 'Signed' : 'Unsigned'}
                          </span>
                          <small className={styles.consentSubtitle}>
                            Lead: {selectedConsentForm.lead_email}
                          </small>
                        </div>
                      </div>
                      <div className={styles.consentActions}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleTemplateEdit(selectedConsentForm)}
                          className={theme.primaryButton}
                        >
                          <i className="fas fa-edit me-2"></i> Edit Template
                        </Button>
                      </div>
                    </div>
                    
                    <div className={styles.consentPreview}>
                      <div className={styles.previewHeader}>
                        <h5>Template Preview</h5>
                      </div>
                      <div 
                        className={styles.templatePreview}
                        dangerouslySetInnerHTML={{ __html: selectedConsentForm.template_body }}
                      />
                    </div>
                  </div>
                ) : (
                  // Default consent forms interface
                  <div className={styles.defaultConsentInterface}>
                    <div className={styles.interfaceHeader}>
                      <h4 className={styles.consentTitle}>
                        <i className="fas fa-file-signature me-2"></i>
                        Consent Forms
                      </h4>
                      <p className={styles.consentSubtitle}>
                        Select a consent form from the sidebar to view or edit its template
                      </p>
                    </div>
                    
                    <div className={styles.consentPlaceholder}>
                <i className="fas fa-file-signature"></i>
                      <h5>No Consent Form Selected</h5>
                      <p>Choose a consent form from the left sidebar to get started</p>
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

// export const dynamic = "force-dynamic";
export const revalidate = 0;