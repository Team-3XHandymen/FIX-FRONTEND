
import React, { useState, useEffect } from "react";
import { useUser, useAuth } from '@clerk/clerk-react';

interface StatsData {
  totalEarnings: number;
  pendingAmount: number;
  transactionCount: number;
  jobsCompleted: number;
  averageRating: number;
}

const StatsCards = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalEarnings: 0,
    pendingAmount: 0,
    transactionCount: 0,
    jobsCompleted: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (user?.id && getToken) {
      fetchStats();
    }
  }, [user?.id, getToken]);

  const fetchStats = async () => {
    if (!user?.id || !getToken) return;

    try {
      const token = await getToken();
      
      // Fetch payment stats
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const paymentResponse = await fetch(`${API_BASE_URL}/stripe/payments/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
      });

      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        if (paymentResult.success && paymentResult.data.summary) {
          setStats(prev => ({
            ...prev,
            totalEarnings: paymentResult.data.summary.totalEarnings,
            pendingAmount: paymentResult.data.summary.pendingAmount,
            transactionCount: paymentResult.data.summary.transactionCount,
          }));
        }
      }

      // Fetch booking stats (jobs completed)
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
      });

      if (bookingsResponse.ok) {
        const bookingsResult = await bookingsResponse.json();
        if (bookingsResult.success && bookingsResult.data) {
          const completedJobs = bookingsResult.data.filter(
            (booking: any) => booking.status === 'completed' || booking.status === 'done'
          ).length;
          
          setStats(prev => ({
            ...prev,
            jobsCompleted: completedJobs,
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Total Earnings</div>
          <div className="text-xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">from {stats.transactionCount} transactions</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Jobs Completed</div>
          <div className="text-xl font-bold">{stats.jobsCompleted}</div>
          <div className="text-xs text-gray-400 mt-1">completed successfully</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Average Rating</div>
          <div className="text-xl font-bold">4.8</div>
          <div className="text-xs text-gray-400 mt-1">based on reviews</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
