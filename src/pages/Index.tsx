
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Values from "@/components/home/Values";
import ServiceShowcase from "@/components/home/ServiceShowcase";
import HowItWorks from "@/components/home/HowItWorks";
import CustomerTestimonials from "@/components/home/CustomerTestimonials";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
