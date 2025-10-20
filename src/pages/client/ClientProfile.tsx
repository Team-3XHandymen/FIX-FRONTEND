
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, User, Phone, Mail, MapPin, Star, Calendar } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useUser } from '@clerk/clerk-react';
import { ClientAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LocationSelector } from "@/components/ui/location-selector";

interface ClientData {
  _id: string;
  userId: string;
  username: string;
  email: string;
  name?: string;
  mobileNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  preferences?: {
    preferredServices?: string[];
    preferredTimes?: string[];
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

const ClientProfile = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ClientData>>({});
  const [locationData, setLocationData] = useState<{
    location: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);
  const [locationInputValue, setLocationInputValue] = useState<string>('');

  // Load client data from database
  useEffect(() => {
    const loadClientData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await ClientAPI.getClientByUserId(user.id);
        setClientData(response.data);
        setEditData(response.data);
        
        // Initialize location data
        if (response.data.location) {
          setLocationData({
            location: response.data.location,
            coordinates: response.data.coordinates
          });
          setLocationInputValue(response.data.location);
        }
      } catch (error) {
        console.error('Error loading client data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [user, toast]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(clientData || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(clientData || {});
  };

  const handleSave = async () => {
    if (!user || !clientData) return;

    try {
      const response = await ClientAPI.updateClientProfile(user.id, editData);
      setClientData(response.data);
      setIsEditing(false);
      
      // Check if profile is now complete
      const updatedData = response.data;
      const profileCompletion = [
        updatedData.name ? 1 : 0,
        updatedData.mobileNumber ? 1 : 0,
        updatedData.location ? 1 : 0
      ].reduce((sum, field) => sum + field, 0);
      
      const completionPercentage = Math.round((profileCompletion / 3) * 100);
      
      if (completionPercentage === 100) {
        toast({
          title: "🎉 Profile Complete!",
          description: "Congratulations! Your profile is now 100% complete. You can now place bookings easily!",
        });
        
        // Redirect to dashboard after a short delay to show the completion
        setTimeout(() => {
          window.location.href = '/client/dashboard';
        }, 2000);
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleLocationChange = (locationData: any) => {
    setLocationData(locationData);
    setEditData(prev => ({
      ...prev,
      location: locationData.address || locationData.city,
      coordinates: {
        lat: locationData.lat,
        lng: locationData.lng,
      },
    }));
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInputValue(value);
    // Only react to clearing: if input is empty, mark location as empty and clear coordinates
    if (!value.trim()) {
      setLocationData(null);
      setEditData(prev => ({
        ...prev,
        location: '',
        coordinates: undefined,
      }));
    }
  };

  if (isLoading) {
    return (
      <ClientDashboardLayout title="Profile" subtitle="Loading your profile...">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (!clientData) {
    return (
      <ClientDashboardLayout title="Profile" subtitle="Profile not found">
        <div className="text-center py-20">
          <p className="text-lg text-red-600 mb-4">Failed to load profile</p>
          <p className="text-gray-600">Please refresh the page or try again later.</p>
        </div>
      </ClientDashboardLayout>
    );
  }

  const profileCompletion = [
    clientData.name ? 1 : 0,
    clientData.mobileNumber ? 1 : 0,
    clientData.location ? 1 : 0
  ].reduce((sum, field) => sum + field, 0);

  const completionPercentage = Math.round((profileCompletion / 3) * 100);

  return (
    <ClientDashboardLayout title="Profile" subtitle="Manage your account information">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {clientData.name ? clientData.name.charAt(0).toUpperCase() : clientData.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {clientData.name || clientData.username}
                  </h2>
                  <p className="text-gray-600">@{clientData.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {(() => {
                        const currentCompletion = [
                          editData.name ? 1 : 0,
                          editData.mobileNumber ? 1 : 0,
                          editData.location ? 1 : 0
                        ].reduce((sum, field) => sum + field, 0);
                        return Math.round((currentCompletion / 3) * 100);
                      })()}% Complete
                    </Badge>
                    {clientData.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{clientData.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Real-time Progress Bar */}
        {isEditing && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800">Live Progress</span>
                <span className="text-xs text-orange-600">
                  {(() => {
                    const currentCompletion = [
                      editData.name ? 1 : 0,
                      editData.mobileNumber ? 1 : 0,
                      editData.location ? 1 : 0
                    ].reduce((sum, field) => sum + field, 0);
                    return `${currentCompletion}/3 fields completed`;
                  })()}
                </span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(() => {
                      const currentCompletion = [
                        editData.name ? 1 : 0,
                        editData.mobileNumber ? 1 : 0,
                        editData.location ? 1 : 0
                      ].reduce((sum, field) => sum + field, 0);
                      return Math.round((currentCompletion / 3) * 100);
                    })()}%` 
                  }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-orange-600">
                {(() => {
                  const currentCompletion = [
                    editData.name ? 1 : 0,
                    editData.mobileNumber ? 1 : 0,
                    editData.location ? 1 : 0
                  ].reduce((sum, field) => sum + field, 0);
                  
                  if (currentCompletion === 3) {
                    return "🎉 All fields completed! Click Save to complete your profile.";
                  } else if (currentCompletion === 2) {
                    return "Almost there! Just one more field to complete your profile.";
                  } else if (currentCompletion === 1) {
                    return "Good start! Keep going to complete your profile.";
                  } else {
                    return "Let's get started! Fill in your details to complete your profile.";
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {clientData.name || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Username</Label>
                <p className="mt-1 text-gray-900">{clientData.username}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <p className="mt-1 text-gray-900">{clientData.email}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Mobile Number</Label>
                {isEditing ? (
                  <Input
                    value={editData.mobileNumber || ''}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="Enter your mobile number"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {clientData.mobileNumber || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <LocationSelector
                  value={locationInputValue}
                  onChange={handleLocationChange}
                  onInputChange={handleLocationInputChange}
                  label="Select Your Location"
                  placeholder="Search for your city or area"
                  required={true}
                />
              ) : (
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Current Location</Label>
                    <p className="mt-1 text-gray-900">
                      {clientData.location || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  </div>
                  {clientData.coordinates && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Coordinates</Label>
                      <p className="mt-1 text-sm text-gray-600">
                        {clientData.coordinates.lat.toFixed(6)}, {clientData.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                <p className="mt-1 text-gray-900">
                  {new Date(clientData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                <p className="mt-1 text-gray-900">
                  {new Date(clientData.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Profile Status</Label>
                <div className="mt-1">
                  <Badge 
                    variant={completionPercentage === 100 ? "default" : "secondary"}
                    className={completionPercentage === 100 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                  >
                    {completionPercentage === 100 ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        {clientData.preferences && Object.keys(clientData.preferences).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clientData.preferences.preferredServices && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Preferred Services</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {clientData.preferences.preferredServices.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {clientData.preferences.preferredTimes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Preferred Times</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {clientData.preferences.preferredTimes.map((time, index) => (
                        <Badge key={index} variant="outline">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientProfile;
