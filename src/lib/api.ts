import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration - Load from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
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
    // Get token from localStorage or Clerk
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For Clerk authentication, we need to get the user ID from the current user
    // This will be handled by the ClerkProvider context in the components
    // For now, we'll rely on the components to set the headers directly
    
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
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login/client';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error occurred');
    }
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

  static async updateBooking(bookingId: string, bookingData: any) {
    const response = await api.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  }

  static async deleteBooking(bookingId: string) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  }

  // Get current user's bookings (uses /my endpoint)
  static async getMyBookings() {
    // For Clerk authentication, we need to get the current user
    // This method should be called from a component that has access to Clerk context
    const response = await api.get('/bookings/my');
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

// Export the main api instance for custom requests
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