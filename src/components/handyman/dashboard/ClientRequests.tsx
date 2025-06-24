
import React, { useState } from "react";
import RequestDetailsDialog from "../RequestDetailsDialog";

const clientRequests = [
  {
    id: "cr1",
    title: "Leaky Faucet Repair",
    client: "Olivia Thompson",
    address: "12 Green Lane",
    time: "8:30 AM",
    note: "Urgent, water leaking continuously.",
  },
  {
    id: "cr2",
    title: "Ceiling Light Installation",
    client: "Ethan Clark",
    address: "59 Oak Road",
    time: "10:00 AM",
    note: "Bring step ladder, high ceiling.",
  },
];

const ClientRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<typeof clientRequests[0] | null>(null);

  return (
    <div className="bg-white rounded-lg shadow mt-4">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Client Requests</h2>
      </div>
      <div className="p-4 bg-red-50 border-b border-red-100">
        <p className="text-red-600 text-sm">Please review and accept</p>
      </div>
      <ul className="divide-y">
        {clientRequests.length === 0 ? (
          <li className="py-6 text-center text-gray-500">No new client requests.</li>
        ) : (
          clientRequests.map((req) => (
            <li key={req.id} className="relative flex justify-between items-center p-4">
              <div className="absolute top-2 -left-1 bg-[#ea384c] text-white px-3 py-1 text-xs font-bold">
                NEW
              </div>
              <div className="mt-6">
                <div className="font-semibold">{req.title}</div>
                <div className="text-sm text-gray-500">{req.client} • {req.address}</div>
                <div className="text-xs text-gray-400">{req.time}</div>
                <div className="text-xs text-green-700">{req.note}</div>
              </div>
              <button
                onClick={() => setSelectedRequest(req)}
                className="bg-green-50 text-green-700 px-4 py-1 rounded hover:bg-green-100 text-sm"
              >
                View Details
              </button>
            </li>
          ))
        )}
      </ul>
      {selectedRequest && (
        <RequestDetailsDialog
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default ClientRequests;
