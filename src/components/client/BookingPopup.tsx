
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingPopupProps {
  booking: {
    id: number;
    service: string;
    handyman: string;
    date: string;
    time: string;
    status: string;
    price: string;
    description: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingPopup = ({ booking, open, onOpenChange }: BookingPopupProps) => {
  const navigate = useNavigate();

  const handleChat = () => {
    navigate(`/client/chat/${booking.id}`, { state: { booking } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <h3 className="font-semibold">{booking.service}</h3>
              <p className="text-sm text-gray-500">{booking.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Handyman</p>
              <p className="text-sm text-gray-500">{booking.handyman}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-gray-500">{booking.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-gray-500">{booking.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Price</p>
              <p className="text-sm text-gray-500">{booking.price}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-gray-500 capitalize">{booking.status}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleChat} className="bg-green-600 hover:bg-green-500">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with Handyman
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingPopup;
