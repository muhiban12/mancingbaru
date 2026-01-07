import api from './api';
import { createFormData } from '../utils/fileupload';
import { 
  LoginData, RegisterData, SpotData, 
  BookingData, ReviewData, StrikeFeedData 
} from '../types/api';

/* ================= AUTH & USER ================= */
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  upgradeToOwner: (data: any) => api.post('/user/upgrade-to-owner', data),
};

/* ================= MAP & PUBLIC SPOTS ================= */
export const spotAPI = {
  getMapSpots: () => api.get('/map-spots'),
  getDetail: (id: number | string) => api.get(`/spots/${id}`),
  getNearby: (params: { lat: number; lon: number }) => api.get('/spots/nearby', { params }),
  getReviews: (spotId: number) => api.get(`/spots/${spotId}/reviews`),
  getGallery: (spotId: number) => api.get(`/spots/${spotId}/gallery`),
  getEvents: (spotId: number) => api.get(`/spots/${spotId}/events`),
  getSeats: (spotId: number) => api.get(`/spots/${spotId}/seats`),
  search: (query: string) => api.get('/spots/search', { params: { q: query } }),
  getBatchPreviews: (ids: string) => api.get('/spots/previews/batch', { params: { ids } }),
  
  // Owner Operations (Pond)
  createPond: (data: SpotData, foto: any) => {
    const formData = createFormData(data, { foto });
    return api.post('/ponds', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updatePond: (id: number, data: any, foto?: any) => {
    const formData = createFormData(data, { foto });
    return api.put(`/ponds/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  requestDelete: (id: number) => api.patch(`/ponds/${id}/request-delete`),
  getStats: (id: number) => api.get(`/owner/spots/${id}/stats`),
};

/* ================= BOOKINGS ================= */
export const bookingAPI = {
  create: (data: BookingData) => api.post('/bookings', data),
  getMyBookings: () => api.get('/my-bookings'),
};

/* ================= EVENTS ================= */
export const eventAPI = {
  create: (data: any, poster: any) => {
    const formData = createFormData(data, { poster });
    return api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getAllApproved: () => api.get('/events'),
  getDetail: (id: number) => api.get(`/events/${id}`),
  register: (eventId: number) => api.post('/events/register', { event_id: eventId }),
  getMyTickets: () => api.get('/my-tickets'),
  getOwnerEvents: () => api.get('/owner/events'),
  confirmPayment: (data: any) => api.post('/events/payment/confirm', data),
  cancelRegistration: (id: number) => api.delete(`/events/${id}/register`),
};

/* ================= SOCIAL & FEEDS ================= */
export const socialAPI = {
  getFeeds: () => api.get('/feeds'),
  createFeed: (data: StrikeFeedData, foto: any) => {
    const formData = createFormData(data, { foto });
    return api.post('/feeds', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  reportFeed: (id: number, reason: string) => api.post(`/feeds/${id}/report`, { reason }),
  getLeaderboard: () => api.get('/leaderboard'),
  postReview: (data: ReviewData, foto?: any) => {
    const formData = createFormData(data, { foto });
    return api.post('/reviews', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

/* ================= FINANCE & WALLET ================= */
export const financeAPI = {
  getWallet: () => api.get('/wallet'),
  getTransactions: () => api.get('/wallet/transactions'),
  withdraw: (data: { amount: number; bank: string; account: string }) => api.post('/wallet/withdraw', data),
};

/* ================= MASTER DATA & NOTIF ================= */
export const masterAPI = {
  getFish: () => api.get('/master/fish'),
  getFacilities: () => api.get('/master/facilities'),
};

export const notifAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
};

/* ================= OWNER SPECIFIC ================= */
export const ownerAPI = {
  getSpots: () => api.get('/owner/spots'),
  getDashboard: () => api.get('/owner/dashboard'),
  setActiveSpot: (spotId: number) => api.post('/owner/set-active-spot', { spot_id: spotId }),
  getStatus: () => api.get('/owner/status'),
};

/* ================= ADMIN ONLY ================= */
export const adminAPI = {
  getPonds: () => api.get('/admin/ponds'),
  approvePond: (id: number) => api.patch(`/admin/ponds/${id}/approve`),
  createWildSpot: (data: any) => api.post('/admin/wild-spots', data),
  getPendingEvents: () => api.get('/admin/events/pending'),
  approveEvent: (id: number) => api.patch(`/admin/events/${id}/approve`),
  getUpgradeRequests: () => api.get('/admin/owner-upgrade-requests'),
  approveUpgrade: (userId: number) => api.post(`/admin/owner-upgrade-requests/${userId}/approve`),
};