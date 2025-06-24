import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import HandymanNotificationsTabs from "@/components/handyman/HandymanNotificationsTabs";
import HandymanNotificationCard from "@/components/handyman/HandymanNotificationCard";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/components/handyman/HandymanNotificationCard";
import { ArrowLeft } from "lucide-react";

const notifications = [
  {
    type: "job" as NotificationType,
    title: "New Job Scheduled",
    description:
      "You have a new plumbing job scheduled with Sarah Johnson at 123 Oak Street tomorrow at 9:00 AM.",
    time: "Today, 10:45 AM",
    unread: true,
    actions: [
      { label: "View Details" },
      { label: "Reschedule", variant: "outline" as const },
    ],
  },
  {
    type: "payment" as NotificationType,
    title: "Payment Received",
    description:
      "You received a payment of $250.00 for Bathroom Renovation from Emily Davis.",
    time: "Yesterday, 3:20 PM",
    actions: [
      { label: "View Invoice" },
    ],
  },
  {
    type: "review" as NotificationType,
    title: "Client Review",
    description:
      'Michael Smith left you a 5-star review for the electrical wiring job. "Great work, very professional and timely."',
    time: "2 days ago",
    unread: true,
    actions: [
      { label: "View Review" },
      { label: "Send Thanks", variant: "outline" as const },
    ],
  },
  {
    type: "system" as NotificationType,
    title: "System Update",
    description:
      "Fixfinder has been updated to version 2.4.0. Check out the new features including improved scheduling and invoice templates.",
    time: "1 week ago",
    actions: [
      { label: "View Updates" },
    ],
  },
  {
    type: "subscription" as NotificationType,
    title: "Subscription Renewal",
    description:
      "Your Professional Plan subscription will renew in 7 days. Your card ending in 4242 will be charged $29.99.",
    time: "2 weeks ago",
    actions: [
      { label: "Manage Subscription" },
      { label: "Update Payment", variant: "outline" as const },
    ],
  },
];

const HandymanNotifications = () => {
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();

  return (
    <HandymanDashboardLayout 
      title="Notifications"
      homeButtonHandler={() => navigate("/handyman/dashboard")}
    >
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <HandymanNotificationsTabs value={tab} onChange={setTab} />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="px-5 h-10 border-gray-300 text-gray-700"
          >
            Mark All as Read
          </Button>
          <Button
            variant="outline"
            className="px-5 h-10 bg-green-500 hover:bg-green-600 border-green-500 text-white font-medium"
            style={{ borderColor: "#22c55e" }}
          >
            Notification Settings
          </Button>
        </div>
      </div>
      <div className="mt-1">
        {notifications.map((n, i) => (
          <HandymanNotificationCard
            key={i}
            {...n}
          />
        ))}
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanNotifications;
