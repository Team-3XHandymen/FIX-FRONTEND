
import { useState } from "react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample jobs data
const jobsData = [
  {
    id: "1",
    title: "Plumbing Repair",
    client: "Miona Silva",
    address: "Homagama, Colombo",
    date: "2025-04-25",
    time: "09:00 - 11:00",
    status: "scheduled",
    description: "Fix leaking kitchen sink and replace faucet",
    payment: "$120",
    phone: "(555) 123-4567"
  },
  {
    id: "2",
    title: "Electrical Wiring",
    client: "Dhammika Perera",
    address: "Kurudugahahethekma, Elpitiya",
    date: "2025-04-26",
    time: "13:00 - 15:00",
    status: "scheduled",
    description: "Install new ceiling fans in living room and bedroom",
    payment: "$180",
    phone: "(555) 987-6543"
  },
  {
    id: "3",
    title: "Bathroom Renovation",
    client: "Yohani Fernando",
    address: "Meepe, Gampaha",
    date: "2025-04-28",
    time: "10:00 - 16:00",
    status: "scheduled",
    description: "Replace bathroom tiles and install new shower head",
    payment: "$350",
    phone: "(555) 456-7890"
  },
  {
    id: "4",
    title: "Door Repair",
    client: "Tharindu Dediyagala",
    address: "Kandy, Sri Lanka",
    date: "2025-04-22",
    time: "14:00 - 15:30",
    status: "completed",
    description: "Fix squeaky hinges and replace door knob",
    payment: "$85",
    phone: "(555) 234-5678"
  },
  {
    id: "5",
    title: "Window Installation",
    client: "Rashmi Jayasinghe",
    address: "Galle, Sri Lanka",
    date: "2025-04-21",
    time: "09:30 - 12:30",
    status: "completed",
    description: "Install new energy-efficient windows in dining room",
    payment: "$275",
    phone: "(555) 876-5432"
  }
];

const HandymanJobs = () => {
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">("scheduled");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  const filteredJobs = jobsData.filter(job => job.status === activeTab);
  const selectedJob = jobsData.find(job => job.id === selectedJobId);

  return (
    <HandymanDashboardLayout title="Jobs">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex">
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === "scheduled" ? "border-b-2 border-green-500 text-green-700" : "text-gray-500"}`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled Jobs
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === "completed" ? "border-b-2 border-green-500 text-green-700" : "text-gray-500"}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Jobs
          </button>
        </div>
        
        <div className="p-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} jobs found.
            </div>
          ) : (
            <div className="divide-y">
              {filteredJobs.map(job => (
                <div key={job.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.client} • {job.date}, {job.time}</p>
                    <p className="text-sm text-gray-500">{job.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => setSelectedJobId(job.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          View Details
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View job details</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                          Contact Client
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact {job.client}</DialogTitle>
                          <DialogDescription>
                            You can call or message this client directly.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <h4 className="font-medium">Phone</h4>
                            <p className="text-sm">{job.phone}</p>
                          </div>
                          <div className="flex gap-3">
                            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                              Call Client
                            </button>
                            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                              Send Message
                            </button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedJob && (
        <Popover open={!!selectedJobId} onOpenChange={(open) => !open && setSelectedJobId(null)}>
          <PopoverContent className="w-80" side="right">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selectedJob.title}</h3>
                <p className="text-sm text-gray-600">Job #{selectedJob.id}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Client:</span> {selectedJob.client}</p>
                <p><span className="font-medium">Date & Time:</span> {selectedJob.date}, {selectedJob.time}</p>
                <p><span className="font-medium">Address:</span> {selectedJob.address}</p>
                <p><span className="font-medium">Payment:</span> {selectedJob.payment}</p>
                <p><span className="font-medium">Description:</span> {selectedJob.description}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setSelectedJobId(null)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                {selectedJob.status === "scheduled" && (
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </HandymanDashboardLayout>
  );
};

export default HandymanJobs;
