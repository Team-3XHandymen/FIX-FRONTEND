
import React, { useState } from "react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import AddJobDialog from "@/components/handyman/AddJobDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, List, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import cn from "clsx";

const today = new Date();

const HandymanSchedule = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const jobs: any[] = []; // stub/no jobs for now

  // Navigation
  function prevDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 1);
      return d;
    });
  }
  function nextDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      return d;
    });
  }

  return (
    <HandymanDashboardLayout title="Schedule Jobs" subtitle="Manage your appointments and scheduled services">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 mt-2">
          {/* Header controls */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={view === "list" ? "secondary" : "outline"}
                className={cn("rounded-md font-semibold", view === "list" ? "bg-slate-100" : "")}
                onClick={() => setView("list")}
              >
                <List className="w-4 h-4 mr-1" /> List View
              </Button>
              <Button
                variant={view === "calendar" ? "secondary" : "outline"}
                className={cn("rounded-md font-semibold", view === "calendar" ? "bg-slate-100" : "")}
                onClick={() => setView("calendar")}
              >
                <CalendarIcon className="w-4 h-4 mr-1" /> Calendar View
              </Button>
            </div>
            {/* Right controls */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search jobs..."
                className="w-52 md:w-64 text-base bg-slate-50"
              />
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-none"
                onClick={() => setAddJobOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" /> Add Job
              </Button>
            </div>
          </div>
          {/* Date navigation */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              onClick={prevDay}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <span className="font-semibold text-xl mx-2">
              {format(currentDate, "PPP")}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              onClick={nextDay}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="ml-auto text-gray-500 text-sm">
              {jobs.length} jobs scheduled
            </span>
          </div>
          {/* Jobs list / calendar */}
          <div className="rounded-lg border p-10 text-center flex flex-col items-center bg-slate-50 min-h-[220px]">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-bold text-lg mb-1">No jobs scheduled</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-base">
              No jobs are scheduled for this date. Use the <span className="font-semibold">"Add Job"</span> button to create a new job.
            </p>
          </div>
        </div>
        {/* The "Add Job" dialog */}
        <AddJobDialog open={addJobOpen} onOpenChange={setAddJobOpen} date={currentDate} />
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanSchedule;
