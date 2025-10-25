import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@clerk/clerk-react';

interface StripePaymentButtonProps {
  bookingId: string;
  amount: number;
  disabled?: boolean;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export const StripePaymentButton: React.FC<StripePaymentButtonProps> = ({
  bookingId,
  amount,
  disabled = false,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { getToken } = useAuth();

  const handlePayment = async () => {
    if (!user || !getToken) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a payment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const token = await getToken();
      
      // Create checkout session with proper authentication headers
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'client',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.checkoutUrl;
      } else {
        throw new Error(result.message || 'Failed to create payment session');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Payment failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });

      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Processing...
        </>
      ) : (
        <>
          💳 Pay ${amount.toFixed(2)}
        </>
      )}
    </Button>
  );
};
