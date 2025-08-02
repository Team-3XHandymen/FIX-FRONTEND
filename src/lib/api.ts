import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or Clerk
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    console.log('Fetching services from:', `${API_BASE_URL}/services`);
    const response = await api.get('/services');
    console.log('Services API response:', response.data);
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