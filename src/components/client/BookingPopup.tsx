
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Clock, MapPin, User, DollarSign, CreditCard, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import { BookingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  _id: string;
  serviceId: any; // Service object from populate
  providerId: string;
  clientId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'done' | 'completed';
  description: string;
  fee: number | null;
  location: {
    address: string;
    coordinates?: { lat: number; lng: number; };
  };
  scheduledTime: string | Date;
  createdAt: string | Date;
  // New enriched fields from backend
  providerName?: string;
  serviceCategory?: string;
}

// Status progress bar component
const StatusProgressBar = ({ currentStatus }: { currentStatus: string }) => {
  const steps = [
    { status: 'pending', label: 'Booking Placed', icon: Clock, color: 'bg-blue-500' },
    { status: 'accepted', label: 'Accepted by Provider', icon: CheckCircle, color: 'bg-green-500' },
    { status: 'paid', label: 'Payment Confirmed', icon: CreditCard, color: 'bg-purple-500' },
    { status: 'done', label: 'Work Completed', icon: CheckCircle, color: 'bg-orange-500' },
    { status: 'completed', label: 'Job Finished', icon: CheckCircle, color: 'bg-gray-500' }
  ];

  const currentIndex = steps.findIndex(step => step.status === currentStatus);
  const isRejected = currentStatus === 'rejected';

  if (isRejected) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-700">Booking Rejected</span>
        </div>
        <div className="w-full bg-red-100 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Booking Progress</span>
        <span className="text-xs text-gray-500">{currentIndex + 1} of {steps.length}</span>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.status} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? step.color : 'bg-gray-300'
                } text-white text-xs font-bold transition-all duration-300`}>
                  {isCurrent ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  isActive ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Status explanation component
const StatusExplanation = ({ status }: { status: string }) => {
  const explanations = {
    pending: {
      title: "Booking Pending",
      description: "Your booking has been submitted and is waiting for the service provider to review and accept.",
      nextStep: "The provider will review your request and either accept or reject it. You'll be notified once they respond.",
      icon: Clock,
      color: "text-blue-600"
    },
    accepted: {
      title: "Booking Accepted",
      description: "Great news! The service provider has accepted your booking and provided a fee.",
      nextStep: "Please review the fee and confirm payment to proceed with the service.",
      icon: CheckCircle,
      color: "text-green-600"
    },
    paid: {
      title: "Payment Confirmed",
      description: "Your payment has been confirmed and the service provider has been notified.",
      nextStep: "The provider will complete the work and mark it as done. You'll be notified when they finish.",
      icon: CreditCard,
      color: "text-purple-600"
    },
    done: {
      title: "Work Completed",
      description: "The service provider has marked the work as completed and is waiting for your confirmation.",
      nextStep: "Please review the completed work and confirm completion to release payment to the provider.",
      icon: CheckCircle,
      color: "text-orange-600"
    },
    completed: {
      title: "Job Finished",
      description: "Congratulations! The job has been completed and payment has been released to the provider.",
      nextStep: "You can now leave a review for the service provider if you'd like.",
      icon: CheckCircle,
      color: "text-gray-600"
    },
    rejected: {
      title: "Booking Rejected",
      description: "Unfortunately, your booking has been rejected by the service provider.",
      nextStep: "You can try booking with another provider or contact support for assistance.",
      icon: AlertCircle,
      color: "text-red-600"
    }
  };

  const info = explanations[status as keyof typeof explanations] || explanations.pending;
  const Icon = info.icon;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full bg-white shadow-sm`}>
          <Icon className={`h-5 w-5 ${info.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{info.description}</p>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <span className="font-medium">Next Step:</span> {info.nextStep}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPopup = ({
  booking,
  open,
  onOpenChange,
  onStatusChange
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: () => void;
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChat = () => {
    navigate(`/client/chat/${booking._id}`);
    onOpenChange(false);
  };

  const handleMarkAsPaid = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const response = await BookingsAPI.updateBookingStatusClient(
        booking._id,
        'paid',
        user.id
      );

      if (response.success) {
        toast({
          title: "Payment Confirmed",
          description: "Your payment has been confirmed. The service provider will now proceed with the work.",
        });
        onOpenChange(false);
        // Refresh the parent component to show updated status
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to confirm payment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast({
        title: "Error",
        description: "An error occurred while confirming payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const response = await BookingsAPI.updateBookingStatusClient(
        booking._id,
        'completed',
        user.id
      );

      if (response.success) {
        toast({
          title: "Job Completed",
          description: "Thank you for confirming! The service provider has been paid.",
        });
        onOpenChange(false);
        // Refresh the parent component to show updated status
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to mark job as completed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast({
        title: "Error",
        description: "An error occurred while marking job as completed.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date and time
  const formatDateTime = (dateTime: string | Date) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const { date, time } = formatDateTime(booking.scheduledTime);

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'PENDING', className: 'bg-blue-100 text-blue-700' };
      case 'accepted':
        return { label: 'ACCEPTED', className: 'bg-green-100 text-green-700' };
      case 'rejected':
        return { label: 'REJECTED', className: 'bg-red-100 text-red-700' };
      case 'paid':
        return { label: 'PAID', className: 'bg-purple-100 text-purple-700' };
      case 'done':
        return { label: 'WORK COMPLETED', className: 'bg-orange-100 text-orange-700' };
      case 'completed':
        return { label: 'COMPLETED', className: 'bg-gray-100 text-gray-700' };
      default:
        return { label: status.toUpperCase(), className: 'bg-gray-100 text-gray-700' };
    }
  };

  const statusInfo = getStatusInfo(booking.status);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 text-blue-700';
      case 'accepted':
        return 'border-green-200 text-green-700';
      case 'rejected':
        return 'border-red-200 text-red-700';
      case 'paid':
        return 'border-purple-200 text-purple-700';
      case 'done':
        return 'border-orange-200 text-orange-700';
      case 'completed':
        return 'border-gray-200 text-gray-700';
      default:
        return 'border-gray-200 text-gray-700';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Booking Placed';
      case 'accepted':
        return 'Accepted by Provider';
      case 'rejected':
        return 'Booking Rejected';
      case 'paid':
        return 'Payment Confirmed';
      case 'done':
        return 'Work Completed';
      case 'completed':
        return 'Job Finished';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
              {/* Service Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.serviceCategory || 'Service'}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{booking.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeStyle(booking.status)}`}>
                  {getStatusDisplayText(booking.status)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Provider:</span>
                  <span className="ml-2 font-semibold text-gray-900">{booking.providerName || 'Unknown Provider'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-semibold text-gray-900">{booking.location.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date(booking.scheduledTime).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date(booking.scheduledTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
              {booking.fee && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="text-gray-500">Service Fee:</span>
                    <span className="ml-2 text-2xl font-bold text-green-600">${booking.fee}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Progress Bar */}
          <StatusProgressBar currentStatus={booking.status} />

          {/* Status Explanation */}
          <StatusExplanation status={booking.status} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {booking.status === 'accepted' && (
              <Button
                onClick={handleMarkAsPaid}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Confirm Payment
                  </>
                )}
              </Button>
            )}

            {booking.status === 'done' && (
              <Button
                onClick={handleMarkAsCompleted}
                disabled={isProcessing}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Confirm Job Completion
                  </>
                )}
              </Button>
            )}

            {booking.status !== 'completed' && booking.status !== 'rejected' && (
              <Button
                variant="outline"
                onClick={handleChat}
                className="flex-1 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with Provider
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingPopup;
