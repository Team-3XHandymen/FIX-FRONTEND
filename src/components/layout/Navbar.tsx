import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X } from "lucide-react";
import { SignUpButton, SignedOut, SignedIn, UserButton, SignInButton, useUser } from '@clerk/clerk-react';

interface NavbarProps {
  showHandymanDashboard?: boolean;
}

const Navbar = ({ showHandymanDashboard = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#14B22D] shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center h-8 sm:h-10" onClick={() => setIsMobileMenuOpen(false)}>
              {/* LOGO IMAGE HOLDER */}
              <img
                src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                alt="FixFinder Logo"
                className="h-8 sm:h-10 object-contain"
                style={{ maxWidth: 150 }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="bg-white text-green-600 hover:bg-green-100">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to="/client/dashboard">
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                  Dashboard
                </Button>
              </Link>
              {showHandymanDashboard && (
                <Button 
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => window.open('/handyman/dashboard', '_blank')}
                >
                  Service Dashboard
                </Button>
              )}
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-600 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-400 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-green-100 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-green-100 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-green-100 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-green-100 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="pt-2 border-t border-green-400">
                <SignedOut>
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full bg-white text-green-600 hover:bg-green-100">
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-col space-y-2">
                    <Link to="/client/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                        Dashboard
                      </Button>
                    </Link>
                    {showHandymanDashboard && (
                      <Button 
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          window.open('/handyman/dashboard', '_blank');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Service Dashboard
                      </Button>
                    )}
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
