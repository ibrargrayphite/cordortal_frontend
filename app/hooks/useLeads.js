import { useState, useCallback, useRef } from 'react';
import { leadsAPI } from '../utils/api';
import { useToast } from '../components/Toast';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextUrl, setNextUrl] = useState(null);
  const [previousUrl, setPreviousUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  
  const { showError, showSuccess } = useToast();

  // Fetch leads with pagination and search
  const fetchLeads = useCallback(async (
    page = 1,
    isPageChange = false,
    search = '',
    customPageSize = null
  ) => {
    try {
      if (isPageChange) {
        setPageLoading(true);
        setFadeOut(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
      } else {
        setLoading(true);
      }

      const pageSizeToUse = customPageSize || pageSize;
      const data = await leadsAPI.getLeads(page, pageSizeToUse, search, true);
      
      // Handle paginated response structure
      const leadsArray = data.results ? data.results : Array.isArray(data) ? data : [];
      const totalCount = data.count || leadsArray.length;
      const calculatedTotalPages = Math.ceil(totalCount / pageSizeToUse);

      setLeads(leadsArray);
      setLeadsCount(totalCount);
      setCurrentPage(page);
      setTotalPages(calculatedTotalPages);
      setNextUrl(data.next);
      setPreviousUrl(data.previous);

      if (isPageChange) {
        setFadeOut(false);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Leads fetch error:', error);
      showError('Failed to load leads. Please try again.');
    } finally {
      if (isPageChange) {
        setPageLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [pageSize, showError]);

  // Debounced search functionality
  const handleSearch = useCallback(async (query) => {
    const trimmedQuery = query.trim();
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchQuery(trimmedQuery);
      setIsSearching(true);
      setCurrentPage(1);
      
      try {
        await fetchLeads(1, true, trimmedQuery);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay
  }, [fetchLeads]);


  // Clear search
  const clearSearch = useCallback(async () => {
    // Clear timeout if exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setSearchQuery('');
    setCurrentPage(1);
    setIsSearching(true);
    
    try {
      await fetchLeads(1, true, '');
    } finally {
      setIsSearching(false);
    }
  }, [fetchLeads]);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !pageLoading) {
      fetchLeads(page, true, searchQuery);
    }
  }, [totalPages, currentPage, pageLoading, searchQuery, fetchLeads]);

  // Previous page
  const handlePreviousPage = useCallback(() => {
    if (previousUrl && currentPage > 1 && !pageLoading) {
      handlePageChange(currentPage - 1);
    }
  }, [previousUrl, currentPage, pageLoading, handlePageChange]);

  // Next page
  const handleNextPage = useCallback(() => {
    if (nextUrl && currentPage < totalPages && !pageLoading) {
      handlePageChange(currentPage + 1);
    }
  }, [nextUrl, currentPage, totalPages, pageLoading, handlePageChange]);

  // Page size change
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    const newTotalPages = Math.ceil(leadsCount / newPageSize);
    setTotalPages(newTotalPages);
    fetchLeads(1, false, searchQuery, newPageSize);
  }, [leadsCount, searchQuery, fetchLeads]);

  // Create lead
  const createLead = useCallback(async (leadData) => {
    try {
      const savedLead = await leadsAPI.createLead(leadData);
      showSuccess('Lead created successfully!');
      fetchLeads(currentPage, true, searchQuery);
      return savedLead;
    } catch (error) {
      console.error('Create lead error:', error);
      showError('Failed to create lead. Please try again.');
      throw error;
    }
  }, [currentPage, searchQuery, fetchLeads, showSuccess, showError]);

  // Update lead
  const updateLead = useCallback(async (leadId, leadData) => {
    try {
      const updatedLead = await leadsAPI.updateLead(leadId, leadData);
      const updatedLeads = leads.map((lead) =>
        lead.id === leadId ? updatedLead : lead
      );
      setLeads(updatedLeads);
      showSuccess('Lead updated successfully!');
      return updatedLead;
    } catch (error) {
      console.error('Update lead error:', error);
      showError('Failed to update lead. Please try again.');
      throw error;
    }
  }, [leads, showSuccess, showError]);

  // Delete lead
  const deleteLead = useCallback(async (leadId) => {
    try {
      await leadsAPI.deleteLead(leadId);
      showSuccess('Lead deleted successfully!');
      
      // If this was the last item on the page and we're not on page 1, go to previous page
      const isLastItemOnPage = leads.length === 1 && currentPage > 1;
      const pageToFetch = isLastItemOnPage ? currentPage - 1 : currentPage;
      fetchLeads(pageToFetch, true, searchQuery);
    } catch (error) {
      console.error('Delete lead error:', error);
      showError('Failed to delete lead. Please try again.');
      throw error;
    }
  }, [leads.length, currentPage, searchQuery, fetchLeads, showSuccess, showError]);

  return {
    // State
    leads,
    leadsCount,
    currentPage,
    totalPages,
    pageSize,
    nextUrl,
    previousUrl,
    loading,
    pageLoading,
    fadeOut,
    searchQuery,
    isSearching,
    
    // Actions
    fetchLeads,
    handleSearch,
    clearSearch,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    handlePageSizeChange,
    createLead,
    updateLead,
    deleteLead,
  };
}; 