
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Wrench, Droplet, Lightbulb, PaintBucket, HardHat, Home, ArrowRight } from "lucide-react";
import * as React from "react";
import ServiceDetailDialog from "@/components/services/ServiceDetailDialog";
import serviceBg from "@/assets/images/service back1.jpg";
import plumbingI from "@/assets/images/plumbing.jpg";
import carpentryI from "@/assets/images/capentry.jpg";
import electricalI from "@/assets/images/electrical.jpg";
import paintingI from "@/assets/images/painting.jpg";
import renovationsI from "@/assets/images/renovation.jpg";
import homerepI from "@/assets/images/homerepair.jpg";



// ServiceKey matches dialog's ServiceKey type.

interface Service {
  name: string;
  description: string;
  imageUrl: string;
  icon: React.ReactNode;
  baseFee?: number;
}


const ServiceCard = ({ name, description, imageUrl, icon }: Service) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none w-full text-left">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-xl font-bold text-white uppercase">{name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="text-gray-600 mb-2">{description}</p>
      </div>
    </div>
  );
};


const SERVICES: Service[] = [
  {
    name: "Appliance Repair",
    description: "Professional repair services for all household appliances including refrigerators, washing machines, dryers, and more.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <Wrench className="h-5 w-5 text-green-500" />,
    baseFee: 75
  },
  {
    name: "Carpentry",
    description: "Expert woodworking and carpentry services for furniture repair, custom installations, and home improvements.",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    icon: <Wrench className="h-5 w-5 text-green-500" />,
    baseFee: 60
  },
  {
    name: "Cleaning",
    description: "Comprehensive cleaning services for homes and offices including deep cleaning, regular maintenance, and post-construction cleanup.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <Home className="h-5 w-5 text-green-500" />,
    baseFee: 50
  },
  {
    name: "Electrical",
    description: "Licensed electrical services for installations, repairs, maintenance, and safety inspections.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop",
    icon: <Lightbulb className="h-5 w-5 text-green-500" />,
    baseFee: 80
  },
  {
    name: "Gardening",
    description: "Professional gardening and landscaping services including lawn care, tree trimming, and garden design.",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
    icon: <Home className="h-5 w-5 text-green-500" />,
    baseFee: 45
  },
  {
    name: "Home Repair",
    description: "General home repair and maintenance services for all types of household issues and improvements.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop",
    icon: <Home className="h-5 w-5 text-green-500" />,
    baseFee: 65
  },
  {
    name: "Painting",
    description: "Professional painting services for interior and exterior projects with quality materials and expert finishes.",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop",
    icon: <PaintBucket className="h-5 w-5 text-green-500" />,
    baseFee: 55
  },
  {
    name: "Plumbing",
    description: "Expert plumbing services for repairs, installations, maintenance, and emergency plumbing issues.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <Droplet className="h-5 w-5 text-green-500" />,
    baseFee: 70
  },
  {
    name: "Roofing",
    description: "Professional roofing services including repairs, installations, maintenance, and inspections.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <HardHat className="h-5 w-5 text-green-500" />,
    baseFee: 100
  },
  {
    name: "Window Cleaning",
    description: "Professional window cleaning services for residential and commercial properties.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <Home className="h-5 w-5 text-green-500" />,
    baseFee: 40
  },
  {
    name: "Pest Control",
    description: "Comprehensive pest control services for residential and commercial properties.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    icon: <Home className="h-5 w-5 text-green-500" />,
    baseFee: 85
  }
];


const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative bg-gray-900 py-24">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url(${serviceBg})`,
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(0, 0, 0, 0.6)"
            }}
          />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              EXPLORE OUR WIDE RANGE OF SERVICES
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whatever your home maintenance or repair needs, our team of skilled handymen are ready to help
            </p>
          </div>
        </div>
        
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <ServiceCard 
                  key={service.name}
                  {...service}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="py-16 bg-green-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Service?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Don't see what you're looking for? We offer many more specialized services and can customize solutions for your specific needs.
            </p>
            <a href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-100">
                Contact Us for Custom Services
              </Button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

