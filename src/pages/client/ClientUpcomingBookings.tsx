
import { Button } from "@/components/ui/button";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientUpcomingBookings = () => {
  const bookings = [
    {
      id: 1,
      service: "Kitchen Sink Repair",
      handyman: "Kamal Perera",
      date: "January 28, 2023",
      time: "2:00 PM - 3:00 PM",
      price: "$95.00",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      service: "Furniture Assembly",
      handyman: "Udayanga Perera",
      date: "February 2, 2023",
      time: "10:00 AM - 12:00 PM",
      price: "$180.00",
      photo: "https://randomuser.me/api/portraits/women/67.jpg",
    }
  ];

  return (
    <ClientDashboardLayout title="Upcoming Bookings">
      <div className="space-y-6">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={booking.photo} 
                    alt={booking.handyman} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{booking.handyman}</h3>
                  <p className="text-gray-600">{booking.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{booking.price}</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center text-gray-600 mb-4 md:mb-0">
                <span className="inline-block bg-gray-100 px-3 py-1 rounded text-sm">
                  📅 {booking.date} • {booking.time}
                </span>
              </div>
              <div className="space-x-2">
                <Button variant="outline" className="bg-white">
                  Cancel Booking
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Contact Handyman
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientUpcomingBookings;
