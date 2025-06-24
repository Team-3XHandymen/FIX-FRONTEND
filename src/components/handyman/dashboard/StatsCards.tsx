
import React from "react";

const StatsCards = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Total Earnings</div>
          <div className="text-xl font-bold">$2,458.50</div>
          <div className="text-xs text-gray-400 mt-1">from last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Jobs Completed</div>
          <div className="text-xl font-bold">24</div>
          <div className="text-xs text-gray-400 mt-1">from last month</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Average Rating</div>
          <div className="text-xl font-bold">4.8</div>
          <div className="text-xs text-gray-400 mt-1">based on 24 reviews</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">Response Ratio</div>
          <div className="text-xl font-bold">95%</div>
          <div className="text-xs text-gray-400 mt-1">~25 min response time</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
