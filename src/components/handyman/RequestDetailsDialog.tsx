
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, CheckCircle, AlertCircle, Info, Clock, CheckCircle2, CreditCard, User, MapPin, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@clerk/clerk-react';

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
  clientName: string; // Added client name field
  providerId: string;
  serviceId: string;
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
}

interface RequestDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Booking;
  onStatusChange?: () => void; // Callback to refresh the parent component
}

// Status progress bar component
const StatusProgressBar = ({ currentStatus }: { currentStatus: string }) => {
  const steps = [
    { status: 'pending', label: 'Booking Placed', icon: Clock, color: 'bg-blue-500' },
    { status: 'accepted', label: 'Accepted by Provider', icon: CheckCircle, color: 'bg-green-500' },
    { status: 'paid', label: 'Payment Confirmed', icon: CreditCard, color: 'bg-purple-500' },
    { status: 'done', label: 'Work Completed', icon: CheckCircle2, color: 'bg-orange-500' },
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
      title: "New Booking Request",
      description: "A client has submitted a new booking request that requires your review.",
      nextStep: "Review the request details and either accept with a fee or reject it.",
      icon: Clock,
      color: "text-blue-600"
    },
    accepted: {
      title: "Booking Accepted",
      description: "You have accepted this booking and provided a fee to the client.",
      nextStep: "Wait for the client to confirm payment, then proceed with the work.",
      icon: CheckCircle,
      color: "text-green-600"
    },
    paid: {
      title: "Payment Confirmed",
      description: "The client has confirmed payment and you can now proceed with the work.",
      nextStep: "Complete the work and mark it as done when finished.",
      icon: CreditCard,
      color: "text-purple-600"
    },
    done: {
      title: "Work Completed",
      description: "You have marked the work as completed and are waiting for client confirmation.",
      nextStep: "The client will review and confirm completion to release payment.",
      icon: CheckCircle2,
      color: "text-orange-600"
    },
    completed: {
      title: "Job Finished",
      description: "The job has been completed and payment has been released to you.",
      nextStep: "You can now leave a review for the client if you'd like.",
      icon: CheckCircle,
      color: "text-gray-600"
    },
    rejected: {
      title: "Booking Rejected",
      description: "You have rejected this booking request.",
      nextStep: "The client will be notified and can try booking with another provider.",
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

const RequestDetailsDialog = ({ open, onOpenChange, request, onStatusChange }: RequestDetailsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fee, setFee] = useState<string>(request.fee?.toString() || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const { user } = useUser();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAccept = async () => {
    if (!fee || parseFloat(fee) <= 0) {
      toast({
        title: "Invalid Fee",
        description: "Please enter a valid service fee greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setActionType('accept');

    try {
      const response = await BookingsAPI.updateBookingStatusPublic(
        request._id, 
        'accepted', 
        parseFloat(fee),
        user?.id // Pass Clerk user ID for security verification
      );

      if (response.success) {
        toast({
          title: "Booking Accepted",
          description: "You have successfully accepted this booking request.",
        });
        
        // Refresh the parent component to update the list
        if (onStatusChange) {
          onStatusChange();
        }
        
        // Close the dialog
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to accept booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while accepting the booking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    setActionType('reject');

    try {
      const response = await BookingsAPI.updateBookingStatusPublic(
        request._id, 
        'rejected',
        undefined,
        user?.id // Pass Clerk user ID for security verification
      );

      if (response.success) {
        toast({
          title: "Booking Rejected",
          description: "You have rejected this booking request.",
        });
        
        // Refresh the parent component to update the list
        if (onStatusChange) {
          onStatusChange();
        }
        
        // Close the dialog
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to reject booking.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the booking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 text-blue-700 hover:bg-blue-50';
      case 'accepted':
        return 'border-green-200 text-green-700 hover:bg-green-50';
      case 'paid':
        return 'border-purple-200 text-purple-700 hover:bg-purple-50';
      case 'done':
        return 'border-orange-200 text-orange-700 hover:bg-orange-50';
      case 'completed':
        return 'border-gray-200 text-gray-700 hover:bg-gray-50';
      case 'rejected':
        return 'border-red-200 text-red-700 hover:bg-red-50';
      default:
        return 'border-gray-200 text-gray-700 hover:bg-gray-50';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'New Booking Request';
      case 'accepted':
        return 'Booking Accepted';
      case 'paid':
        return 'Payment Confirmed';
      case 'done':
        return 'Work Completed';
      case 'completed':
        return 'Job Finished';
      case 'rejected':
        return 'Booking Rejected';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Request Details Content */}
          <>
              {/* Service Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{request.serviceName}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{request.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeStyle(request.status)}`}>
                  {getStatusDisplayText(request.status)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Client:</span>
                  <span className="ml-2 font-semibold text-gray-900">{request.clientName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-semibold text-gray-900">{request.location.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date(request.scheduledTime).toLocaleDateString('en-US', { 
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
                    {new Date(request.scheduledTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
              {request.fee && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="text-gray-500">Service Fee:</span>
                    <span className="ml-2 text-2xl font-bold text-green-600">${request.fee}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Progress Bar */}
          <StatusProgressBar currentStatus={request.status} />

          {/* Status Explanation */}
          <StatusExplanation status={request.status} />

          {/* Fee Input Section - Only show for pending bookings */}
          {request.status === 'pending' && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-500" />
                Set Service Fee
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fee" className="text-sm font-medium text-gray-700">
                    Fee Amount ($)
                  </Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="Enter fee amount"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="mt-2 border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <p className="text-xs text-orange-600">
                  💡 Set a fair price for your service. The client will review and confirm this amount.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {/* For pending bookings - show accept/reject buttons */}
            {request.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-red-200 text-red-700 hover:bg-red-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing && actionType === 'reject' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Reject
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/handyman/chat/${request._id}`);
                  }}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with Client
                </Button>

                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAccept}
                  disabled={isProcessing || !fee || parseFloat(fee) <= 0}
                >
                  {isProcessing && actionType === 'accept' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Accept
                    </>
                  )}
                </Button>
              </>
            )}

            {/* For paid bookings - show mark as done button */}
            {request.status === 'paid' && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/handyman/chat/${request._id}`);
                  }}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with Client
                </Button>

                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={async () => {
                    try {
                      const response = await BookingsAPI.updateBookingStatusPublic(
                        request._id,
                        'done',
                        undefined,
                        user?.id
                      );

                      if (response.success) {
                        toast({
                          title: "Work Marked as Done",
                          description: "You have marked this job as completed. Waiting for client confirmation.",
                        });
                        
                        if (onStatusChange) {
                          onStatusChange();
                        }
                        
                        onOpenChange(false);
                      } else {
                        toast({
                          title: "Error",
                          description: response.message || "Failed to mark work as done.",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      console.error('Error marking work as done:', error);
                      toast({
                        title: "Error",
                        description: "An error occurred while marking work as done.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Mark Work as Done
                </Button>
              </>
            )}

            {/* For other statuses - show chat button only */}
            {!['pending', 'paid'].includes(request.status) && (
              <div className="flex justify-center w-full">
                <Button
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/handyman/chat/${request._id}`);
                  }}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with Client
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Close
            </Button>
          </div>
            </>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
