import React from "react";
import { useState, useCallback, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import { RefreshCw, Clock, Eye } from "lucide-react";

interface Booking {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'done' | 'completed';
  description: string;
  fee: number | null;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  clientId: string;
  clientName: string;
  providerId: string;
  serviceId: string;
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
}

const RecentJobs = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async (showRefreshing = false) => {
    if (!user) return;

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const clerkUserId = user.id;
      const response = await HandymanAPI.getProviderBookingsByClerkUserId(clerkUserId);
      if (response.success) {
        setBookings(response.data || []);
      } else {
        // Failed to fetch bookings
        setBookings([]);
      }
    } catch (error) {
      // Failed to fetch provider bookings
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleRefresh = () => {
    fetchBookings(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'paid':
        return 'Paid';
      case 'done':
        return 'Work Done';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Jobs</h4>
            <p className="text-gray-500">You haven't completed any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{booking.serviceName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Client:</span>
                        <span>{booking.clientName}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        <span>{booking.location.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Scheduled:</span>
                        <span>{formatDate(booking.scheduledTime)} at {formatTime(booking.scheduledTime)}</span>
                      </div>
                      
                      {booking.fee && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Fee:</span>
                          <span className="font-semibold text-green-600">${booking.fee}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {booking.description}
                    </p>
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {bookings.length > 5 && (
              <div className="text-center pt-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Jobs ({bookings.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentJobs;
