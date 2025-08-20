
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Booking {
  _id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
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
}

const RequestDetailsDialog = ({ open, onOpenChange, request }: RequestDetailsProps) => {
  const navigate = useNavigate();

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

          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => navigate(`/handyman/chat/${request._id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Client
            </Button>
            <Button
              className="flex-1"
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
