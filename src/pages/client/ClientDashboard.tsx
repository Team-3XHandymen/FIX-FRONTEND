import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import BookingPopup from "@/components/client/BookingPopup";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useUser } from '@clerk/clerk-react';
import { useServices, useMyBookings } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";
import { ClientAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { isApiError } from "@/lib/utils";

// Helper function to get status display text
const getStatusDisplayText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'PENDING';
    case 'accepted':
      return 'ACCEPTED';
    case 'rejected':
      return 'REJECTED';
    case 'paid':
      return 'PAID';
    case 'done':
      return 'WORK DONE';
    case 'completed':
      return 'COMPLETED';
    default:
      return status.toUpperCase();
  }
};

// Helper function to get status badge styling
const getStatusBadgeStyle = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'paid':
      return 'bg-purple-100 text-purple-700';
    case 'done':
      return 'bg-orange-100 text-orange-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Helper function to get service icons based on service name
const getServiceIcon = (serviceName: string): string => {
  const name = serviceName.toLowerCase();

  // Enhanced icons with better visual appeal
  if (name.includes('electrical') || name.includes('electric')) return '⚡';
  if (name.includes('plumbing') || name.includes('pipe')) return '🔧';
  if (name.includes('carpentry') || name.includes('wood')) return '🪚';
  if (name.includes('painting') || name.includes('paint')) return '🎨';
  if (name.includes('cleaning') || name.includes('clean')) return '✨';
  if (name.includes('gardening') || name.includes('garden')) return '🌱';
  if (name.includes('roofing') || name.includes('roof')) return '🏠';
  if (name.includes('appliance') || name.includes('repair')) return '🔨';
  if (name.includes('pest') || name.includes('control')) return '🛡️';
  if (name.includes('window')) return '🪟';
  if (name.includes('home') || name.includes('house')) return '🏡';
  if (name.includes('renovation') || name.includes('remodel')) return '🏗️';
  if (name.includes('landscaping')) return '🌿';
  if (name.includes('security') || name.includes('lock')) return '🔒';
  if (name.includes('heating') || name.includes('hvac')) return '🔥';
  if (name.includes('cooling') || name.includes('ac')) return '❄️';

  return '🔧'; // Default icon
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clientData, setClientData] = useState<any>(null);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch services from backend
  const { data: servicesResponse, isLoading, error } = useServices();

  // Fetch current user's bookings
  const { data: bookingsResponse, isLoading: isLoadingBookings, error: bookingsError, refetch: refetchBookings } = useMyBookings(user);

  // Callback to refresh all components when booking status changes
  const handleBookingStatusChange = useCallback(() => {
    console.log('Client dashboard - Status change detected, refreshing...');
    setRefreshKey(prev => prev + 1);
    refetchBookings();
  }, [refetchBookings]);

  // Check if we need to refresh bookings (e.g., coming from booking creation)
  useEffect(() => {
    if (location.state?.refreshBookings && user) {
      console.log('Refreshing bookings due to navigation state');
      refetchBookings();
      // Clear the navigation state to prevent infinite refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refreshBookings, user, refetchBookings, navigate, location.pathname]);

  // Set up polling to refresh bookings every 30 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      console.log('Client dashboard - Auto-refreshing bookings...');
      refetchBookings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, refetchBookings]);

  // Debug logging
  console.log('ClientDashboard - User state:', { 
    user: user ? { id: user.id, username: user.username } : null,
    isLoadingBookings,
    bookingsError,
    bookingsData: bookingsResponse?.data
  });

  // Debug: Log the actual booking data structure
  if (bookingsResponse?.data) {
    console.log('Raw booking data structure:', bookingsResponse.data.map((booking: any) => ({
      id: booking._id,
      serviceName: booking.serviceName,
      serviceCategory: booking.serviceCategory,
      providerName: booking.providerName,
      serviceId: booking.serviceId,
      status: booking.status
    })));
  }

  // Load client data from database when user logs in
  useEffect(() => {
    const loadClientData = async () => {
      if (!user) return;

      try {
        setIsLoadingClient(true);
        
        const existingClient = await ClientAPI.getClientByUserId(user.id);
        setClientData(existingClient.data);
        
      } catch (error: unknown) {
        console.error('Error loading client data:', error);
        
        if (isApiError(error, 404)) {
          toast({
            title: "Profile not found",
            description: "Please contact support or try signing up again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoadingClient(false);
      }
    };

    loadClientData();
  }, [user, toast]);

  // Extract services from API response and sort alphabetically
  const services = useMemo(() => {
    if (!servicesResponse?.data) {
      return [];
    }
    const servicesArray = servicesResponse.data;
    return servicesArray.sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
  }, [servicesResponse]);

  // Process and filter bookings
  const processedBookings = useMemo(() => {
    if (!bookingsResponse?.data) {
      return [];
    }

    const bookings = bookingsResponse.data;
    
    // Don't filter out any bookings, show all of them
    return bookings
      .sort((a: any, b: any) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .map((booking: any) => ({
        ...booking,
        // Format date and time for display
        displayDate: new Date(booking.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayTime: new Date(booking.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        // Use the names stored directly in the booking
        serviceCategory: booking.serviceName || booking.serviceCategory || 'Unknown Service',
        providerName: booking.providerName || 'Unknown Provider',
        bookingId: booking._id
      }));
  }, [bookingsResponse]);

  // Categorize bookings by status
  const categorizedBookings = useMemo(() => {
    const categorized = {
      actionRequired: [] as any[], // Bookings that need client action
      viewOnly: [] as any[], // Bookings just for viewing
      cancelled: [] as any[]
    };

    console.log('Client Dashboard - Processing bookings:', processedBookings.map(b => ({ id: b._id, status: b.status })));

    processedBookings.forEach((booking: any) => {
      switch (booking.status) {
        case 'accepted':
        case 'done':
          categorized.actionRequired.push(booking);
          break;
        case 'pending':
        case 'paid':
        case 'completed':
        case 'rejected':
          categorized.viewOnly.push(booking);
          break;
        default:
          // Add any other statuses to view only
          categorized.viewOnly.push(booking);
          break;
      }
    });

    console.log('Client Dashboard - Categorized results:', {
      actionRequired: categorized.actionRequired.map(b => ({ id: b._id, status: b.status })),
      viewOnly: categorized.viewOnly.map(b => ({ id: b._id, status: b.status }))
    });

    return categorized;
  }, [processedBookings]);

  // Debug logging for categorized bookings
  console.log('Processed bookings count:', processedBookings.length);
  console.log('Categorized bookings:', {
    actionRequired: categorizedBookings.actionRequired.length,
    viewOnly: categorizedBookings.viewOnly.length,
    cancelled: categorizedBookings.cancelled.length
  });

  // Filter services based on search
  const filteredServices = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return services.filter((service: any) =>
      service.name.toLowerCase().includes(lowerSearch)
    );
  }, [services, search]);

  // Get popular services (top 4 by usage count)
  const popularServices = useMemo(() => {
    return services
      .sort((a: any, b: any) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 4)
      .map((service: any) => ({
        _id: service._id,
        id: service._id,
        name: service.name,
        icon: getServiceIcon(service.name),
        usageCount: service.usageCount || 0
      }));
  }, [services]);

  const messages = [{
    id: 1,
    sender: "Kamal Perera (Plumber)",
    message: "I'll be arriving in 10 minutes...",
    time: "10:30 AM"
  }];

  const handleServiceClick = (service: {
    _id: string;
    name: string;
    icon: string;
    usageCount?: number;
  }) => {
    navigate('/client/service-details', {
      state: {
        service
      }
    });
  };

  const handleChat = (booking: any) => {
    navigate(`/client/chat/${booking._id}`, { state: { booking } });
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsPopupOpen(true);
  };

  // Use database username if available, fallback to Clerk data
  const displayName = clientData?.username || user?.username || user?.firstName || 'Client';
  
  // Show loading state while client data is being fetched
  if (isLoadingClient) {
    return (
      <ClientDashboardLayout title="Loading..." subtitle="Please wait while we load your profile..." showHomeIcon={false} showHandymanButton={true}>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="text-lg text-gray-600">Loading your profile...</span>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  // Show error state if client data failed to load
  if (!clientData && !isLoadingClient) {
    return (
      <ClientDashboardLayout title="Profile Error" subtitle="Unable to load your profile" showHomeIcon={false} showHandymanButton={true}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load your profile</p>
            <p className="text-gray-600">Please refresh the page or try again later.</p>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return <ClientDashboardLayout title={`Welcome back, ${displayName}`} subtitle="What can we help you with today?" showHomeIcon={false} showHandymanButton={true}>
        {/* Profile Completion Segment */}
        {clientData && (() => {
          // Check if profile is incomplete (missing required fields)
          const profileCompletion = [
            clientData.name ? 1 : 0,
            clientData.mobileNumber ? 1 : 0,
            clientData.address?.street ? 1 : 0
          ].reduce((sum, field) => sum + field, 0);
          
          const completionPercentage = Math.round((profileCompletion / 3) * 100);
          
          // Only show the segment if profile is incomplete
          if (completionPercentage === 100) {
            return null; // Don't show the segment when profile is complete
          }
          
          return (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Let's complete your profile together! 
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Please provide your address and mobile number to begin placing bookings easily.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {completionPercentage}%
                  </div>
                  <div className="text-xs text-blue-500">Complete</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-blue-600 mb-2">
                  <span>Profile Progress</span>
                  <span>Step {profileCompletion + 1} of 3</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Profile Fields Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className={`flex items-center p-3 rounded-lg ${clientData.name ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${clientData.name ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className={`text-sm font-medium ${clientData.name ? 'text-green-800' : 'text-orange-800'}`}>
                      Full Name
                    </div>
                    <div className={`text-xs ${clientData.name ? 'text-green-600' : 'text-orange-600'}`}>
                      {clientData.name ? '✓ Completed' : 'Missing'}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center p-3 rounded-lg ${clientData.mobileNumber ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${clientData.mobileNumber ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className={`text-sm font-medium ${clientData.mobileNumber ? 'text-green-800' : 'text-orange-800'}`}>
                      Mobile Number
                    </div>
                    <div className={`text-xs ${clientData.mobileNumber ? 'text-green-600' : 'text-orange-600'}`}>
                      {clientData.mobileNumber ? '✓ Completed' : 'Missing'}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center p-3 rounded-lg ${clientData.address?.street ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'}`}>
                  <div className={`w-3 h-3 rounded-full mr-3 ${clientData.address?.street ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <div className={`text-sm font-medium ${clientData.address?.street ? 'text-green-800' : 'text-orange-800'}`}>
                      Address
                    </div>
                    <div className={`text-xs ${clientData.address?.street ? 'text-green-600' : 'text-orange-600'}`}>
                      {clientData.address?.street ? '✓ Completed' : 'Missing'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-600">
                  <span className="font-medium">💡 Tip:</span> Complete profiles get faster service and better handyman matching!
                </div>
                <Button 
                  onClick={() => navigate('/client/profile')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Search Bar */}
        <div className="relative mb-8">
         <Input
           type="text"
           value={search}
           onChange={e => setSearch(e.target.value)}
           placeholder="Search Services"
           className="pl-10"
         />
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
       </div>

      {/* Search Results */}
      {search.trim() && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading services...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load services</p>
              <p className="text-sm text-gray-500">
                {error.message || 'Please check your connection and try again'}
              </p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.map((service: any) => (
                <div
                  key={service._id || service.serviceId}
                  className="flex flex-col items-center gap-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-4 border border-gray-100"
                  onClick={() => navigate("/client/service-details", { state: { service } })}
                >
                  {/* Service Image Container */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shadow-inner">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-12 h-12 object-cover rounded-full shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Icon */}
                    <span className={`text-3xl ${service.imageUrl ? 'hidden' : ''}`}>
                      {getServiceIcon(service.name)}
                    </span>
                  </div>
                  
                  {/* Service Name */}
                  <span className="font-bold text-gray-800 text-center text-sm leading-tight">
                    {service.name}
                  </span>

                  {/* Usage Count */}
                  {service.usageCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {service.usageCount} times used
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No services found matching "{search}"</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularServices.map(service => (
                         <div 
               key={service.id} 
               className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow" 
               onClick={() => handleServiceClick(service)}
             >
              <div className="text-3xl mb-2">{service.icon}</div>
              <div className="text-sm font-medium text-center">{service.name}</div>
              {service.usageCount > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {service.usageCount} times used
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8 space-y-4">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6" onClick={() => navigate("/client/service-catalog")}>
          See All Services
        </Button>
        
      </div>
      
             {/* Your Bookings Section */}
       <div className="mb-8">
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-semibold">Your Bookings</h2>
           <Button
             variant="outline"
             size="sm"
             onClick={() => {
               console.log('Manual refresh triggered');
               refetchBookings();
             }}
             disabled={isLoadingBookings}
             className="flex items-center gap-2"
           >
             {isLoadingBookings ? (
               <Loader2 className="h-4 w-4 animate-spin" />
             ) : (
               <Search className="h-4 w-4" />
             )}
             Refresh
           </Button>
         </div>
        
        {!user ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">Please sign in to view your bookings</p>
          </div>
        ) : isLoadingBookings ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading your bookings...</span>
            </div>
          </div>
        ) : bookingsError ? (
          <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 mb-2">Failed to load bookings</p>
            <p className="text-sm text-red-500 mb-3">{bookingsError.message}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        ) : processedBookings.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No active bookings found</p>
            <p className="text-sm text-gray-400">Start by booking a service from our catalog</p>
            <Button 
              onClick={() => navigate("/client/service-catalog")}
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Book a Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Action Required Bookings */}
            {categorizedBookings.actionRequired.length > 0 && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Action Required</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                    <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span className="text-sm font-medium text-orange-700">{categorizedBookings.actionRequired.length} booking(s) need your attention</span>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {categorizedBookings.actionRequired.map(booking => (
                    <div key={booking._id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <h4 className="font-semibold text-gray-900">{booking.serviceCategory || 'Service'}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                                {getStatusDisplayText(booking.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Provider:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.providerName || 'Unknown Provider'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Scheduled:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.displayDate}, {booking.displayTime}</span>
                              </div>
                              {booking.fee && (
                                <div>
                                  <span className="text-gray-500">Fee:</span>
                                  <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            ID: {booking._id}
                          </div>
                          <div className="flex items-center gap-3">
                            {booking.status !== 'completed' && booking.status !== 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChat(booking);
                                }} 
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <MessageSquare className="mr-1" size={16} /> Chat
                              </Button>
                            )}
                            <Button
                              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                              onClick={() => handleBookingClick(booking)}
                            >
                              {booking.status === 'accepted' ? 'Confirm Payment' : 'Confirm Completion'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Jobs */}
            {categorizedBookings.viewOnly.length > 0 && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
                </div>
                
                <div className="grid gap-4">
                  {categorizedBookings.viewOnly.map(booking => (
                    <div key={booking._id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <h4 className="font-semibold text-gray-900">{booking.serviceCategory || 'Service'}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                                {getStatusDisplayText(booking.status)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Provider:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.providerName || 'Unknown Provider'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Scheduled:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.displayDate}, {booking.displayTime}</span>
                              </div>
                              {booking.fee && (
                                <div>
                                  <span className="text-gray-500">Fee:</span>
                                  <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            ID: {booking._id}
                          </div>
                          <div className="flex items-center gap-3">
                            {booking.status !== 'completed' && booking.status !== 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChat(booking);
                                }} 
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <MessageSquare className="mr-1" size={16} /> Chat
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => handleBookingClick(booking)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Bookings */}
            {categorizedBookings.cancelled.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Cancelled Bookings</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                    <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-sm font-medium text-red-700">{categorizedBookings.cancelled.length} cancelled booking(s)</span>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {categorizedBookings.cancelled.map(booking => (
                    <div key={booking._id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden opacity-75"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <h4 className="font-semibold text-gray-900">{booking.serviceCategory || 'Service'}</h4>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                CANCELLED
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Provider:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.providerName || 'Unknown Provider'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Scheduled:</span>
                                <span className="ml-2 font-medium text-gray-900">{booking.displayDate}, {booking.displayTime}</span>
                              </div>
                              {booking.fee && (
                                <div>
                                  <span className="text-gray-500">Fee:</span>
                                  <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            ID: {booking._id}
                          </div>
                          <Button
                            variant="outline"
                            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => handleBookingClick(booking)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
        <div className="space-y-3">
          {messages.map(message => <div key={message.id} className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                JS
              </div>
              <div>
                <h3 className="font-medium">{message.sender}</h3>
                <p className="text-gray-600 text-sm">{message.message}</p>
                <p className="text-gray-400 text-xs mt-1">{message.time}</p>
              </div>
            </div>)}
        </div>
      </div>
      
      {selectedBooking && (
        <BookingPopup
          booking={selectedBooking}
          open={isPopupOpen}
          onOpenChange={setIsPopupOpen}
          onStatusChange={handleBookingStatusChange}
        />
      )}
    </ClientDashboardLayout>;
};

export default ClientDashboard;
