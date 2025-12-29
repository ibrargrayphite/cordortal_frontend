import axios from 'axios';
import { getAuthHeaders, logout } from './auth';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 50000, // 50 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.replace('/login');
      return Promise.reject(new Error('Authentication failed'));
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle specific HTTP status codes
    const status = error.response.status;
    let message = 'An unexpected error occurred';

    // Try to extract specific error message from backend response
    if (error.response.data) {
      if (error.response.data.detail) {
        // Handle array of error messages
        if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail.join(', ');
        } else {
          message = error.response.data.detail;
        }
      } else if (error.response.data.message && !Array.isArray(error.response.data.message)) {
        message = error.response.data.message;
      } else if (error.response.data.error) {
        message = error.response.data.error;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data;
      }
    }

    // Fallback to generic messages only if no specific message was found
    if (message === 'An unexpected error occurred') {
      switch (status) {
        case 400:
          message = 'Bad request. Please check your input.';
          break;
        case 403:
          message = 'Access denied. You don\'t have permission for this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = `HTTP error! status: ${status}`;
      }
    }
    // For 400 errors with validation data, preserve the original error structure
    if (status === 400 && error.response.data && typeof error.response.data === 'object' && !error.response.data.detail && !error.response.data.error && typeof error.response.data !== 'string') {
      const validationError = error;
      return Promise.reject(validationError);
    }

    return Promise.reject(new Error(message));
  }
);

// API methods for different endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    console.log("API: Login response:", response)
    return response.data;
  },
};

export const leadsAPI = {
  getLeads: async (page = 1, pageSize = 10, search = '', includeCounts = true) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append('q', search);
    }

    if (includeCounts) {
      params.append('include_counts', 'true');
    }

    const response = await api.get(`/leads/?${params.toString()}`);
    return response.data;
  },

  createLead: async (leadData) => {
    try {
      const response = await api.post('/leads/', leadData);
      return response.data;
    } catch (error) {
      // Preserve original error structure for validation errors
      if (error.response?.status === 400) {
        const validationError = error;
        validationError.response = error.response;
        throw validationError;
      }
      throw error;
    }
  },

  updateLead: async (id, leadData) => {
    try {
      const response = await api.put(`/leads/${id}/`, leadData);
      return response.data;
    } catch (error) {
      // Preserve original error structure for validation errors
      if (error.response?.status === 400) {
        const validationError = error;
        validationError.response = error.response;
        throw validationError;
      }
      throw error;
    }
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}/`);
    return response.data;
  },

  getLead: async (id) => {
    const response = await api.get(`/leads/${id}/`);
    return response.data;
  },
};

export const templatesAPI = {
  getTemplates: async (searchQuery = '') => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    const url = params.toString()
      ? `/leads/organization-templates/?${params.toString()}`
      : '/leads/organization-templates/';

    const response = await api.get(url);
    return response.data;
  },

  createTemplate: async (templateData) => {
    const response = await api.post('/leads/organization-templates/', templateData);
    return response.data;
  },

  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/leads/organization-templates/${id}/`, templateData);
    return response.data;
  },

  deleteTemplate: async (id) => {
    const response = await api.delete(`/leads/organization-templates/${id}/`);
    return response.data;
  },

  getTemplate: async (id) => {
    const response = await api.get(`/leads/organization-templates/${id}/`);
    return response.data;
  },
};

export const notesAPI = {
  getNotes: async (leadId, page = 1, pageSize = 5, searchQuery = '', dateRange = '') => {
    const params = new URLSearchParams({
      lead_id: leadId.toString(),
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    if (dateRange) {
      params.append('created_at_range', dateRange);
    }

    const response = await api.get(`/leads/notes/?${params.toString()}`);
    return response.data;
  },

  createNote: async (noteData) => {
    const response = await api.post('/leads/notes/', noteData);
    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await api.put(`/leads/notes/${id}/`, noteData);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/leads/notes/${id}/`);
    return response.data;
  },
};

export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/user/me/');
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/user/${userId}/`, userData);
    return response.data;
  },
};

export const consentFormsAPI = {
  getConsentForms: async (leadId, page = 1, pageSize = 5, searchQuery = '') => {
    const params = new URLSearchParams({
      lead_id: leadId.toString(),
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    const response = await api.get(`/leads/consent-forms/?${params.toString()}`);
    return response.data;
  },

  getConsentFormsWithoutLead: async (page = 1, pageSize = 5, searchQuery = '') => {
    const params = new URLSearchParams({
      lead: 'false',
      page: page.toString(),
      page_size: pageSize.toString(),
    });


    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    const response = await api.get(`/leads/consent-forms/?${params.toString()}`);
    return response.data;
  },

  createConsentFormWithoutLead: async (consentFormData) => {
    // Don't include lead field at all for sidebar operations
    console.log("API: Creating consent form with data:", consentFormData);
    
    try {
      const response = await api.post('/leads/consent-forms/', consentFormData);
      console.log("API: Consent form created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error creating consent form:", error);
      throw error;
    }
  },

  updateConsentFormWithoutLead: async (id, consentFormData) => {
    // Don't include lead field at all for sidebar operations
    console.log("API: Updating consent form with data:", consentFormData);
    
    try {
      const response = await api.put(`/leads/consent-forms/${id}/`, consentFormData);
      console.log("API: Consent form updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error updating consent form:", error);
      throw error;
    }
  },

  getConsentForm: async (id) => {
    const response = await api.get(`/leads/consent-forms/${id}/`);
    return response.data;
  },

  updateTemplate: async (templateId, templateData) => {
    const response = await api.put(`/leads/organization-templates/${templateId}/`, templateData);
    return response.data;
  },
};

export default api;