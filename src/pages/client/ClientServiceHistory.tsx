
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientServiceHistory = () => {
  const services = [
    {
      id: 1,
      name: "Plumbing Repair",
      handyman: "Kamal Perera",
      date: "January 10, 2023",
      status: "Completed",
      price: "$125.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Electrical Installation",
      handyman: "Nimal Gunasinghe",
      date: "December 15, 2022",
      status: "Completed",
      price: "$210.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      id: 3,
      name: "Furniture Assembly",
      handyman: "Udayanga Perera",
      date: "November 3, 2022",
      status: "Canceled",
      price: "$90.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/76.jpg"
    },
    {
      id: 4,
      name: "Painting Service",
      handyman: "Kalum Sirimal",
      date: "August 24, 2022",
      status: "Completed",
      price: "$450.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/41.jpg"
    }
  ];

  return (
    <ClientDashboardLayout title="Service History">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {services.map(service => (
            <div key={service.id} className="flex items-start justify-between border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={service.handymanPhoto} 
                    alt={service.handyman} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{service.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">by {service.handyman}</p>
                  <p className="text-gray-500 text-sm mt-1">Date: {service.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : service.status === 'Canceled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {service.status}
                </span>
                <p className="font-semibold mt-2">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientServiceHistory;
