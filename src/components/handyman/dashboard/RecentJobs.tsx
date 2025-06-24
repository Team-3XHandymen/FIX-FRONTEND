
import React from "react";
import JobCard from "./JobCard";

const recentJobs = [
  {
    date: "Apr 14, 2025",
    client: "David Wilson",
    service: "Plumbing",
    distance: "2.5 miles away",
    amount: "$120",
    status: "completed" as const,
  },
  {
    date: "Apr 12, 2025",
    client: "Jennifer Lee",
    service: "Electrical",
    distance: "1.8 miles away",
    amount: "$250",
    status: "completed" as const,
  },
  {
    date: "Apr 10, 2025",
    client: "Robert Brown",
    service: "Plumbing",
    distance: "3.2 miles away",
    amount: "$750",
    status: "completed" as const,
  },
  {
    date: "Apr 8, 2025",
    client: "Patricia Miller",
    service: "Carpentry",
    distance: "0.5 miles away",
    amount: "$180",
    status: "completed" as const,
  },
  {
    date: "Apr 5, 2025",
    client: "Linda Garcia",
    service: "Electrical",
    distance: "4.1 miles away",
    amount: "$350",
    status: "cancelled" as const,
  },
];

const RecentJobs = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Recent Jobs</h2>
      </div>
      <div className="grid gap-4 p-4">
        {recentJobs.map((job, index) => (
          <JobCard key={index} {...job} />
        ))}
      </div>
    </div>
  );
};

export default RecentJobs;
