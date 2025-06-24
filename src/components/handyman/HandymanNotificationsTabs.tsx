
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HandymanNotificationsTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const tabList = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Jobs", value: "jobs" },
  { label: "Payments", value: "payments" },
  { label: "System", value: "system" },
];

const HandymanNotificationsTabs: React.FC<HandymanNotificationsTabsProps> = ({
  value,
  onChange,
}) => (
  <Tabs value={value} onValueChange={onChange} className="mb-6">
    <TabsList className="bg-transparent space-x-2 p-0">
      {tabList.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className={`rounded-lg px-5 py-2.5 font-medium text-base ${
            value === tab.value
              ? "bg-green-500 text-white shadow"
              : "bg-[#F6F8F7] text-gray-700 hover:bg-green-100/60"
          }`}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export default HandymanNotificationsTabs;
