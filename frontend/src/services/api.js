import axios from 'axios';

/**
 * Axios instance with base configuration
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - attach auth token
 */
api.interceptors.request.use(
    async (config) => {
        // Get token from Firebase auth (will be set by AuthContext)
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - handle errors
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Methods
// API Methods
export const userAPI = {
    createUser: (data) => api.post('/users', data),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getPublicUsers: () => api.get('/users/public'),
};

export const expertAPI = {
    getAll: () => api.get('/experts'),
    getById: (id) => api.get(`/experts/${id}`),
    create: (data) => api.post('/experts', data),
    update: (id, data) => api.put(`/experts/${id}`, data),
};

export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getUserBookings: () => api.get('/bookings'),
    getExpertBookings: () => api.get('/bookings/expert'),
    updateStatus: (id, data) => api.put(`/bookings/${id}`, data),
};

export const messageAPI = {
    getChatHistory: (otherUserId) => api.get(`/messages/${otherUserId}`),
    sendMessage: (data) => api.post('/messages', data),
    markAsRead: (otherUserId) => api.put(`/messages/read/${otherUserId}`),
    getUnreadCount: () => api.get('/messages/unread/count'),
};

export const projectAPI = {
    getAll: () => api.get('/projects'),
    create: (data) => api.post('/projects', data),
    join: (id) => api.put(`/projects/${id}/join`),
};

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllUsers: (params) => api.get('/admin/users', { params }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
    getAllBookings: () => api.get('/admin/bookings'),
};

export default api;
