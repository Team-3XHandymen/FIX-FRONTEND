import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (sessionId && bookingId && user && getToken) {
      fetchPaymentDetails();
    } else {
      setIsLoading(false);
    }
  }, [sessionId, bookingId, user, getToken]);

  const fetchPaymentDetails = async () => {
    try {
      if (!bookingId || !user || !getToken) return;

      const token = await getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      
      // First, try to get existing payment details
      let response = await fetch(`${API_BASE_URL}/stripe/payment/booking/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'client',
        },
      });

      // If payment doesn't exist (404), try to create it manually using session data
      if (!response.ok && response.status === 404) {
        console.log('Payment record not found, attempting to create manually...');
        
        if (sessionId) {
          // Create payment record manually using session data
          const createResponse = await fetch(`${API_BASE_URL}/stripe/create-manual-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-User-ID': user.id,
              'X-User-Type': 'client',
            },
            body: JSON.stringify({
              bookingId,
              sessionId,
            }),
          });

          if (createResponse.ok) {
            console.log('✅ Manual payment record created successfully');
            // Now fetch the payment details again
            response = await fetch(`${API_BASE_URL}/stripe/payment/booking/${bookingId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-User-ID': user.id,
                'X-User-Type': 'client',
              },
            });
          } else {
            console.error('Failed to create manual payment record');
          }
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPaymentDetails(result.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToBooking = () => {
    navigate(`/client/booking/${bookingId}`);
  };

  const handleGoToDashboard = () => {
    navigate('/client/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentDetails && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ${(paymentDetails.amountCents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-green-600 capitalize">
                  {paymentDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">
                  {paymentDetails.metadata?.serviceName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">
                  {paymentDetails.metadata?.providerName}
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your provider has been notified</li>
              <li>• You can track your booking status</li>
              <li>• You'll receive updates via notifications</li>
            </ul>
          </div>

          <div className="space-y-3">
            {bookingId && (
              <Button
                onClick={handleGoToBooking}
                className="w-full"
                size="lg"
              >
                View Booking Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              A receipt has been sent to your email address. 
              If you have any questions, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
