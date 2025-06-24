import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import BookingDetailsDialog from "@/components/client/BookingDetailsDialog";

interface Professional {
  id: string;
  name: string;
  status: "Available Now" | "Busy";
  title: string;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  yearsExp: number;
  distance: number;
  successRate: number;
  isRecommended: boolean;
}

const professionals: Professional[] = [
  {
    id: "1",
    name: "Sapumal Chandrasiri",
    status: "Available Now",
    title: "Master Plumber, Emergency Services",
    rating: 4.8,
    reviews: 156,
    jobsCompleted: 234,
    yearsExp: 12,
    distance: 2.4,
    successRate: 95,
    isRecommended: true,
  },
  {
    id: "2",
    name: "Udayanga Perera",
    status: "Available Now",
    title: "Commercial Plumbing Expert",
    rating: 4.9,
    reviews: 132,
    jobsCompleted: 189,
    yearsExp: 8,
    distance: 3.1,
    successRate: 95,
    isRecommended: true,
  },
  {
    id: "3",
    name: "Nimal Basnayake",
    status: "Busy",
    title: "Residential Plumbing Specialist",
    rating: 4.7,
    reviews: 198,
    jobsCompleted: 312,
    yearsExp: 15,
    distance: 4.2,
    successRate: 95,
    isRecommended: true,
  },
  {
    id: "4",
    name: "Piyal Alahakon",
    status: "Available Now",
    title: "Water Heater & Pipeline Expert",
    rating: 4.8,
    reviews: 89,
    jobsCompleted: 145,
    yearsExp: 6,
    distance: 1.8,
    successRate: 95,
    isRecommended: true,
  },
];

const SelectProfessional = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;
  const [showBookingDialog, setShowBookingDialog] = useState(false);

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
            <div key={professional.id} className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
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
                  <p className="text-sm text-gray-600">{professional.title}</p>
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
                <div className="text-center">
                  <div className="text-lg font-semibold">{professional.successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowBookingDialog(true)}
                  >
                    Hire Now
                  </Button>
                  {professional.isRecommended && (
                    <div className="text-xs text-green-600 text-center mt-1">
                      Highly Recommended
                    </div>
                  )}
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
