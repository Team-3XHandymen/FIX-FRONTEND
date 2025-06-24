
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
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-white text-xl font-bold mb-3 text-center">{title}</h3>
        <p className="text-green-100 mb-5">{description}</p>
        <div className="flex justify-end">
          <Link to={`/services/${title.toLowerCase()}`}>
            <Button variant="ghost" className="text-white hover:text-green-200">
              <ArrowRight className="h-5 w-5" />
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
    <div className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">MOST POPULAR SERVICES</h2>
        <p className="text-gray-600 text-center mb-12">
          From carpentry to electrical repairs, we've got you covered for all your home maintenance needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard 
              key={service.title}
              title={service.title}
              image={service.image}
              description={service.description}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/services#top">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceShowcase;
