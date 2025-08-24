
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
        console.error('Failed to fetch bookings:', response.message);
        setBookings([]);
      }
    } catch (error) {
      console.error('Failed to fetch provider bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter non-completed bookings for recent jobs
  const recentBookings = bookings
    .filter(booking => booking.status !== 'completed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // Show only the 10 most recent

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'done':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'paid':
        return 'Paid';
      case 'done':
        return 'Work Done';
      case 'pending':
        return 'Pending';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleManualRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading recent jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Recent Jobs</h2>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {recentBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recent jobs</h3>
          <p className="text-gray-500">Your recent job history will appear here once you start accepting bookings.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recentBookings.map(booking => (
            <div key={booking._id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Client:</span>
                        <span className="ml-2 font-medium text-gray-900">{booking.clientName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Scheduled:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDate(booking.scheduledTime)}</span>
                      </div>
                      {booking.fee && (
                        <div>
                          <span className="text-gray-500">Fee:</span>
                          <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    ID: {booking._id}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(booking.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobs;
