import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, CreditCard, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { StripePaymentButton } from '@/components/payments/StripePaymentButton';
import { useToast } from '@/hooks/use-toast';
import { BookingsAPI } from '@/lib/api';
import ClientDashboardLayout from '@/components/client/ClientDashboardLayout';
import { useUser, useAuth } from '@clerk/clerk-react';

interface Booking {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'done' | 'completed';
  description: string;
  fee: number | null;
  location: {
    address: string;
  };
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
}

const ClientPayment: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId && user && getToken) {
      fetchBooking();
    }
  }, [bookingId, user, getToken]);

  const fetchBooking = async () => {
    if (!user || !getToken) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();
      
      // Create a custom API call with proper headers
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'client',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setBooking(result.data);
      } else {
        setError(result.message || 'Failed to load booking');
      }
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending', color: 'text-yellow-600' },
      accepted: { variant: 'default' as const, label: 'Accepted', color: 'text-black-600' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', color: 'text-red-600' },
      paid: { variant: 'default' as const, label: 'Paid', color: 'text-blue-600' },
      done: { variant: 'default' as const, label: 'Completed', color: 'text-purple-600' },
      completed: { variant: 'default' as const, label: 'Completed', color: 'text-green-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your payment has been processed successfully!",
    });
    navigate('/client/dashboard');
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout title="Payment">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2">Loading booking details...</span>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (error || !booking) {
    return (
      <ClientDashboardLayout title="Payment">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Booking Not Found</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'The booking you\'re looking for doesn\'t exist or you don\'t have access to it.'}
              </p>
              <Button onClick={() => navigate('/client/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title="Payment">
      <div className="max-w-2xl mx-auto">
        <Button 
          onClick={() => navigate('/client/dashboard')}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Booking Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{booking.serviceName}</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
              <CardDescription>
                Service provided by {booking.providerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(booking.scheduledTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formatTime(booking.scheduledTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.location.address}</span>
                </div>
              </div>

              {booking.description && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Description:</h4>
                  <p className="text-sm text-muted-foreground">{booking.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Section */}
          {booking.status === 'accepted' && booking.fee && booking.fee > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your payment to confirm the booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-lg">Service Fee</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.serviceName} by {booking.providerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">${booking.fee.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Includes platform fee
                    </p>
                  </div>
                </div>

                <StripePaymentButton
                  bookingId={booking._id}
                  amount={booking.fee}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p>
                        Your payment is processed securely by Stripe. 
                        The provider will receive their payment after the service is completed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Messages */}
          {booking.status === 'pending' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Waiting for provider to accept your booking request and set the service fee.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {booking.status === 'paid' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Payment completed! Your provider has been notified and will proceed with the service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {booking.status === 'done' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Service completed! Please confirm completion to finalize the transaction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {booking.status === 'completed' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Transaction completed! Thank you for using our platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientPayment;
