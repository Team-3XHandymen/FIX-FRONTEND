import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import BookingDetailsDialog from "@/components/client/BookingDetailsDialog";
import { HandymanAPI } from "@/lib/api";

interface Professional {
  _id: string;
  userId: string;
  name: string;
  status: "Available Now" | "Busy";
  title: string;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  yearsExp: number;
  distance: string;
  services: string[]; // Changed from skills to services
  bio: string;
  location: {
    city: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    [key: string]: string[];
  };
}

const SelectProfessional = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      console.log("Service object:", service); // Debug log
      console.log("Service ID:", service?._id); // Debug log
      console.log("Service name:", service?.name); // Debug log
      
      if (!service?._id) {
        console.log("No service ID found"); // Debug log
        setError("No service selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching professionals for service ID:", service._id); // Debug log
        const response = await HandymanAPI.getServiceProvidersByServiceId(service._id);
        console.log("API Response:", response); // Debug log
        
        if (response.success) {
          console.log("Setting professionals:", response.data); // Debug log
          console.log("First professional services:", response.data[0]?.services); // Debug log
          console.log("First professional title:", response.data[0]?.title); // Debug log
          setProfessionals(response.data);
        } else {
          console.log("API returned error:", response.message); // Debug log
          setError(response.message || "Failed to fetch professionals");
        }
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("Failed to load professionals");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [service?._id]);

  if (loading) {
    return (
      <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading professionals...</div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  if (error) {
    return (
      <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title={`${service?.name || 'Service'} - Select a Professional`} subtitle="">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Service Details
        </button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <div className="font-medium">Sort by:</div>
              <Button variant="outline" size="sm" className="bg-green-500 text-white">
                Distance
              </Button>
              <Button variant="outline" size="sm">
                Rating
              </Button>
              <Button variant="outline" size="sm">
                Experience
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search professionals..."
                className="w-64"
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>Showing: {professionals.length} available professionals</div>
          </div>
        </div>

        <div className="space-y-4">
          {professionals.map((professional) => (
            <div key={professional._id} className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{professional.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      professional.status === "Available Now" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {professional.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {professional.services && professional.services.length > 0 
                      ? professional.services.join(', ')
                      : professional.title
                    }
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {"★".repeat(Math.floor(professional.rating))}
                      <span className="text-sm text-gray-600 ml-1">
                        {professional.rating} ({professional.reviews} reviews)
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">
                      {professional.jobsCompleted} jobs completed
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-lg font-semibold">{professional.yearsExp}</div>
                  <div className="text-sm text-gray-600">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{professional.distance} km</div>
                  <div className="text-sm text-gray-600">Away</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingDetailsDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
      />
    </ClientDashboardLayout>
  );
};

export default SelectProfessional;
