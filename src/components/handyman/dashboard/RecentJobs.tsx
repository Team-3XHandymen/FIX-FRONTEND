
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI } from "@/lib/api";
import JobCard from "./JobCard";
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

  // Filter non-pending bookings for recent jobs
  const recentBookings = bookings
    .filter(booking => booking.status !== 'pending')
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
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      case 'done':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleManualRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Jobs</h2>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading recent jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Recent Jobs</h2>
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
      
      {recentBookings.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Jobs</h3>
          <p className="text-gray-500">Jobs will appear here after you accept or reject client requests.</p>
        </div>
      ) : (
        <div className="grid gap-4 p-4">
          {recentBookings.map((booking) => (
            <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{booking.serviceName}</h3>
                  <p className="text-sm text-gray-600">{booking.clientName}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="line-clamp-2">{booking.description}</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {booking.location.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(booking.scheduledTime)}
                  </span>
                </div>
                {booking.fee && (
                  <div className="text-sm font-medium text-green-600">
                    Fee: ${booking.fee}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobs;
