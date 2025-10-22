import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration - Load from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fix-backend-sewwandi.onrender.com/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Debug logging
console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  nodeEnv: NODE_ENV
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // For Clerk authentication, we don't need to manually add tokens
    // Clerk handles authentication automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors silently
    return Promise.reject(error);
  }
);

// API Service Classes
export class ServicesAPI {
  static async getAllServices() {
    const response = await api.get('/services');
    return response.data;
  }

  static async getServiceById(serviceId: string) {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  }

  static async createService(serviceData: any) {
    const response = await api.post('/services', serviceData);
    return response.data;
  }

  static async updateService(serviceId: string, serviceData: any) {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  }

  static async deleteService(serviceId: string) {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  }
}

export class BookingsAPI {
  static async getAllBookings() {
    const response = await api.get('/bookings');
    return response.data;
  }

  static async getBookingById(bookingId: string) {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  }

  static async createBooking(bookingData: any) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  }

  static async getClientBookings(clientId: string) {
    const response = await api.get(`/bookings/client/${clientId}`);
    return response.data;
  }

  static async getProviderBookings(providerId: string) {
    const response = await api.get(`/bookings/provider/${providerId}`);
    return response.data;
  }

  static async updateBookingStatus(bookingId: string, status: string) {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  }

  // Public endpoint to update booking status (for handyman dashboard)
  static async updateBookingStatusPublic(bookingId: string, status: 'accepted' | 'rejected' | 'paid' | 'done' | 'completed', fee?: number, clerkUserId?: string) {
    const response = await api.patch(`/bookings/${bookingId}/status-public`, { status, fee, clerkUserId });
    return response.data;
  }

  // Public endpoint to update booking status (for client dashboard)
  static async updateBookingStatusClient(bookingId: string, status: 'paid' | 'completed', clerkUserId?: string) {
    const response = await api.patch(`/bookings/${bookingId}/status-client`, { status, clerkUserId });
    return response.data;
  }

  // General method to update booking data
  static async updateBooking(bookingId: string, bookingData: any) {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  }
}

export class AuthAPI {
  static async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  static async register(userData: any) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  static async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response.data;
  }

  static async verifyToken() {
    const response = await api.get('/auth/verify');
    return response.data;
  }

  static async verifyUserRole(userId: string) {
    const response = await api.get(`/auth/verify-role/${userId}`);
    return response.data;
  }
}

export class UsersAPI {
  static async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }

  static async updateProfile(userData: any) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }

  static async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export class ReviewsAPI {
  static async getReviews(serviceId?: string) {
    const url = serviceId ? `/reviews?serviceId=${serviceId}` : '/reviews';
    const response = await api.get(url);
    return response.data;
  }

  static async createReview(reviewData: any) {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  }

  static async updateReview(reviewId: string, reviewData: any) {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  static async deleteReview(reviewId: string) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
}

export class NotificationsAPI {
  static async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  }

  static async markAsRead(notificationId: string) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  static async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  }

  static async deleteNotification(notificationId: string) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
}

export class HandymanAPI {
  static async registerHandyman(handymanData: any) {
    const response = await api.post('/handyman/register', handymanData);
    return response.data;
  }

  static async getHandymanProfile() {
    const response = await api.get('/handyman/profile');
    return response.data;
  }

  static async updateHandymanProfile(profileData: any) {
    const response = await api.put('/handyman/profile', profileData);
    return response.data;
  }

  static async getAllHandymen() {
    const response = await api.get('/handyman/all');
    return response.data;
  }

  static async getServiceProvidersByServiceId(serviceId: string) {
    const response = await api.get(`/handyman/service/${serviceId}`);
    return response.data;
  }

  static async getAvailableServices() {
    const response = await api.get('/handyman/services');
    return response.data;
  }

  // Get service provider profile by Clerk userId
  static async getServiceProviderByUserId(userId: string) {
    const response = await api.get(`/handyman/profile/${userId}`);
    return response.data;
  }

