import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const todaysSchedule = [
  {
    id: "1",
    title: "Plumbing Repair",
    client: "Sarah Johnson",
    address: "123 Oak Street",
    time: "9:00 AM - 10:30 AM",
    status: "completed",
  },
  {
    id: "2",
    title: "Electrical Wiring",
    client: "Michael Smith",
    address: "456 Pine Avenue",
    time: "11:30 AM - 1:00 PM",
    status: "in progress",
  },
  {
    id: "3",
    title: "Bathroom Renovation",
    client: "Emily Davis",
    address: "789 Maple Road",
    time: "3:00 PM - 5:00 PM",
    status: "upcoming",
  },
];

const TodaySchedule = () => {
  const navigate = useNavigate();

  const handleChat = (jobId: string) => {
    navigate(`/handyman/chat/${jobId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow mt-4">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Today's Schedule</h2>
      </div>
      <ul className="divide-y">
        {todaysSchedule.map((job) => (
          <li key={job.id} className="flex justify-between items-center p-4">
            <div>
              <div className="font-semibold">{job.title}</div>
              <div className="text-sm text-gray-500">{job.client} • {job.address}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">{job.time}</div>
              <span className={
                job.status === "completed"
                  ? "bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs"
                  : job.status === "in progress"
                  ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs"
                  : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
              }>
                {job.status}
              </span>
              <Button
                onClick={() => handleChat(job.id)}
                className="bg-green-600 hover:bg-green-500"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodaySchedule;
