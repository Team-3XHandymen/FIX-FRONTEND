import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wrench, User, FileText, MapPin, Calendar, Clock, Paperclip, CheckCircle } from 'lucide-react';
import ClientDashboardLayout from '@/components/client/ClientDashboardLayout';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

interface Professional {
  _id: string;
  userId: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  experience: number;
  specializations: string[];
}

interface FormData {
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  scheduledDate: string;
  scheduledTime: string;
  attachments: File[];
}

const CreateBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  
  const { service, professional, serviceId, providerId } = location.state || {};
  
  const [formData, setFormData] = useState<FormData>({
    description: '',
    location: { address: '' },
    scheduledDate: '',
    scheduledTime: '',
    attachments: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  // Redirect if no service or professional data
  useEffect(() => {
    if (!service || !professional || !serviceId || !providerId) {
      toast({
        title: "Missing Information",
        description: "Please select a service and professional first.",
        variant: "destructive",
      });
      navigate('/client/services');
    }
  }, [service, professional, serviceId, providerId, navigate, toast]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    if (field === 'location') {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, address: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...filesArray]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowReviewDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!getToken || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      
      // Combine date and time into a single scheduledTime
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      const requestBody = {
        serviceId,
        providerId,
        description: formData.description,
        location: formData.location,
        scheduledTime: scheduledDateTime.toISOString(), // Send as ISO string
        attachments: formData.attachments
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id, // Use the actual client's user ID
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

  if (!service || !professional) {
    return <div>Loading...</div>;
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Service Location *
                </Label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter the address where you need the service..."
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate" className="text-sm font-medium text-gray-700">
                    Preferred Date *
                  </Label>
                  <div className="mt-1 relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="scheduledTime" className="text-sm font-medium text-gray-700">
                    Preferred Time *
                  </Label>
                  <div className="mt-1 relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <Label htmlFor="attachments" className="text-sm font-medium text-gray-700">
                  Attachments (Optional)
                </Label>
                <div className="mt-1">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload images, documents, or other files related to your service request
                  </p>
                </div>
                
                {/* Display selected files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  Review & Submit Booking
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <span>Review Your Booking</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Service:</span>
                  <span className="ml-2 font-medium">{service.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Professional:</span>
                  <span className="ml-2 font-medium">{professional.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(formData.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-2 font-medium">{formData.scheduledTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Request Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{formData.description}</p>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="mt-1 text-gray-900">{formData.location.address}</p>
                </div>
                {formData.attachments.length > 0 && (
                  <div>
                    <span className="text-gray-600">Attachments:</span>
                    <p className="mt-1 text-gray-900">{formData.attachments.length} file(s)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="flex-1"
              >
                Edit Booking
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Creating Booking...' : 'Confirm & Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span>Booking Created Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">Your booking has been submitted!</p>
              <p className="text-green-700 text-sm mt-1">Booking ID: {bookingId}</p>
            </div>
            
            <p className="text-gray-600">
              The professional will review your request and get back to you soon.
              You can track your booking status in your dashboard.
            </p>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/client/dashboard')}
                className="flex-1"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => navigate('/client/services')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Book Another Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ClientDashboardLayout>
  );
};

export default CreateBooking;
