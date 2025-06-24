
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
    <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
      <div className="flex items-center mb-4">
        <div className="bg-white rounded-full p-2 mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-800">{description}</p>
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
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
