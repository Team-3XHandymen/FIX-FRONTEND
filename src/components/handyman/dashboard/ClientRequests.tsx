
import { useState, useCallback, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import { socketService } from "@/lib/socket";
import RequestDetailsDialog from "../RequestDetailsDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Eye } from "lucide-react";

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

interface ClientRequestsProps {
  onStatusChange?: () => void;
}

const ClientRequests = ({ onStatusChange }: ClientRequestsProps) => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);

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
    
    // Set up WebSocket listener for real-time updates
    if (user) {
      // Listen for booking status changes
      socketService.onBookingStatusChange((update) => {
        console.log('Handyman dashboard - Status change detected via WebSocket:', update);
        // Refresh bookings when status changes
        fetchBookings(true);
        // Notify parent component
        if (onStatusChange) {
          onStatusChange();
        }
      });

      // Cleanup WebSocket listeners
      return () => {
        socketService.removeAllListeners();
      };
    }
  }, [fetchBookings, user, onStatusChange]);

  // Categorize bookings into two sections
  const categorizedBookings = useCallback(() => {
    const actionRequired: Booking[] = [];
    const viewOnly: Booking[] = [];

    console.log('Categorizing bookings:', bookings.map(b => ({ id: b._id, status: b.status })));

    bookings.forEach((booking) => {
      switch (booking.status) {
        case 'pending':
        case 'paid':
          actionRequired.push(booking);
          break;
        case 'accepted':
        case 'rejected':
        case 'done':
          // Only include non-completed bookings in viewOnly
          viewOnly.push(booking);
          break;
        case 'completed':
          // Completed bookings go to service history, not here
          break;
        default:
          // Add any other statuses to view only
          viewOnly.push(booking);
          break;
      }
    });

    console.log('Categorized results:', {
      actionRequired: actionRequired.map(b => ({ id: b._id, status: b.status })),
      viewOnly: viewOnly.map(b => ({ id: b._id, status: b.status }))
    });

    return { actionRequired, viewOnly };
  }, [bookings]);

  const { actionRequired, viewOnly } = categorizedBookings();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'paid':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'done':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'PENDING';
      case 'accepted':
        return 'ACCEPTED';
      case 'rejected':
        return 'REJECTED';
      case 'paid':
        return 'PAID';
      case 'done':
        return 'WORK DONE';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  };

  const getActionButtonText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Review & Respond';
      case 'paid':
        return 'Mark Work Done';
      case 'done':
        return 'View Details';
      default:
        return 'View Details';
    }
  };

  const getActionButtonStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'paid':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'done':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const handleStatusChange = useCallback(() => {
    console.log('Status change detected, refreshing bookings...');
    fetchBookings();
    if (onStatusChange) {
      console.log('Calling parent onStatusChange callback...');
      onStatusChange();
    }
  }, [fetchBookings, onStatusChange]);

  const handleManualRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Client Requests</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Action Required Section */}
      {actionRequired.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Action Required</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">{actionRequired.length} booking(s) need attention</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            {actionRequired.map(booking => (
              <div key={booking._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                          {getStatusDisplayText(booking.status)}
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
                          <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
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
                    <Button
                      className={`${getActionButtonStyle(booking.status)} px-6 py-2`}
                      onClick={() => setSelectedRequest(booking)}
                    >
                      {getActionButtonText(booking.status)}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Jobs Section */}
      {viewOnly.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
          </div>
          
          <div className="grid gap-4">
            {viewOnly.map(booking => (
              <div key={booking._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                          {getStatusDisplayText(booking.status)}
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
                          <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
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
                    <Button
                      variant="outline"
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedRequest(booking)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No bookings message */}
      {actionRequired.length === 0 && viewOnly.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No client requests yet</h3>
          <p className="text-gray-500">When clients book your services, they will appear here for you to review and respond.</p>
        </div>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <RequestDetailsDialog
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
          request={selectedRequest}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ClientRequests;
