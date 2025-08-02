
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

const ServiceCatalog = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  // Fetch services from backend
  const { data: servicesResponse, isLoading, error } = useServices();

  // Extract services from API response and sort alphabetically
  const services = useMemo(() => {
    console.log('Services Response:', servicesResponse); // Debug log
    if (!servicesResponse?.data) {
      console.log('No services data found'); // Debug log
      return [];
    }
    // The API returns { success: true, data: [...], message: "..." }
    // So we need to access servicesResponse.data directly
    const servicesArray = servicesResponse.data;
    console.log('Services Array:', servicesArray); // Debug log
    console.log('Number of services found:', servicesArray.length); // Debug log
    
    // Log each service for debugging
    servicesArray.forEach((service: any, index: number) => {
      console.log(`Service ${index + 1}:`, {
        id: service._id,
        name: service.name,
        imageUrl: service.imageUrl,
        description: service.description?.substring(0, 50) + '...'
      });
    });
    
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

  // Handle service click
  const handleServiceClick = (service: any) => {
    navigate("/client/service-details", { state: { service } });
  };

  // Loading state
  if (isLoading) {
    return (
      <ClientDashboardLayout title="Service Catalog" subtitle="Browse and book your desired service">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading services...</span>
            </div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ClientDashboardLayout title="Service Catalog" subtitle="Browse and book your desired service">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load services</p>
            <p className="text-sm text-gray-500 mb-4">
              {error.message || 'Please check your connection and try again'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title="Service Catalog" subtitle="Browse and book your desired service">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

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

        {/* Service List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServices.map((service: any) => (
            <div
              key={service._id || service.serviceId}
              className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 border border-gray-100"
              onClick={() => handleServiceClick(service)}
            >
              {/* Service Image Container */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shadow-inner">
                {service.imageUrl ? (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name}
                    className="w-16 h-16 object-cover rounded-full shadow-sm"
                    onError={(e) => {
                      // Fallback to default icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                
                {/* Fallback Icon */}
                <span className={`text-4xl ${service.imageUrl ? 'hidden' : ''}`}>
                  {getServiceIcon(service.name)}
                </span>
              </div>
              
              {/* Service Name */}
              <span className="font-bold text-gray-800 text-center text-base leading-tight">
                {service.name}
              </span>
              
              {/* Service Description (optional) */}
              {service.description && (
                <span className="text-xs text-gray-500 text-center line-clamp-2 leading-relaxed">
                  {service.description}
                </span>
              )}
            </div>
          ))}
          
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8">
              {search ? 'No services found matching your search.' : 'No services available.'}
            </div>
          )}
        </div>
      </div>
    </ClientDashboardLayout>
  );
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

export default ServiceCatalog;
