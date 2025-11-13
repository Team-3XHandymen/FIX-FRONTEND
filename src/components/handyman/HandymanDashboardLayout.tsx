import React, { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  Bell,
  LogOut,
  User,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  homeButtonHandler?: () => void;
}

const menuItems = [
  { labelKey: "handyman.layout.menu.dashboard", route: "/handyman/dashboard" },
  { labelKey: "handyman.layout.menu.schedule", route: "/handyman/schedule" },
  { labelKey: "handyman.layout.menu.jobs", route: "/handyman/jobs" },
  { labelKey: "handyman.layout.menu.clients", route: "/handyman/clients" },
  { labelKey: "handyman.layout.menu.serviceHistory", route: "/handyman/service-history" },
  { labelKey: "handyman.layout.menu.settings", route: "/handyman/settings" },
  { labelKey: "handyman.layout.menu.profile", route: "/handyman/profile" },
  { labelKey: "handyman.layout.menu.account", route: "/handyman/account" },
  { labelKey: "handyman.layout.menu.billing", route: "/handyman/billing" },
];

const HandymanDashboardLayout = ({ 
  children, 
  title, 
  subtitle, 
  homeButtonHandler 
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const isOnDashboard = location.pathname === "/handyman/dashboard";

  const handleHomeClick = homeButtonHandler || (() => navigate("/handyman/dashboard"));

  // Get user's first name from Clerk
  const firstName = user?.firstName || user?.username || 'there';

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f5faf7]">
      <main className="flex-1 flex flex-col min-h-screen bg-[#f5faf7]">
        <div className="w-full px-3 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 flex items-center justify-between border-b bg-white shadow-sm gap-2">
          <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-1 sm:gap-2 mx-auto">
            <img
              src="/lovable-uploads/f8b0003c-8de6-4035-b677-59817d3a83cf.png"
              alt="FixFinder Logo"
              className="h-6 sm:h-7 md:h-9 object-contain"
              style={{ maxWidth: 140 }}
            />
          </span>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {!isOnDashboard && (
              <button
                className="rounded-full p-1.5 sm:p-2 hover:bg-green-100 transition"
                aria-label="Home"
                onClick={() => navigate("/handyman/dashboard")}
              >
                <Home className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
              </button>
            )}
            <button
              className="rounded-full p-1.5 sm:p-2 hover:bg-green-100 transition"
              aria-label={t("handyman.layout.notifications")}
              onClick={() => navigate("/handyman/notifications")}
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
            </button>
            <LanguageSwitcher variant="light" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-0.5 sm:p-1 border-2 border-green-300 hover:border-green-500 transition"
                  aria-label="Profile"
                >
                  <img
                    src={user?.imageUrl || "https://randomuser.me/api/portraits/men/34.jpg"}
                    alt="Handyman avatar"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 mt-2 max-w-[calc(100vw-2rem)]">
                {menuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.labelKey}
                    onClick={() => navigate(item.route)}
                    className={`text-sm sm:text-base ${location.pathname === item.route ? "bg-green-50 text-green-700" : ""}`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>{t(item.labelKey)}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t("handyman.layout.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 sm:px-6 md:px-10 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {t("handyman.hero.welcome", { name: firstName })}
            </h1>
            <p className="text-green-100 text-sm sm:text-base md:text-lg">
              {t("handyman.hero.subtitle")}
            </p>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 md:px-10 pt-4 sm:pt-6 md:pt-8 pb-2">
          {title && <h1 className="text-xl sm:text-2xl font-bold text-green-900">{title}</h1>}
          {subtitle && <p className="text-sm sm:text-base text-gray-700 mt-1 sm:mt-2">{subtitle}</p>}
        </div>
        <div className="flex-1 px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-8">{children}</div>
        <footer className="w-full px-4 sm:px-6 md:px-10 py-3 sm:py-4 border-t bg-white shadow-sm">
          <img
            src="/lovable-uploads/f8b0003c-8de6-4035-b677-59817d3a83cf.png"
            alt="FixFinder Logo"
            className="h-5 sm:h-6 object-contain mx-auto"
          />
        </footer>
      </main>
    </div>
  );
};

export default HandymanDashboardLayout;
