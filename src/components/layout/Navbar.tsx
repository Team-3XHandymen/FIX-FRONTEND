
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-[#14B22D] shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center h-10">
              {/* LOGO IMAGE HOLDER */}
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-10 object-contain"
                style={{ maxWidth: 150 }}
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-green-100 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-green-100 font-medium">
              About Us
            </Link>
            <Link to="/services" className="text-white hover:text-green-100 font-medium">
              Services
            </Link>
            <Link to="/contact" className="text-white hover:text-green-100 font-medium">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/select-role?action=login">
              <Button variant="outline" className="bg-white text-green-600 hover:bg-green-100">
                Login
              </Button>
            </Link>
            <Link to="/select-role?action=signup">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
