
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddJobDialog = ({
  open,
  onOpenChange,
  date,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
}) => {
  const [jobDate, setJobDate] = useState(() => date.toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // For now, just close on submit.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // You can add job-creation logic here.
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Enter the details for the new scheduled job.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <Input
              type="date"
              value={jobDate}
              onChange={(e) => setJobDate(e.target.value)}
              required
              className="text-lg font-mono border-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Time</label>
            <Input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 9:00 AM - 11:00 AM"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client</label>
            <Input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Client name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Service</label>
            <Input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Service type"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details"
              rows={2}
            />
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              Add Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;