  // Get bookings assigned to a specific service provider
  static async getProviderBookings(providerId: string) {
    const response = await api.get(`/bookings/provider/${providerId}`);
    return response.data;
  }

  // Get bookings for a service provider using their Clerk userId
  static async getProviderBookingsByClerkUserId(clerkUserId: string) {
    const response = await api.get(`/bookings/provider-clerk/${clerkUserId}`);
    return response.data;
  }

  // Get bookings for a service provider using their database ID directly
  static async getProviderBookingsByDatabaseId(providerDatabaseId: string) {
    const response = await api.get(`/bookings/provider-db/${providerDatabaseId}`);
    return response.data;
  }

  static async getUserChats(userId: string, userType: string) {
    const response = await api.get(`/chat/user?userId=${userId}&userType=${userType}`);
    return response.data;
  }
}

export class ClientAPI {
  static async createClient(clientData: { userId: string; username: string; email: string }) {
    const response = await api.post('/clients', clientData);
    return response.data;
  }

  static async getClientByUserId(userId: string) {
    const response = await api.get(`/clients/${userId}`);
    return response.data;
  }

  static async updateClientProfile(userId: string, profileData: any) {
    const response = await api.put(`/clients/${userId}`, profileData);
    return response.data;
  }

  static async getAllClients() {
    const response = await api.get('/clients');
    return response.data;
  }

  static async getUserChats(userId: string, userType: string) {
    const response = await api.get(`/chat/user?userId=${userId}&userType=${userType}`);
    return response.data;
  }

  // Check if user is registered as handyman using Clerk metadata
  static isUserHandyman(user: any) {
    try {
      // Try different ways to access metadata
      const publicMetadata = user?.publicMetadata;
      const unsafeMetadata = user?.unsafeMetadata;
      
      // Check if user has handyman metadata - try both locations
      const userType = publicMetadata?.userType || unsafeMetadata?.userType;
      const isHandyman = publicMetadata?.isHandyman || unsafeMetadata?.isHandyman;
      
      return userType === 'handyman' && isHandyman === true;
    } catch (error) {
      // If check fails, user is not a handyman
      return false;
    }
  }
}

export class ChatAPI {
  // Get chat messages for a specific booking
  static async getChatMessages(bookingId: string) {
    const response = await api.get(`/chat/${bookingId}/messages`);
    return response.data;
  }

  // Send a message via API (fallback when WebSocket is not available)
  static async sendMessage(data: {
    bookingId: string;
    senderId: string;
    senderName: string;
    message: string;
  }) {
    const response = await api.post('/chat/send', data);
    return response.data;
  }

  // Get all chats for a user
  static async getUserChats(userId: string, userType: string) {
    const response = await api.get(`/chat/user/${userId}?userType=${userType}`);
    return response.data;
  }
}

export class StripeAPI {
  // Create a Stripe Express account for a service provider
  static async createProviderAccount(userId: string) {
    const response = await api.post('/stripe/create-provider-account', { userId });
    return response.data;
  }

  // Get provider's Stripe account status
  static async getProviderAccountStatus(userId: string) {
    const response = await api.get(`/stripe/provider-account/${userId}`);
    return response.data;
  }

  // Create a checkout session for a booking
  static async createCheckoutSession(bookingId: string) {
    const response = await api.post('/stripe/create-checkout-session', { bookingId });
    return response.data;
  }

  // Get payment details by booking ID
  static async getPaymentByBookingId(bookingId: string) {
    const response = await api.get(`/stripe/payment/booking/${bookingId}`);
    return response.data;
  }

  // Create a refund for a payment
  static async createRefund(paymentId: string, amount?: number, reason?: string) {
    const response = await api.post(`/stripe/refund/${paymentId}`, { amount, reason });
    return response.data;
  }
}

// Export the main api instance for custom requests
export { api };
export default api;

// Export types for better TypeScript support
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 