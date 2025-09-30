import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { StripePaymentButton } from "@/components/payments/StripePaymentButton";
import { useToast } from "@/hooks/use-toast";

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

interface BookingPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onPaymentSuccess?: () => void;
}

export const BookingPaymentDialog: React.FC<BookingPaymentDialogProps> = ({
  open,
  onOpenChange,
  booking,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();

  if (!booking) return null;

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
      accepted: { variant: 'default' as const, label: 'Accepted', color: 'text-green-600' },
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
    onPaymentSuccess?.();
    onOpenChange(false);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Booking Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{booking.serviceName}</CardTitle>
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
                <CardTitle className="text-lg">Payment Details</CardTitle>
                <CardDescription>
                  Complete your payment to confirm the booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Service Fee</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.serviceName} by {booking.providerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${booking.fee.toFixed(2)}</p>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Waiting for provider to accept your booking request and set the service fee.
                </p>
              </div>
            </div>
          )}

          {booking.status === 'paid' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800">
                  Payment completed! Your provider has been notified and will proceed with the service.
                </p>
              </div>
            </div>
          )}

          {booking.status === 'done' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Service completed! Please confirm completion to finalize the transaction.
                </p>
              </div>
            </div>
          )}

          {booking.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800">
                  Transaction completed! Thank you for using our platform.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
