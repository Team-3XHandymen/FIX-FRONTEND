import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { StripeAPI } from '@/lib/api';

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

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create checkout session
      const response = await StripeAPI.createCheckoutSession(bookingId);

      if (response.success && response.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response.message || 'Failed to create payment session');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      
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
