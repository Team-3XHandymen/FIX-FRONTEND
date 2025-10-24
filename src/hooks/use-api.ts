import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ServicesAPI, 
  BookingsAPI, 
  AuthAPI, 
  UsersAPI, 
  ReviewsAPI, 
  NotificationsAPI,
  type ApiResponse,
  type PaginatedResponse 
} from '@/lib/api';

// Services Hooks
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: ServicesAPI.getAllServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useService = (serviceId: string) => {
  return useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => ServicesAPI.getServiceById(serviceId),
    enabled: !!serviceId,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ServicesAPI.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ serviceId, serviceData }: { serviceId: string; serviceData: any }) =>
      ServicesAPI.updateService(serviceId, serviceData),
    onSuccess: (_, { serviceId }) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', serviceId] });
    },
  });
};

// Bookings Hooks
export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: BookingsAPI.getAllBookings,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => BookingsAPI.getBookingById(bookingId),
    enabled: !!bookingId,
  });
};

// Get current user's bookings (for authenticated users)
export const useMyBookings = (user: any) => {
  return useQuery({
    queryKey: ['bookings', 'my', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching bookings for user:', user.id);
      
      try {
        // Use the configured API base URL instead of relative path
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fixfinder-backend-zrn7.onrender.com/api';
        console.log('useMyBookings - API_BASE_URL:', API_BASE_URL);
        console.log('useMyBookings - Full URL:', `${API_BASE_URL}/bookings/my`);
        const response = await fetch(`${API_BASE_URL}/bookings/my`, {
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
            'X-User-Type': 'client'
          }
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`Failed to fetch bookings: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Bookings data:', data);
        return data;
      } catch (error) {
        console.error('Error in useMyBookings:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      console.log(`Retrying fetch bookings (attempt ${failureCount + 1}):`, error);
      return failureCount < 3;
    },
  });
};

export const useClientBookings = (clientId: string) => {
  return useQuery({
    queryKey: ['bookings', 'client', clientId],
    queryFn: () => BookingsAPI.getClientBookings(clientId),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useProviderBookings = (providerId: string) => {
  return useQuery({
    queryKey: ['bookings', 'provider', providerId],
    queryFn: () => BookingsAPI.getProviderBookings(providerId),
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: BookingsAPI.createBooking,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Invalidate specific client/provider bookings
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: ['bookings', 'client', variables.clientId] });
      }
      if (variables.providerId) {
        queryClient.invalidateQueries({ queryKey: ['bookings', 'provider', variables.providerId] });
      }
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, bookingData }: { bookingId: string; bookingData: any }) =>
      BookingsAPI.updateBooking(bookingId, bookingData),
    onSuccess: (data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      BookingsAPI.updateBookingStatus(bookingId, status),
    onSuccess: (data, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
    },
  });
};

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AuthAPI.register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AuthAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear(); // Clear all queries
    },
  });
};

// User Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: UsersAPI.getCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false; // Don't retry on 401
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UsersAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: UsersAPI.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Reviews Hooks
export const useReviews = (serviceId?: string) => {
  return useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: () => ReviewsAPI.getReviews(serviceId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ReviewsAPI.createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      if (variables.serviceId) {
        queryClient.invalidateQueries({ queryKey: ['reviews', variables.serviceId] });
      }
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, reviewData }: { reviewId: string; reviewData: any }) =>
      ReviewsAPI.updateReview(reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// Notifications Hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationsAPI.getNotifications,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: NotificationsAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: NotificationsAPI.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}; 