
import React from "react";

interface JobCardProps {
  date: string;
  client: string;
  service: string;
  distance: string;
  amount: string;
  status: "completed" | "cancelled";
}

const JobCard = ({ date, client, service, distance, amount, status }: JobCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{date}</p>
          <p className="text-sm text-gray-600">{client} • {service}</p>
          <p className="text-xs text-gray-400">{distance}</p>
        </div>
        <div className="text-center">
          <p className="font-medium">{amount}</p>
          <span className={`${status === 'completed' ? 'bg-green-200 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-0.5 rounded text-xs`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
