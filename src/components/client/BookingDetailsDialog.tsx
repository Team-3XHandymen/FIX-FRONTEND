import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDetailsDialog = ({ open, onOpenChange }: BookingDetailsDialogProps) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    location: "",
    message: ""
  });

  const handleContinue = () => {
    setShowSummary(true);
  };

  const handleBack = () => {
    setShowSummary(false);
  };

  const handleSendRequest = () => {
    setShowSuccess(true);
    onOpenChange(false);
  };

  const handleReturnHome = () => {
    setShowSuccess(false);
    navigate("/client/dashboard");
  };

  if (showSummary) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Booking Summary
              </button>
            </DialogHeader>

            <div className="space-y-6">
              <section>
                <h3 className="font-semibold mb-4">Service Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">Plumbing Service</div>
                  <div className="text-gray-600 text-sm mt-1">Leaking pipe under kitchen sink</div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold mb-4">Professional Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">David Miller</div>
                  <div className="text-gray-600 text-sm mt-1">Master Plumber, Emergency Services</div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold mb-4">Appointment Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div>January 24, 2024</div>
                    </div>
                    <div className="ml-8">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div>10:00 AM</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div>123 Main Street, Apt 4B, New York, NY 10001</div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold mb-4">Message to Professional</h3>
                <Textarea 
                  placeholder="Add any additional details or special requests for the professional..."
                  className="min-h-[100px]"
                />
              </section>

              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSendRequest}>
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showSuccess}>
          <AlertDialogContent className="max-w-md">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Request Sent Successfully!</h3>
              <p className="text-gray-600">
                Your booking request has been sent to David Miller.<br />
                You will receive a confirmation once they accept your request.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 my-4">
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="font-semibold">#BK12345</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Monday, Jan 24, 2024 at 10:00 AM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>123 Main Street, Apt 4B</span>
                </div>
              </div>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600" 
                onClick={handleReturnHome}
              >
                Return to Home
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <button 
            onClick={() => onOpenChange(false)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Booking Details
          </button>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Date & Time</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input 
                  type="date" 
                  placeholder="mm/dd/yyyy"
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input 
                  type="time"
                  placeholder="Select time"
                  className="pl-10"
                />
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Service Location</h3>
            <div className="relative">
              <Input 
                type="text"
                placeholder="Enter your complete address"
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Describe Your Problem</h3>
            <Textarea 
              placeholder="Please describe the issue you're facing..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Upload Photos (Optional)</h3>
            <div className={cn(
              "border-2 border-dashed rounded-lg p-6",
              "text-center cursor-pointer hover:border-gray-400 transition-colors"
            )}>
              <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Drag and drop photos here or click to upload</p>
              <p className="text-xs text-green-500 mt-1">Browse Files</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleContinue}>
              Continue to Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
