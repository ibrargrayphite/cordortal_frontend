import { useState, useCallback } from 'react';
import { templatesAPI } from '../utils/api';
import { useToast } from '../components/Toast';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  const { showError, showSuccess } = useToast();

  // Fetch templates
  const fetchTemplates = useCallback(async (search = '') => {
    try {
      setLoading(true);
      const data = await templatesAPI.getTemplates(search);
      setTemplates(Array.isArray(data?.results) ? data?.results : []);
    } catch (error) {
      console.error('Templates fetch error:', error);
      showError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Search templates
  const searchTemplates = useCallback(async (query) => {
    try {
      setSearchLoading(true);
      setSearchQuery(query);
      const data = await templatesAPI.getTemplates(query);
      setTemplates(Array.isArray(data?.results) ? data?.results : []);
    } catch (error) {
      console.error('Templates search error:', error);
      showError('Failed to search templates. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, [showError]);

  // Create template
  const createTemplate = useCallback(async (templateData) => {
    try {
      setSaving(true);
      const newTemplate = await templatesAPI.createTemplate(templateData);
      showSuccess('Template created successfully!');
      return newTemplate;
    } catch (error) {
      console.error('Template create error:', error);
      showError('Failed to create template. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [showSuccess, showError]);

  // Update template
  const updateTemplate = useCallback(async (id, templateData) => {
    try {
      setSaving(true);
      const updatedTemplate = await templatesAPI.updateTemplate(id, templateData);
      setTemplates(templates.map(template => 
        template.id === id ? updatedTemplate : template
      ));
      showSuccess('Template updated successfully!');
      return updatedTemplate;
    } catch (error) {
      console.error('Template update error:', error);
      showError('Failed to update template. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [templates, showSuccess, showError]);

  // Delete template
  const deleteTemplate = useCallback(async (id) => {
    try {
      setSaving(true);
      await templatesAPI.deleteTemplate(id);
      setTemplates(templates.filter(template => template.id !== id));
      showSuccess('Template deleted successfully!');
    } catch (error) {
      console.error('Template delete error:', error);
      showError('Failed to delete template. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [templates, showSuccess, showError]);

  // Get template by ID
  const getTemplate = useCallback(async (id) => {
    try {
      const template = await templatesAPI.getTemplate(id);
      return template;
    } catch (error) {
      console.error('Template fetch error:', error);
      showError('Failed to load template. Please try again.');
      throw error;
    }
  }, [showError]);

  return {
    // State
    templates,
    loading,
    saving,
    searchQuery,
    searchLoading,
    
    // Actions
    fetchTemplates,
    searchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
  };
}; 