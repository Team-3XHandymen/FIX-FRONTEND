
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import plumbing from "@/assets/images/plumbing.jpg";
import carpentry from "@/assets/images/capentry.jpg";
import electrical from "@/assets/images/electrical.jpg";

interface ServiceCardProps {
  title: string;
  image: string;
  description: string;
}

const ServiceCard = ({ title, image, description }: ServiceCardProps) => {
  return (
    <div className="bg-green-600 bg-opacity-80 rounded-lg overflow-hidden">
      <div className="h-40 sm:h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">{title}</h3>
        <p className="text-sm sm:text-base text-green-100 mb-4 sm:mb-5">{description}</p>
        <div className="flex justify-end">
          <Link to={`/services/${title.toLowerCase()}`}>
            <Button variant="ghost" size="sm" className="text-white hover:text-green-200">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ServiceShowcase = () => {
  const services = [
    {
      title: "Carpentry",
      image: carpentry,
      description: "Expert carpentry services for furniture assembly, repairs, custom builds, and more."
    },
    {
      title: "Plumbing",
      image: plumbing,
      description: "Professional plumbing solutions for leaks, installations, repairs, and maintenance."
    },
    {
      title: "Electrical",
      image: electrical,
      description: "Skilled electricians for installations, repairs, wiring, and electrical troubleshooting."
    }
  ];

  return (
    <div className="py-12 sm:py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2 px-2">MOST POPULAR SERVICES</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-12 px-2">
          From carpentry to electrical repairs, we've got you covered for all your home maintenance needs.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.title}
              title={service.title}
              image={service.image}
              description={service.description}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8 sm:mt-12">
          <Link to="/services#top" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 text-sm sm:text-base">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceShowcase;
