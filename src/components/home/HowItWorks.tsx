
import { CheckCircle, MessageCircle, ClipboardCheck } from "lucide-react";

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "yellow" | "orange";
}

const StepCard = ({ icon, title, description, color }: StepCardProps) => {
  const bgColor = color === "yellow" ? "bg-yellow-400" : "bg-orange-400";
  
  return (
    <div className={`${bgColor} rounded-lg p-4 sm:p-6 shadow-md`}>
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="bg-white rounded-full p-2 mr-2 sm:mr-3 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-800">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Choose Service",
      description: "Browse through our service categories and select what you need assistance with.",
      color: "yellow" as const
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-500" />,
      title: "Book Appointment",
      description: "Schedule a convenient time for a handyman to visit your location.",
      color: "orange" as const
    },
    {
      icon: <ClipboardCheck className="h-6 w-6 text-green-500" />,
      title: "Get Service & Payment",
      description: "Receive quality service from our skilled professionals and make payments securely.",
      color: "yellow" as const
    }
  ];

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 px-2">How It Works</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              color={step.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
