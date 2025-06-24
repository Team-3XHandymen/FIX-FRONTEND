import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";

type ServiceKey = "Plumbing" | "Electrical" | "Carpentry" | "Painting" | "Home Repairs" | "Renovations";

interface ServiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceKey;
}

const DETAILS: Record<ServiceKey, {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  review: {
    stars: number;
    text: string;
    author: string;
  };
  includesLabel: string;
  includesList: string[];
  buttonLabel: string;
  buttonHref: string;
}> = {
  Plumbing: {
    icon: <span role="img" aria-label="Plumbing" className="text-2xl">🛁</span>,
    title: "Plumbing",
    subtitle: "Reliable Solutions for Every Drip and Drain",
    description:
      "Our professional plumbers specialize in fixing leaks, unclogging drains, installing pipes, repairing toilets, and setting up water heaters or bathroom fixtures. Whether it's an emergency or a scheduled maintenance check, we guarantee prompt service, clean workspaces, and long-lasting results.",
    review: {
      stars: 5,
      text: "I had a serious leak under my kitchen sink and FixFinder responded within the hour! The plumber was professional, friendly, and fixed it quickly. Highly recommend!",
      author: "Nisansala P., Gampaha",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Leak detection & repair",
      "Toilet and tap repair",
      "Bathroom fixture installations",
      "Drain cleaning & pipe fitting",
      "Water heater setup and repair",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  },
  Electrical: {
    icon: <span role="img" aria-label="Electrical" className="text-2xl">⚡</span>,
    title: "Electrical",
    subtitle: "Power Up with Safe and Professional Electrical Work",
    description:
      "Safety and precision are our top priorities when it comes to electrical services. From installing new light fixtures and ceiling fans to repairing faulty switches and circuit breakers, our certified electricians handle every job with expert care.",
    review: {
      stars: 5,
      text: "FixFinder installed my entire home’s new lighting system and fixed a power issue we had for weeks. Excellent work and very safe!",
      author: "Mahesh S., Moratuwa",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Light fixture and fan installation",
      "Socket and switch repairs",
      "Complete home rewiring",
      "Generator and UPS connections",
      "Electrical safety inspections",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  },
  Carpentry: {
    icon: <span role="img" aria-label="Carpentry" className="text-2xl">🪵</span>,
    title: "Carpentry",
    subtitle: "Craftsmanship that Brings Your Ideas to Life",
    description:
      "Need a custom shelf, a door fixed, or your wooden furniture restored? Our experienced carpenters offer tailored solutions for repairs, installations, and beautiful woodworking projects that blend functionality with aesthetic appeal.",
    review: {
      stars: 5,
      text: "They built me a custom wardrobe exactly how I imagined it. Great attention to detail and the finishing was perfect!",
      author: "Dilanka R., Kandy",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Furniture repairs & assembly",
      "Custom shelving and cabinets",
      "Door and window frame repairs",
      "Wood panel installation",
      "Decorative woodwork",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  },
  Painting: {
    icon: <span role="img" aria-label="Painting" className="text-2xl">🎨</span>,
    title: "Painting",
    subtitle: "Add Color to Your World, One Wall at a Time",
    description:
      "Whether you're refreshing a single room or repainting the entire house, our painters deliver clean lines, smooth finishes, and color consistency. We also offer consultations to help you pick the perfect palette for your space.",
    review: {
      stars: 5,
      text: "We hired FixFinder to repaint our living room and they did an amazing job — no mess, great quality, and fast!",
      author: "Yasodha T., Colombo",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Interior & exterior wall painting",
      "Decorative finishes and textures",
      "Trim, ceiling & door painting",
      "Paint color consultation",
      "Surface preparation and clean-up",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  },
  "Home Repairs": {
    icon: <span role="img" aria-label="Home Repairs" className="text-2xl">🔧</span>,
    title: "Home Repairs",
    subtitle: "Fix the Small Stuff Before It Becomes Big",
    description:
      "Let our handymen take care of those little things that make a big difference. From squeaky doors and loose handles to cracked tiles or broken shelves, we provide quick fixes that restore comfort and functionality.",
    review: {
      stars: 5,
      text: "Their handyman fixed our sagging door and installed new curtain rods in no time. Super helpful and friendly!",
      author: "Ruwan F., Negombo",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Drywall patching & hole repair",
      "Curtain rod, TV & shelf mounting",
      "Lock and handle adjustments",
      "Minor tile, window, and door fixes",
      "General maintenance tasks",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  },
  Renovations: {
    icon: <span role="img" aria-label="Renovations" className="text-2xl">🏠</span>,
    title: "Renovations",
    subtitle: "Reimagine Your Space with Expert Renovation Services",
    description:
      "Looking to give your space a modern touch? Our team handles kitchen revamps, bathroom makeovers, room expansions, and more. With reliable timelines and transparent pricing, we help bring your dream home to life — one renovation at a time.",
    review: {
      stars: 5,
      text: "FixFinder renovated our small kitchen and turned it into a stylish, spacious area. We’re so happy with the results!",
      author: "Shanika W., Nugegoda",
    },
    includesLabel: "Services Include:",
    includesList: [
      "Kitchen and bathroom renovations",
      "Room remodeling & partitioning",
      "Flooring and ceiling upgrades",
      "Wall knock-downs & layout changes",
      "Interior design support",
    ],
    buttonLabel: "Secure your service now",
    buttonHref: "/signup/client",
  }
};

function ServiceDetailDialog({ open, onOpenChange, service }: ServiceDetailDialogProps) {
  const detail = DETAILS[service];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center gap-2 mb-1">{detail.icon}
            <span className="text-2xl font-bold ml-2">{detail.title}</span>
          </div>
          <div className="text-lg font-semibold mb-2">{detail.subtitle}</div>
          <div className="text-gray-700 mb-5">{detail.description}</div>

          <div className="mb-6 bg-gray-50 border rounded p-4">
            <div className="flex items-center mb-2 gap-2 text-gray-700 font-semibold">
              <Info className="h-5 w-5 text-gray-400" />
              Customer Review:
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: detail.review.stars }).map((_, idx) => (
                <span key={idx} aria-label="star" className="text-yellow-500 text-lg">★</span>
              ))}
            </div>
            <blockquote className="italic text-gray-700 mb-1">&quot;{detail.review.text}&quot;</blockquote>
            <div className="text-gray-900 font-semibold text-sm">— {detail.review.author}</div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              {detail.includesLabel}
            </div>
            <ul className="list-disc list-inside pl-2 space-y-0.5 text-blue-900">
              {detail.includesList.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <a href={detail.buttonHref}>
              <Button className="bg-green-500 hover:bg-green-600">{detail.buttonLabel}</Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ServiceDetailDialog;
