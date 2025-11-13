// Utility functions for handling applications data
//const API_BASE_URL = 'http://localhost:3001/api';
// const API_BASE_URL = 'http://localhost:3002/api';
const API_BASE_URL = 'https://maxunibot.ru/api'
// const API_BASE_URL = 'https://max-server-woad.vercel.app/api';

// Store JWT token
let authToken = localStorage.getItem('authToken') || null;

// Set authentication token
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Clear authentication token
export const clearAuthToken = () => {
  setAuthToken(null);
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

// Student authentication
export const authenticateStudent = async (email, password) => {
    try {
        const response = await apiRequest('/auth/student/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
            setAuthToken(response.token);
            // Store student ID in localStorage for use in components
            if (response.student && response.student.id) {
                localStorage.setItem('studentId', response.student.id.toString());
            }
            return response;
        }
        
        throw new Error(response.error || 'Authentication failed');
    } catch (error) {
        console.error('Error authenticating student:', error);
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

// Get student applications (uses authenticated student ID)
export const getStudentApplications = async () => {
  try {
    // Get student ID from localStorage (set during login)
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      const response = await apiRequest(`/students/${studentId}/applications`);
      return response.applications || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching student applications:', error);
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

// Get a single application by ID
export const getApplicationById = async (id) => {
  try {
    const response = await apiRequest(`/applications/${id}`);
    return response.application || null;
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    return null;
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

// Create a new student
export const createStudent = async (studentData) => {
  try {
    const response = await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
    
    if (response.success) {
      return response.student;
    }
    
    throw new Error(response.error || 'Failed to create student');
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (id) => {
  try {
    const response = await apiRequest(`/students/${id}`);
    return response.student || null;
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
};

// Get applications by student ID
export const getApplicationsByStudentId = async (id) => {
  try {
    const response = await apiRequest(`/students/${id}/applications`);
    return response.applications || [];
  } catch (error) {
    console.error('Error fetching applications by student ID:', error);
    return [];
  }
};

// Get financial aid payments
export const getFinancialAidPayments = async () => {
  try {
    const response = await apiRequest('/applications/financial-aid/payments');
    return response;
  } catch (error) {
    console.error('Error fetching financial aid payments:', error);
    return { payments: [], total: 0 };
  }
};

// Delete application
export const deleteApplication = async (id) => {
  try {
    const response = await apiRequest(`/applications/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      return response;
    }
    
    throw new Error(response.error || 'Failed to delete application');
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};