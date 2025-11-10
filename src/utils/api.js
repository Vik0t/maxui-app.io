// Utility functions for handling applications data
//const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = 'https://max-server-woad.vercel.app/api';

// Store JWT token
let authToken = null;

// Set authentication token
export const setAuthToken = (token) => {
  authToken = token;
};

// Get authentication token
export const getAuthToken = () => {
  return authToken;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Server error');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Dean authentication
export const authenticateDean = async (username, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (response.success) {
      setAuthToken(response.token);
      return response;
    }
    
    throw new Error(response.error || 'Authentication failed');
  } catch (error) {
    console.error('Error authenticating dean:', error);
    throw error;
  }
};

// Get all applications
export const getApplications = async () => {
  try {
    const response = await apiRequest('/applications');
    return response.applications || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

// Get applications by type
export const getApplicationsByType = async (type) => {
  try {
    const response = await apiRequest(`/applications/type/${type}`);
    return response.applications || [];
  } catch (error) {
    console.error('Error fetching applications by type:', error);
    return [];
  }
};

// Add a new application
export const addApplication = async (application) => {
  try {
    const response = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(application)
    });
    
    if (response.success) {
      return response.application;
    }
    
    throw new Error(response.error || 'Failed to save application');
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    
    if (response.success) {
      return response.application;
    }
    
    throw new Error(response.error || 'Failed to update application status');
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Get applications statistics
export const getApplicationsStats = async () => {
  try {
    const response = await apiRequest('/applications/stats');
    return response.stats || {};
  } catch (error) {
    console.error('Error fetching applications stats:', error);
    return {};
  }
};