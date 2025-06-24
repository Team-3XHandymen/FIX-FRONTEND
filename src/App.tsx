import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SelectRole from "./pages/SelectRole";
import ClientSignUp from "./pages/ClientSignUp";
import ClientLogin from "./pages/ClientLogin";
import HandymanLogin from "./pages/HandymanLogin";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientServiceHistory from "./pages/client/ClientServiceHistory";
import ClientUpcomingBookings from "./pages/client/ClientUpcomingBookings";
import ClientReviews from "./pages/client/ClientReviews";
import ClientPaymentBilling from "./pages/client/ClientPaymentBilling";
import ClientAccountSettings from "./pages/client/ClientAccountSettings";
import HandymanDashboard from "./pages/handyman/HandymanDashboard";
import HandymanSchedule from "./pages/handyman/HandymanSchedule";
import HandymanJobs from "./pages/handyman/HandymanJobs";
import HandymanClients from "./pages/handyman/HandymanClients";
import HandymanSettings from "./pages/handyman/HandymanSettings";
import HandymanProfile from "./pages/handyman/HandymanProfile";
import HandymanNotifications from "./pages/handyman/HandymanNotifications";
import HandymanAccount from "./pages/handyman/HandymanAccount";
import HandymanBilling from "./pages/handyman/HandymanBilling";
import CompleteProfile from "./pages/CompleteProfile";
import ServiceDetails from "./pages/client/ServiceDetails";
import SelectProfessional from "./pages/client/SelectProfessional";
import HandymanRegistration from "./pages/HandymanRegistration";
import ClientChat from "./pages/client/ClientChat";
import ServiceCatalog from "./pages/client/ServiceCatalog";
import HandymanChat from "./pages/handyman/HandymanChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/signup/client" element={<ClientSignUp />} />
          <Route path="/signup/handyman" element={<HandymanRegistration />} />
          <Route path="/login/client" element={<ClientLogin />} />
          <Route path="/login/handyman" element={<HandymanLogin />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/service-details" element={<ServiceDetails />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/service-history" element={<ClientServiceHistory />} />
          <Route path="/client/upcoming-bookings" element={<ClientUpcomingBookings />} />
          <Route path="/client/reviews" element={<ClientReviews />} />
          <Route path="/client/payment-billing" element={<ClientPaymentBilling />} />
          <Route path="/client/account-settings" element={<ClientAccountSettings />} />
          <Route path="/client/complete-profile" element={<CompleteProfile />} />
          <Route path="/client/chat/:bookingId" element={<ClientChat />} />
          <Route path="/handyman/dashboard" element={<HandymanDashboard />} />
          <Route path="/handyman/schedule" element={<HandymanSchedule />} />
          <Route path="/handyman/jobs" element={<HandymanJobs />} />
          <Route path="/handyman/clients" element={<HandymanClients />} />
          <Route path="/handyman/settings" element={<HandymanSettings />} />
          <Route path="/handyman/profile" element={<HandymanProfile />} />
          <Route path="/handyman/notifications" element={<HandymanNotifications />} />
          <Route path="/handyman/account" element={<HandymanAccount />} />
          <Route path="/handyman/billing" element={<HandymanBilling />} />
          <Route path="/client/select-professional" element={<SelectProfessional />} />
          <Route path="/handyman/registration" element={<HandymanRegistration />} />
          <Route path="/client/service-catalog" element={<ServiceCatalog />} />
          <Route path="/handyman/chat/:requestId" element={<HandymanChat />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
