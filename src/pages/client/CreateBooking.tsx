import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Wrench, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { BookingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CreateBookingFormData {
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  scheduledTime: string;
  scheduledDate: string;
  attachments?: File[];
}

const CreateBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  
  const { service, professional, serviceId, providerId } = location.state || {};
  
  const [formData, setFormData] = useState<CreateBookingFormData>({
    description: "",
    location: {
      address: "",
    },
    scheduledTime: "",
    scheduledDate: "",
    attachments: [],
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  // Redirect if no service or professional data
  if (!service || !professional) {
    navigate('/client/dashboard');
    return null;
  }

  // Check if user is authenticated
  if (!user || !user.id) {
    console.error('User not authenticated');
    toast({
      title: "Authentication Error",
      description: "Please log in to create a booking.",
      variant: "destructive",
    });
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Get the Clerk session token
      const token = await getToken();
      
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const requestBody = {
        description: formData.description,
        location: formData.location,
        providerId,
        serviceId,
        scheduledTime: scheduledDateTime.toISOString(),
        status: "pending"
      };
      
      // Create a custom API instance with the Clerk token
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'client',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      // Generate a simple booking ID (in production, this would come from the backend)
      const generatedBookingId = `BK${Date.now().toString().slice(-6)}`;
      setBookingId(generatedBookingId);
      
      setShowReviewDialog(false);
      setShowSuccessDialog(true);
      
      toast({
        title: "Booking Created Successfully!",
        description: "Your service request has been submitted.",
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.description.trim() !== "" && 
           formData.location.address.trim() !== "" && 
           formData.scheduledDate !== "" && 
           formData.scheduledTime !== "";
  };

  return (
    <ClientDashboardLayout title="Create Booking" subtitle="Request service from your selected professional">
      <div className="space-y-6">
        {/* Service and Professional Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl">
                  <Wrench className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                  <p className="text-gray-600">Service Category</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">{professional.name}</span>
                </div>
                <p className="text-sm text-gray-600">{professional.title}</p>
                <div className="flex items-center mt-1">
                  {"★".repeat(Math.floor(professional.rating))}
                  <span className="text-sm text-gray-600 ml-1">
                    {professional.rating} ({professional.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Service Request Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Job Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the job or service you need in detail..."
                className="mt-1 min-h-[100px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you need done. Include any special requirements or preferences.
              </p>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Service Location *
              </Label>
              <div className="mt-1 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="Enter the exact address where service is needed"
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Provide the complete address where the service provider should come.
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Preferred Date *
                </Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Preferred Time *
                </Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <Label htmlFor="attachments" className="text-sm font-medium text-gray-700">
                Attachments (Optional)
              </Label>
              <div className="mt-1">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload photos, documents, or any relevant files to help describe your request.
                </p>
              </div>
              
              {/* File List */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Professionals</span>
          </Button>
          
          <Button
            onClick={() => setShowReviewDialog(true)}
            disabled={!isFormValid() || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {isSubmitting ? "Creating..." : "Review & Submit"}
          </Button>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Your Booking</DialogTitle>
            <DialogDescription>
              Please review the details below before submitting your service request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Service</Label>
                <p className="text-gray-900">{service.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Professional</Label>
                <p className="text-gray-900">{professional.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <p className="text-gray-900">
                  {new Date(formData.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <p className="text-gray-900">{formData.scheduledTime}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="text-gray-900">{formData.location.address}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-gray-900">{formData.description}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
              >
                Edit Details
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Creating..." : "Confirm & Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-green-800">
              Booking Created Successfully! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              Your service request has been submitted and is now pending confirmation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <span className="font-medium">Booking ID:</span> {bookingId}
              </p>
              <p className="text-sm text-green-700 mt-1">
                <span className="font-medium">Status:</span> Pending
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              The service provider will review your request and get back to you soon. 
              You can track your booking status in your dashboard.
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate('/client/dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/client/upcoming-bookings')}
                variant="outline"
                className="flex-1"
              >
                View Bookings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ClientDashboardLayout>
  );
};

export default CreateBooking;
