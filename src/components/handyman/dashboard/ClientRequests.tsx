
import React, { useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import RequestDetailsDialog from "../RequestDetailsDialog";

interface Booking {
  _id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
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

const ClientRequests = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Use the known provider database ID directly
        // This is the ID from the service providers collection
        const providerDatabaseId = "dba4c6f1-5bf6-4424-aab6-4758156781eb";
        
        const response = await HandymanAPI.getProviderBookingsByDatabaseId(providerDatabaseId);
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
      }
    };

    fetchBookings();
  }, [user]);

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
      <div className="p-4 border-b">
        <h2 className="font-semibold">Client Requests</h2>
      </div>
      <div className="p-4 bg-red-50 border-b border-red-100">
        <p className="text-red-600 text-sm">Please review and accept</p>
      </div>
      <ul className="divide-y">
        {pendingBookings.length === 0 ? (
          <li className="py-6 text-center text-gray-500">No new client requests.</li>
        ) : (
          pendingBookings.map((booking) => (
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
          ))
        )}
      </ul>
      {selectedRequest && (
        <RequestDetailsDialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default ClientRequests;
