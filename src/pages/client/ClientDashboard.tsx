import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Wrench, Loader2 } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import BookingPopup from "@/components/client/BookingPopup";
import { useState, useMemo } from "react";
import { useUser } from '@clerk/clerk-react';
import { useServices } from "@/hooks/use-api";
import { Input } from "@/components/ui/input";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[number] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch services from backend
  const { data: servicesResponse, isLoading, error } = useServices();

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

  const bookings = [{
    id: 1,
    service: "Plumbing Repair",
    handyman: "Kamal Perera",
    date: "Jan 23",
    time: "2:00 PM",
    status: "upcoming",
    price: "$125.00",
    description: "Fix leaking kitchen sink",
  }, {
    id: 2,
    service: "Electrical Maintenance",
    handyman: "Nimal Gunasinghe",
    date: "Jan 25",
    time: "10:00 AM",
    status: "pending",
    price: "$95.00",
    description: "Check and repair faulty wiring",
  }, {
    id: 3,
    service: "Painting",
    handyman: "Sarath Kumara",
    date: "Jan 18",
    time: "10:30 AM",
    status: "completed",
    price: "$350.00",
    description: "Paint living room walls",
  }];
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

  const handleChat = (booking: typeof bookings[number]) => {
    navigate(`/client/chat/${booking.id}`, { state: { booking } });
  };

  const categorized = {
    upcoming: bookings.filter(b => b.status === "upcoming"),
    pending: bookings.filter(b => b.status === "pending"),
    completed: bookings.filter(b => b.status === "completed")
  };

  return <ClientDashboardLayout title={`Welcome back, ${user?.firstName || 'Client'}`} subtitle="What can we help you with today?" showHomeIcon={false} showHandymanButton={true}>
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
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        {categorized.upcoming.length > 0 && <div className="space-y-4 mb-8">
            {categorized.upcoming.map(booking => (
              <div key={booking.id} 
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsPopupOpen(true);
                }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="text-blue-500 text-xl">🛠️</div>
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.service}</h3>
                    <p className="text-gray-500 text-sm">{booking.handyman} • {booking.date}, {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs ${booking.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : ''}`}>
                    UPCOMING
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleChat(booking)} className="bg-green-600 hover:bg-green-500 rounded-2xl">
                    <MessageSquare className="mr-1" size={16} /> Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>}
        {categorized.pending.length > 0 && <div className="space-y-4 mb-8">
            {categorized.pending.map(booking => <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="text-blue-500 text-xl">🛠️</div>
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.service}</h3>
                    <p className="text-gray-500 text-sm">{booking.handyman} • {booking.date}, {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                    PENDING
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleChat(booking)} className="bg-green-600 hover:bg-green-500 rounded-2xl">
                    <MessageSquare className="mr-1" size={16} /> Chat
                  </Button>
                </div>
              </div>)}
          </div>}
        {categorized.completed.length > 0 && <div className="space-y-4">
            {categorized.completed.map(booking => <div key={booking.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <div className="text-blue-500 text-xl">🛠️</div>
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.service}</h3>
                    <p className="text-gray-500 text-sm">{booking.handyman} • {booking.date}, {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    COMPLETED
                  </div>
                </div>
              </div>)}
          </div>}
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
        />
      )}
    </ClientDashboardLayout>;
};

export default ClientDashboard;

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
