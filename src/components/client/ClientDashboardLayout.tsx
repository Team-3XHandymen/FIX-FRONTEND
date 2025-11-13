import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, User, Home, Wrench } from "lucide-react";
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

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
  const { t } = useTranslation();

  // Authentication is now handled by ProtectedClientRoute wrapper
  // No need for manual checks here

  const handleLogout = () => {
    toast({
      title: t("client.layout.menu.logout"),
      description: t("client.layout.menu.logout")
    });
    navigate("/");
  };

  const isHandyman = user?.unsafeMetadata?.isHandyman;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-md" style={{ background: "#14B22D" }}>
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-start"></div>
            <div className="flex-1 flex items-center justify-center">
              <Link to="/" className="flex items-center h-8 sm:h-10">
                <img
                  src="/lovable-uploads/a707e924-f315-4907-a798-16e19d2e7a69.png"
                  alt="FixFinder Logo"
                  className="h-8 sm:h-10 object-contain"
                  style={{ maxWidth: 150 }}
                />
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-end space-x-1 sm:space-x-3">
              {showHomeIcon && location.pathname !== "/client/dashboard" && (
                <button
                  className="rounded-full p-1.5 sm:p-2 hover:bg-green-100 transition"
                  aria-label="Home"
                  onClick={() => navigate("/client/dashboard")}
                  type="button"
                >
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>
              )}
              {!isHandyman && showHandymanButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex border-green-600 text-green-600 hover:bg-green-50 py-1.5 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm"
                  onClick={() => navigate("/handyman/registration")}
                >
                  <Wrench className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden md:inline">{t("client.layout.registerHandyman")}</span>
                </Button>
              )}
              {isHandyman && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex border-blue-600 text-blue-600 hover:bg-blue-50 py-1.5 sm:py-2 mr-1 sm:mr-2 text-xs sm:text-sm"
                  onClick={() => window.open("/handyman/dashboard", "_blank")}
                >
                  <span className="hidden md:inline">{t("client.layout.serviceDashboard")}</span>
                </Button>
              )}
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer p-1">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 sm:w-72 max-w-[calc(100vw-2rem)]">
                  <div className="p-2 text-sm sm:text-base font-semibold text-gray-700">{t("client.layout.notifications")}</div>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem className="pointer-events-none text-gray-400 text-sm sm:text-base">
                      {t("client.layout.noNotifications")}
                    </DropdownMenuItem>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        className="whitespace-normal flex flex-col items-start py-2"
                      >
                        <span className="font-medium text-sm sm:text-base">{n.title}</span>
                        <span className="text-xs text-gray-500 mb-1">{n.description}</span>
                        <span className="text-xs text-gray-400">{n.time}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center cursor-pointer">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56 max-w-[calc(100vw-2rem)]">
                  <DropdownMenuItem
                    onClick={() => navigate("/client/dashboard")}
                    className="text-sm sm:text-base"
                  >
                    {t("client.layout.menu.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/profile")} className="text-sm sm:text-base">
                    {t("client.layout.menu.basicInfo")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/service-history")} className="text-sm sm:text-base">
                    {t("client.layout.menu.serviceHistory")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/upcoming-bookings")} className="text-sm sm:text-base">
                    {t("client.layout.menu.upcomingBookings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/reviews")} className="text-sm sm:text-base">
                    {t("client.layout.menu.reviews")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/payment-billing")} className="text-sm sm:text-base">
                    {t("client.layout.menu.paymentBilling")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/client/account-settings")} className="text-sm sm:text-base">
                    {t("client.layout.menu.accountSettings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 text-sm sm:text-base">
                    {t("client.layout.menu.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-50">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>

      <div className="w-full flex justify-center p-3 sm:p-4 bg-white border-t">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/dd421578-d45c-4aa5-ac80-e96f8fe812e5.png"
            alt="FixFinder New Logo"
            className="h-6 sm:h-8 object-contain"
            style={{ maxWidth: 120 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardLayout;
