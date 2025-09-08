import axios from 'axios';
import { getAuthHeaders, logout } from './auth';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000, // 10 second timeout
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

    return Promise.reject(new Error(message));
  }
);

// API methods for different endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
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
    const response = await api.post('/leads/', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}/`, leadData);
    return response.data;
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
  getTemplates: async () => {
    const response = await api.get('/leads/organization-templates/');
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