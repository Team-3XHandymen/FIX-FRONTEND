
import { useState } from "react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample clients data
const clientsData = [
  {
    id: "1",
    name: "Miona Silva",
    email: "miona.silva@example.com",
    phone: "(555) 123-4567",
    address: "Homagama, Colombo",
    totalJobs: 3,
    status: "active",
    lastService: "2025-04-15",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    id: "2",
    name: "Dhammika Perera",
    email: "dhammika.perera@example.com",
    phone: "(555) 987-6543",
    address: "Kurudugahahethekma, Elpitiya",
    totalJobs: 2,
    status: "active",
    lastService: "2025-04-10",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "3",
    name: "Yohani Fernando",
    email: "yohani.fernando@example.com",
    phone: "(555) 456-7890",
    address: "meepe, Gampaha",
    totalJobs: 5,
    status: "inactive",
    lastService: "2025-03-22",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "4",
    name: "Tharindu Dediyagala",
    email: "tharindu.dediyagala@example.com",
    phone: "(555) 234-5678",
    address: "Kandy, Sri Lanka",
    totalJobs: 1,
    status: "active",
    lastService: "2025-04-19",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg"
  },
  {
    id: "5",
    name: "Rashmika Jayasinghe",
    email: "rashmika.jayasinghe@example.com",
    phone: "(555) 876-5432",
    address: "Galle, Sri Lanka",
    totalJobs: 4,
    status: "active",
    lastService: "2025-04-05",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg"
  }
];

const HandymanClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  
  const filteredClients = clientsData.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <HandymanDashboardLayout title="Clients">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filterStatus === "all" ? "bg-gray-200" : "bg-gray-100"}`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filterStatus === "active" ? "bg-green-200 text-green-800" : "bg-gray-100"}`}
              onClick={() => setFilterStatus("active")}
            >
              Active
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filterStatus === "inactive" ? "bg-gray-200 text-gray-800" : "bg-gray-100"}`}
              onClick={() => setFilterStatus("inactive")}
            >
              Inactive
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No clients found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => (
                <Dialog key={client.id}>
                  <DialogTrigger asChild>
                    <div className="border rounded-lg p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                      <img 
                        src={client.avatar} 
                        alt={client.name} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-500">{client.totalJobs} jobs, Last: {client.lastService}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          client.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Client Details</DialogTitle>
                      <DialogDescription>
                        View and manage client information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={client.avatar} 
                          alt={client.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-lg">{client.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            client.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span>{client.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Address:</span>
                          <span>{client.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Jobs:</span>
                          <span>{client.totalJobs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Service:</span>
                          <span>{client.lastService}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                          Message Client
                        </button>
                        <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                          Schedule Job
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanClients;
