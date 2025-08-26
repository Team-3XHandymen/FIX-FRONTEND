import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, User, Home, Wrench } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientDashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showHomeIcon?: boolean;
  showHandymanButton?: boolean;
}

const notifications = [
  {
    id: 1,
    title: "Job Confirmed",
    description: "Your booking for Plumbing Repair is confirmed.",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "Upcoming Booking",
    description: "You have a booking with Abraham Garcia tomorrow.",
    time: "1 hour ago",
  },
];

const ClientDashboardLayout = ({ children, title, subtitle, showHomeIcon = true, showHandymanButton = false }: ClientDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  // Authentication is now handled by ProtectedClientRoute wrapper
  // No need for manual checks here

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

  const isHandyman = user?.unsafeMetadata?.isHandyman;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-md" style={{ background: "#14B22D" }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-start"></div>
            <div className="flex-1 flex items-center justify-center">
              <Link to="/" className="flex items-center h-10">
                <img
                  src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                  alt="FixFinder Logo"
                  className="h-10 object-contain"
                  style={{ maxWidth: 150 }}
                />
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-end space-x-3">
              {showHomeIcon && location.pathname !== "/client/dashboard" && (
                <button
                  className="rounded-full p-2 hover:bg-green-100 transition"
                  aria-label="Home"
                  onClick={() => navigate("/client/dashboard")}
                  type="button"
                >
                  <Home className="h-6 w-6 text-white" />
                </button>
              )}
              {!isHandyman && showHandymanButton && (
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 py-2 mr-2"
                  onClick={() => navigate("/handyman/registration")}
                >
                  <Wrench className="mr-2 h-5 w-5" />
                  Register as Handyman
                </Button>
              )}
              {isHandyman && (
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 py-2 mr-2"
                  onClick={() => window.open("/handyman/dashboard", "_blank")}
                >
                  Service Dashboard
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell className="h-6 w-6 text-white" />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-2 font-semibold text-gray-700">Notifications</div>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="pointer-events-none text-gray-400">
                      No notifications
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        className="whitespace-normal flex flex-col items-start py-2"
                      >
                        <span className="font-medium">{n.title}</span>
                        <span className="text-xs text-gray-500 mb-1">{n.description}</span>
                        <span className="text-xs text-gray-400">{n.time}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer">
                    <User className="h-5 w-5 text-green-500" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => navigate("/client/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/profile")}>
                    Basic Info
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/service-history")}>
                    Service History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/upcoming-bookings")}>
                    Upcoming Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/reviews")}>
                    Reviews Given
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/payment-billing")}>
                    Payment & Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/account-settings")}>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>

      <div className="w-full flex justify-center p-4 bg-white border-t">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/dd421578-d45c-4aa5-ac80-e96f8fe812e5.png"
            alt="FixFinder New Logo"
            className="h-8 object-contain"
            style={{ maxWidth: 120 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
