
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, CheckCircle } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-2xl">{request.serviceName}</h3>
            <p className="text-sm text-gray-500">Request ID: {request._id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Service Category</label>
                <p className="text-gray-900 text-lg">{request.serviceName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <p className="text-gray-900 text-lg">{request.clientName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900 text-lg">{request.location.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Scheduled Time</label>
                <p className="text-gray-900 text-lg">{formatDateTime(request.scheduledTime)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Requested At</label>
                <p className="text-gray-900 text-lg">{formatDateTime(request.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 text-lg whitespace-pre-wrap">{request.description}</p>
              </div>
              {request.fee && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Fee</label>
                  <p className="text-gray-900 text-lg font-semibold text-green-600">${request.fee}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-3">Service Information</label>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                  <p className="text-gray-600">{request.description}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Location Details</h4>
                  <p className="text-blue-800">{request.location.address}</p>
                  {request.location.coordinates && (
                    <p className="text-blue-600 text-sm mt-1">
                      Coordinates: {request.location.coordinates.lat}, {request.location.coordinates.lng}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Input Section - Only show for pending bookings */}
          {request.status === 'pending' && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Label htmlFor="fee" className="text-sm font-medium text-yellow-800 mb-2 block">
                Set Your Service Fee (Required to accept booking)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-yellow-800 text-lg font-semibold">$</span>
                <Input
                  id="fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="Enter your service fee"
                  className="flex-1"
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                This fee will be visible to the client when you accept the booking.
              </p>
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="space-y-4 pt-4 border-t">
            {/* For pending bookings - show accept/reject buttons */}
            {request.status === 'pending' && (
              <div className="flex justify-between gap-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={isProcessing || request.status !== 'pending'}
                >
                  {isProcessing && actionType === 'reject' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Rejecting...
                    </>
                  ) : (
                    'Reject'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => navigate(`/handyman/chat/${request._id}`)}
                  disabled={isProcessing}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Client
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAccept}
                  disabled={isProcessing || request.status !== 'pending' || !fee || parseFloat(fee) <= 0}
                >
                  {isProcessing && actionType === 'accept' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Accepting...
                    </>
                  ) : (
                    'Accept'
                  )}
                </Button>
              </div>
            )}

            {/* For paid bookings - show mark as done button */}
            {request.status === 'paid' && (
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => navigate(`/handyman/chat/${request._id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Client
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
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
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Work as Done
                </Button>
              </div>
            )}

            {/* For other statuses - show chat button only */}
            {!['pending', 'paid'].includes(request.status) && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate(`/handyman/chat/${request._id}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Client
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
