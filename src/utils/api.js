// Utility functions for handling applications data
const APPLICATIONS_KEY = 'student_applications';
const DEAN_USER_KEY = 'dean_user';

// Initialize with some default data if empty
const initializeData = () => {
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(DEAN_USER_KEY)) {
    localStorage.setItem(DEAN_USER_KEY, JSON.stringify({
      username: 'dean',
      password: 'dean123' // In a real app, this would be hashed
    }));
  }
};

// Get all applications
export const getApplications = () => {
  initializeData();
  try {
    const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');
    return applications;
  } catch (error) {
    console.error('Error reading applications from localStorage:', error);
    return [];
  }
};

// Add a new application
export const addApplication = (application) => {
  initializeData();
  try {
    const applications = getApplications();
    const newApplication = {
      id: Date.now(), // Simple ID generation
      ...application,
      timestamp: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    };
    applications.push(newApplication);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return newApplication;
  } catch (error) {
    console.error('Error saving application to localStorage:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = (id, status) => {
  initializeData();
  try {
    const applications = getApplications();
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status } : app
    );
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updatedApplications));
    return updatedApplications.find(app => app.id === id);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Get applications by type
export const getApplicationsByType = (type) => {
  const applications = getApplications();
  return applications.filter(app => app.type === type);
};

// Get applications statistics
export const getApplicationsStats = () => {
  const applications = getApplications();
  
  const total = applications.length;
  const pending = applications.filter(app => app.status === 'pending').length;
  const approved = applications.filter(app => app.status === 'approved').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  
  // Count by type
  const financialAidCount = applications.filter(app => app.type === 'financial_aid').length;
  const certificateCount = applications.filter(app => app.type === 'certificate').length;
  
  // For student count, we'll use a simple approach
  // In a real app, this would come from a separate students database
  const studentCount = Math.max(1000, total * 5); // Estimate at least 1000 students
  
  return {
    total,
    pending,
    approved,
    rejected,
    financialAid: financialAidCount,
    certificates: certificateCount,
    studentCount
  };
};

// Dean authentication
export const authenticateDean = (username, password) => {
  try {
    const deanUser = JSON.parse(localStorage.getItem(DEAN_USER_KEY) || '{}');
    return deanUser.username === username && deanUser.password === password;
  } catch (error) {
    console.error('Error authenticating dean:', error);
    return false;
  }
};

// Initialize data on module load
initializeData();