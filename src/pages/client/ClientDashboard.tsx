import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Wrench } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import BookingPopup from "@/components/client/BookingPopup";
import { useState } from "react";
import { useUser } from '@clerk/clerk-react';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[number] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const popularServices = [{
    id: 1,
    name: "Plumbing",
    icon: "🔧"
  }, {
    id: 2,
    name: "Electrical",
    icon: "⚡"
  }, {
    id: 3,
    name: "Painting",
    icon: "🖌️"
  }, {
    id: 4,
    name: "Home Repair",
    icon: "🏠"
  }];

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
    name: string;
    icon: string;
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
      <div className="mb-8 relative">
        <div className="relative w-full md:w-96">
          <input type="text" placeholder="Search Services" className="w-full bg-white rounded-full py-2 px-6 pr-10 shadow-sm border border-gray-200" />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularServices.map(service => <div key={service.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleServiceClick({
          name: service.name,
          icon: service.icon
        })}>
              <div className="text-3xl mb-2">{service.icon}</div>
              <div className="text-sm font-medium">{service.name}</div>
            </div>)}
        </div>
      </div>
      
      <div className="mb-8 space-y-4">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6" onClick={() => navigate("/client/service-catalog")}>
          Book a Service
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
