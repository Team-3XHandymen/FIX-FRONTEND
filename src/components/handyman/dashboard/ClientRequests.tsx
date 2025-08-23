
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import RequestDetailsDialog from "../RequestDetailsDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  clientName: string; // Added client name field
  providerId: string;
  serviceId: string;
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
}

interface ClientRequestsProps {
  onStatusChange?: () => void; // Callback to refresh parent components
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
      
      // Use the Clerk user ID from the current user
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

  // Filter only pending bookings for client requests
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');

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

  // Callback to refresh bookings after status change
  const handleStatusChange = useCallback(() => {
    fetchBookings();
    // Also notify parent component
    if (onStatusChange) {
      onStatusChange();
    }
  }, [fetchBookings, onStatusChange]);

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow mt-4">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Client Requests</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading client requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mt-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Client Requests</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {pendingBookings.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-500">All client requests have been processed. Check back later for new requests.</p>
        </div>
      ) : (
        <>
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">Please review and accept</p>
          </div>
          <ul className="divide-y">
            {pendingBookings.map((booking) => (
              <li key={booking._id} className="relative flex justify-between items-center p-4">
                <div className="absolute top-2 -left-1 bg-[#ea384c] text-white px-3 py-1 text-xs font-bold">
                  NEW
                </div>
                <div className="mt-6">
                  <div className="font-semibold text-lg">{booking.serviceName}</div>
                  <div className="text-sm text-gray-600 mb-1">{booking.description}</div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Client:</span> {booking.clientName}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {booking.location.address}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Requested:</span> {formatDateTime(booking.createdAt)}
                  </div>
                  <div className="text-xs text-green-700">
                    <span className="font-medium">Scheduled:</span> {formatDateTime(booking.scheduledTime)}
                  </div>
                  {booking.fee && (
                    <div className="text-sm font-medium text-green-600">
                      Fee: ${booking.fee}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedRequest(booking)}
                  className="bg-green-50 text-green-700 px-4 py-2 rounded hover:bg-green-100 text-sm font-medium"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      
      {selectedRequest && (
        <RequestDetailsDialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
          request={selectedRequest}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ClientRequests;
