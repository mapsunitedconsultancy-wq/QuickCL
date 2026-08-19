import axios from 'axios';

// In development, Vite proxy sends /api/* to localhost:5000
// In production, VITE_API_URL = "https://your-railway-backend.up.railway.app"
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL: API_URL });

// ─── INTERCEPTOR: Auto-attach JWT token to every request ───
// This runs BEFORE every request. If user is logged in, their token
// is in localStorage. We put it in the Authorization header so
// Express knows WHO is making the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('quickcl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── INTERCEPTOR: Auto-handle 401 (expired token) ───
// If backend says "unauthorized", clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('quickcl_token');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════
export const registerUser = (data) =>
  api.post('/api/auth/register', data);

export const loginUser = (data) =>
  api.post('/api/auth/login', data);

export const checkEmailExists = (email) =>
  api.post('/api/auth/check-email', { email });

export const getMe = () =>
  api.get('/api/auth/me');

export const updateProfile = (data) =>
  api.patch('/api/auth/profile', data);

export const upgradeUserPlan = (plan) =>
  api.patch('/api/auth/upgrade', { plan });

// ═══════════════════════════════════════════
// EXTRACTION (the main feature)
// ═══════════════════════════════════════════
export const extractDocuments = (formData) =>
  api.post('/api/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min timeout (AI can be slow)
  });


// ═══════════════════════════════════════════
// IMAGE EXTRACTION
// ═══════════════════════════════════════════
export const extractImage = (formData) => {
  return api.post('/api/image-extract', formData, {
    headers: {'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min timeout (AI can be slow),
  });
};

export const extractScannedDocuments = (formData) => {
  return api.post('/api/scanned-extract', formData, {
    headers: {'Content-Type': 'multipart/form-data' },
    timeout: 180000, // 3 min timeout (scanned PDFs can be larger),
  });
};

export const getExtraction = (id) =>
  api.get(`/api/extractions/${id}`);

export const getImageExtraction = (id) =>
    api.get(`/api/image-extract/${id}`);

export const editField = (id, field, newValue) =>
  api.patch(`/api/extractions/${id}`, { field, newValue });

export const confirmHSCode = (extractionId, itemId, hsCode) =>
  api.post(`/api/extractions/${extractionId}/confirm-hs`, { itemId, hsCode });

// ═══════════════════════════════════════════
// DOWNLOADS
// ═══════════════════════════════════════════
export const downloadExcel = async (id, jobNumber) => {
  const res = await api.get(`/api/extractions/${id}/excel`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${jobNumber || 'extraction'}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const downloadCSV = async (id, jobNumber) => {
  const res = await api.get(`/api/extractions/${id}/csv`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${jobNumber || 'extraction'}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// ═══════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════
export const getHistory = (page = 1, type = '', search = '') =>
  api.get(`/api/extractions?page=${page}&limit=20&type=${type}&search=${search}`);

// ═══════════════════════════════════════════
// HS CODE SEARCH
// ═══════════════════════════════════════════
export const searchHSCodes = (query) =>
  api.get(`/api/hs/search?q=${encodeURIComponent(query)}`);

// ═══════════════════════════════════════════
// CLIENT MASTER
// ═══════════════════════════════════════════
export const getClients = () =>
  api.get('/api/clients');

export const createClient = (data) =>
  api.post('/api/clients', data);

export const updateClient = (id, data) =>
  api.patch(`/api/clients/${id}`, data);

export const deleteClient = (id) =>
  api.delete(`/api/clients/${id}`);

// ═══════════════════════════════════════════
// EXCHANGE RATE
// ═══════════════════════════════════════════
export const getExchangeRate = (currency = 'USD') =>
  api.get(`/api/exchange-rate?c=${currency}`);

export default api;