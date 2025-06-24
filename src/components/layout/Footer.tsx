
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#14B22D] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {/* LOGO IMAGE HOLDER */}
            <div className="mb-4">
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-8 object-contain"
                style={{ maxWidth: 120 }}
              />
            </div>
            <p className="mb-4">Connecting you to reliable handyman services for all your home maintenance and repair needs.</p>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@fixfinder.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>123 Main Street, Anytown, USA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
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
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
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
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="mb-4">Subscribe to our newsletter for tips, updates and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 w-full text-gray-800 rounded-l focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-400 mt-8 pt-8 text-center">
          <div className="flex justify-center mb-3">
            {/* LOGO IMAGE HOLDER */}
            <img
              src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
              alt="FixFinder Logo"
              className="h-8 object-contain"
              style={{ maxWidth: 120 }}
            />
          </div>
          <p>&copy; {new Date().getFullYear()} FixFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

