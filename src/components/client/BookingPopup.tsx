
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Clock, MapPin, User, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingPopupProps {
  booking: {
    _id: string;
    serviceId: any; // Service object from populate
    providerId: string;
    clientId: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'done';
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
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingPopup = ({ booking, open, onOpenChange }: BookingPopupProps) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate(`/client/chat/${booking._id}`, { state: { booking } });
    onOpenChange(false);
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
      case 'confirmed':
        return { label: 'CONFIRMED', className: 'bg-green-100 text-green-700' };
      case 'cancelled':
        return { label: 'CANCELLED', className: 'bg-red-100 text-red-700' };
      case 'done':
        return { label: 'COMPLETED', className: 'bg-gray-100 text-gray-700' };
      default:
        return { label: status.toUpperCase(), className: 'bg-gray-100 text-gray-700' };
    }
  };

  const statusInfo = getStatusInfo(booking.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {/* Service Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              {booking.serviceCategory || booking.serviceId?.name || 'Service'}
            </h3>
            <p className="text-gray-600 text-sm">{booking.description}</p>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-500">{date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-gray-500">{time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-500">{booking.location.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Provider</p>
                <p className="text-sm text-gray-500">{booking.providerName || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Status and Fee */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            </div>
            
            {booking.fee && (
              <div>
                <p className="text-sm font-medium">Fee</p>
                <p className="text-lg font-semibold text-green-600">${booking.fee}</p>
              </div>
            )}
          </div>

          {/* Booking ID */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 text-sm font-medium">ID</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Booking ID</p>
                <p className="text-lg font-mono font-semibold text-blue-700">
                  {booking._id}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Button - Only show for non-completed bookings */}
          {booking.status !== 'done' && (
            <div className="flex justify-end">
              <Button onClick={handleChat} className="bg-green-600 hover:bg-green-500">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Provider
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingPopup;
