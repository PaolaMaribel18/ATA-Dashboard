// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Headers comunes
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// URLs de endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Users
  USERS_CREATE: `${API_BASE_URL}/users/create`,
  USERS_ALL: `${API_BASE_URL}/users/all`,
  USERS_STATUS: (userId, status) => `${API_BASE_URL}/admin/users/${userId}/status?status=${status}`,
  
  // Sensors
  SENSORS_MINE: `${API_BASE_URL}/sensors/mine`,
  SENSORS_ALL: `${API_BASE_URL}/sensors/all`,
  SENSORS_STATUS: (sensorId, status) => `${API_BASE_URL}/sensors/admin/${sensorId}/status?status=${status}`,
  
  // Tickets
  TICKETS_CREATE: `${API_BASE_URL}/tickets/create`,
  TICKETS_MINE: `${API_BASE_URL}/tickets/mine`,
  TICKETS_ASSIGNED: `${API_BASE_URL}/tickets/assigned`,
  TICKETS_SUMMARY: `${API_BASE_URL}/tickets/summary`,
  TICKETS_STATUS: (ticketId) => `${API_BASE_URL}/tickets/${ticketId}/status`,
  
  // Technicians
  TECHNICIANS_CREATE: `${API_BASE_URL}/technicians/create`,
  TECHNICIANS_ALL: `${API_BASE_URL}/technicians/all`,
  TECHNICIANS_STATUS: (techId, status) => `${API_BASE_URL}/admin/technicians/${techId}/status?status=${status}`,
  
  // Reports
  REPORTS_CREATE: `${API_BASE_URL}/reports/create`,
  REPORTS_MINE: `${API_BASE_URL}/reports/mine`,
  REPORTS_DOWNLOAD: (reportId) => `${API_BASE_URL}/reports/download/${reportId}`,
  
  // Alerts
  ALERTS_ALL: `${API_BASE_URL}/alerts/all`,
  ALERTS_RESOLVE: (alertId) => `${API_BASE_URL}/alerts/${alertId}/resolve`
};