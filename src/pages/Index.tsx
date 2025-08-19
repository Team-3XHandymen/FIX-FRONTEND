
import { useEffect, useState, useRef } from "react";
import { useUser } from '@clerk/clerk-react';
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Values from "@/components/home/Values";
import ServiceShowcase from "@/components/home/ServiceShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import CustomerTestimonials from "@/components/home/CustomerTestimonials";
import Footer from "@/components/layout/Footer";
import { ClientAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isHandyman, setIsHandyman] = useState(false);
  const processedUsersRef = useRef<Set<string>>(new Set());

  // Create client record for new users when they land on homepage
  useEffect(() => {
    const createClientIfNeeded = async () => {
      if (!user || !isLoaded || isCreatingClient) return;
      
      // Skip if user already processed
      if (processedUsersRef.current.has(user.id)) return;

      try {
        setIsCreatingClient(true);

        const clientData = {
          userId: user.id,
          username: user.username || user.firstName || 'user',
          email: user.emailAddresses[0]?.emailAddress || '',
        };

        await ClientAPI.createClient(clientData);

        toast({
          title: "Welcome!",
          description: "Your profile has been set up successfully.",
        });

      } catch (error: any) {
        // Silently handle 409 conflicts (client already exists)
        if (error.response?.status !== 409) {
          console.error('Failed to create client record:', error);
        }
      } finally {
        setIsCreatingClient(false);
        processedUsersRef.current.add(user.id);
      }
    };

    createClientIfNeeded();
  }, [user, isLoaded, isCreatingClient, toast]);

  // Check if user is registered as handyman
  useEffect(() => {
    const checkHandymanStatus = () => {
      if (!user || !isLoaded) return;

      // Add a small delay to ensure metadata is loaded
      setTimeout(() => {
        try {
          const hasHandymanProfile = ClientAPI.isUserHandyman(user);
          setIsHandyman(hasHandymanProfile);
        } catch (error) {
          console.error('Failed to check handyman status:', error);
          setIsHandyman(false);
        }
      }, 1000); // Wait 1 second for metadata to load
    };

    checkHandymanStatus();
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showHandymanDashboard={isHandyman} />
      <main className="flex-grow">
        <Hero />
        <Values />
        <ServiceShowcase />
        <HowItWorks />
        <CustomerTestimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
