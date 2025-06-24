
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;

  const serviceDetails = {
    duration: "1-3 hours",
    startingPrice: "$85",
    description: "Our professional plumbing services cover everything from minor repairs to major installations. Our certified plumbers are equipped to handle any plumbing issue quickly and efficiently, ensuring minimum disruption to your daily life.",
    features: [
      {
        title: "Leak Detection & Repair",
        description: "Professional detection and fixing of all types of water leaks"
      },
      {
        title: "Toilet & Tap Repair",
        description: "Expert repairs for all bathroom and kitchen fixtures"
      },
      {
        title: "Bathroom Fixture Installations",
        description: "Complete installation services for all bathroom fixtures"
      },
      {
        title: "Drain Cleaning & Pipe Fitting",
        description: "Thorough drain cleaning and professional pipe installation"
      },
      {
        title: "Water Heater Setup & Repair",
        description: "Installation, maintenance, and repair of water heating systems"
      }
    ]
  };

  if (!service) {
    return (
      <ClientDashboardLayout title="Service Details" subtitle="">
        <div className="max-w-4xl mx-auto text-center text-gray-600 py-16">
          No service selected. Please return to the service catalog.
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate("/client/service-catalog")}>
              Back to Service Catalog
            </Button>
          </div>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title="Service Details" subtitle="">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Service Catalog
        </button>

        <div className="bg-green-500 text-white p-6 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-white rounded-full p-4 mr-4">
              <span className="text-2xl">{service.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{service.name} Services</h2>
              <div className="flex items-center mt-2 text-green-100">
                <span className="flex items-center mr-4">
                  <span className="mr-1">⏱</span> {serviceDetails.duration}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">💰</span> Starting from {serviceDetails.startingPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About this service</h3>
            <p className="text-gray-600">{serviceDetails.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">What's included</h3>
            <div className="space-y-4">
              {serviceDetails.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1 mr-3">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Service fee</div>
              <div className="text-2xl font-semibold">{serviceDetails.startingPrice}</div>
              <div className="text-xs text-gray-500">Additional charges may apply based on complexity</div>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                navigate('/client/select-professional', { state: { service } });
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </ClientDashboardLayout>
  );
};

export default ServiceDetails;
