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
import ClientSignUp from "./pages/ClientSignUp";
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
import HandymanServiceHistory from "./pages/handyman/HandymanServiceHistory";
import CompleteProfile from "./pages/CompleteProfile";
import ServiceDetails from "./pages/client/ServiceDetails";
import SelectProfessional from "./pages/client/SelectProfessional";
import CreateBooking from "./pages/client/CreateBooking";
import HandymanRegistration from "./pages/HandymanRegistration";
import ClientChatRoom from "./pages/client/ClientChatRoom";
import ServiceCatalog from "./pages/client/ServiceCatalog";
import HandymanChatRoom from "./pages/handyman/HandymanChatRoom";
import ProtectedClientRoute from "./components/auth/ProtectedClientRoute";
import ProtectedHandymanRoute from "./components/auth/ProtectedHandymanRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
          <Route path="/signup/client" element={<ClientSignUp />} />
          <Route path="/signup/handyman" element={<ProtectedRoute><HandymanRegistration /></ProtectedRoute>} />
          <Route path="/client/dashboard" element={<ProtectedClientRoute><ClientDashboard /></ProtectedClientRoute>} />
          <Route path="/client/service-details" element={<ProtectedClientRoute><ServiceDetails /></ProtectedClientRoute>} />
          <Route path="/client/profile" element={<ProtectedClientRoute><ClientProfile /></ProtectedClientRoute>} />
          <Route path="/client/service-history" element={<ProtectedClientRoute><ClientServiceHistory /></ProtectedClientRoute>} />
          <Route path="/client/upcoming-bookings" element={<ProtectedClientRoute><ClientUpcomingBookings /></ProtectedClientRoute>} />
          <Route path="/client/reviews" element={<ProtectedClientRoute><ClientReviews /></ProtectedClientRoute>} />
          <Route path="/client/payment-billing" element={<ProtectedClientRoute><ClientPaymentBilling /></ProtectedClientRoute>} />
          <Route path="/client/account-settings" element={<ProtectedClientRoute><ClientAccountSettings /></ProtectedClientRoute>} />
          <Route path="/client/complete-profile" element={<ProtectedClientRoute><CompleteProfile /></ProtectedClientRoute>} />
          <Route path="/client/chat/:bookingId" element={<ProtectedClientRoute><ClientChatRoom /></ProtectedClientRoute>} />
          <Route path="/client/create-booking" element={<ProtectedClientRoute><CreateBooking /></ProtectedClientRoute>} />
          <Route path="/handyman/dashboard" element={<ProtectedHandymanRoute><HandymanDashboard /></ProtectedHandymanRoute>} />
          <Route path="/handyman/schedule" element={<ProtectedHandymanRoute><HandymanSchedule /></ProtectedHandymanRoute>} />
          <Route path="/handyman/jobs" element={<ProtectedHandymanRoute><HandymanJobs /></ProtectedHandymanRoute>} />
          <Route path="/handyman/clients" element={<ProtectedHandymanRoute><HandymanClients /></ProtectedHandymanRoute>} />
          <Route path="/handyman/settings" element={<ProtectedHandymanRoute><HandymanSettings /></ProtectedHandymanRoute>} />
          <Route path="/handyman/profile" element={<ProtectedHandymanRoute><HandymanProfile /></ProtectedHandymanRoute>} />
          <Route path="/handyman/notifications" element={<ProtectedHandymanRoute><HandymanNotifications /></ProtectedHandymanRoute>} />
          <Route path="/handyman/account" element={<ProtectedHandymanRoute><HandymanAccount /></ProtectedHandymanRoute>} />
          <Route path="/handyman/billing" element={<ProtectedHandymanRoute><HandymanBilling /></ProtectedHandymanRoute>} />
          <Route path="/handyman/service-history" element={<ProtectedHandymanRoute><HandymanServiceHistory /></ProtectedHandymanRoute>} />
          <Route path="/client/select-professional" element={<ProtectedClientRoute><SelectProfessional /></ProtectedClientRoute>} />
          <Route path="/handyman/registration" element={<HandymanRegistration />} />
          <Route path="/client/service-catalog" element={<ProtectedClientRoute><ServiceCatalog /></ProtectedClientRoute>} />
          <Route path="/handyman/chat/:bookingId" element={<ProtectedHandymanRoute><HandymanChatRoom /></ProtectedHandymanRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
