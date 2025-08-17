
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/images/Hero.jpg";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          height: "100vh",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.7)"
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="text-white">#1</span><br />
            <span className="text-white">HANDYMAN SERVICE</span><br />
            <span className="text-orange-500">WEBSITE</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-8">
            Connect with reliable and skilled handymen in your area for all your home repair and maintenance needs.
            Our platform makes it easy to find the right professional for any job.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/services">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                Book a Service
              </Button>
            </Link>
            <Link to="/signup/handyman">
              <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8">
                Join as Handyman
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 bg-green-500 py-5 px-4">
        <div className="container mx-auto">
          <p className="text-white text-center text-sm md:text-base font-medium">
            "Connecting You to Reliable Handyman Services — Anytime, Anywhere!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
