
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#14B22D] text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 md:col-span-1">
            {/* LOGO IMAGE HOLDER */}
            <div className="mb-4">
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-7 sm:h-8 object-contain"
                style={{ maxWidth: 120 }}
              />
            </div>
            <p className="text-sm sm:text-base mb-4">Connecting you to reliable handyman services for all your home maintenance and repair needs.</p>
            <div className="flex items-center mb-2 text-sm sm:text-base">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center mb-2 text-sm sm:text-base">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="break-all">support@fixfinder.com</span>
            </div>
            <div className="flex items-start text-sm sm:text-base">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>123 Main Street, Anytown, USA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:underline">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <Link to="/services/plumbing" className="hover:underline">Plumbing</Link>
              </li>
              <li>
                <Link to="/services/electrical" className="hover:underline">Electrical</Link>
              </li>
              <li>
                <Link to="/services/carpentry" className="hover:underline">Carpentry</Link>
              </li>
              <li>
                <Link to="/services/painting" className="hover:underline">Painting</Link>
              </li>
              <li>
                <Link to="/services/flooring" className="hover:underline">Flooring</Link>
              </li>
              <li>
                <Link to="/services/appliance-repair" className="hover:underline">Appliance Repair</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Subscribe</h3>
            <p className="text-sm sm:text-base mb-4">Subscribe to our newsletter for tips, updates and special offers.</p>
            <div className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-3 sm:px-4 py-2 w-full text-gray-800 rounded-l sm:rounded-l text-sm sm:text-base focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r sm:rounded-r text-sm sm:text-base whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-400 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <div className="flex justify-center mb-3">
            {/* LOGO IMAGE HOLDER */}
            <img
              src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
              alt="FixFinder Logo"
              className="h-7 sm:h-8 object-contain"
              style={{ maxWidth: 120 }}
            />
          </div>
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} FixFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

