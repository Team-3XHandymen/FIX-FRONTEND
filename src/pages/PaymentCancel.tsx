import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get('booking_id');

  const handleRetryPayment = () => {
    if (bookingId) {
      navigate(`/client/booking/${bookingId}`);
    } else {
      navigate('/client/dashboard');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Cancelled</CardTitle>
          <CardDescription>
            Your payment was cancelled and no charges were made
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Don't worry!
            </h3>
            <p className="text-sm text-yellow-700">
              Your booking is still pending. You can complete the payment anytime 
              before the service is scheduled.
            </p>
          </div>

          <div className="space-y-3">
            {bookingId && (
              <Button
                onClick={handleRetryPayment}
                className="w-full"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Try Payment Again
              </Button>
            )}
            
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>
              Need help? Contact our support team for assistance with payments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
