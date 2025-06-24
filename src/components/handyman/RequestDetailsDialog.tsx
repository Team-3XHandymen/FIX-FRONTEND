
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RequestDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: string;
    title: string;
    client: string;
    address: string;
    time: string;
    note: string;
  };
}

const RequestDetailsDialog = ({ open, onOpenChange, request }: RequestDetailsProps) => {
  const navigate = useNavigate();

  const photos = [
    "/lovable-uploads/dee4bc78-008e-48fe-9a6d-0a851f0e0b58.png",
    "/lovable-uploads/f1ac4051-e1a6-4dde-a3f7-f065c2486f55.png",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-2xl">{request.title}</h3>
            <p className="text-sm text-gray-500">Request ID: {request.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Client</label>
                <p className="text-gray-900 text-lg">{request.client}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900 text-lg">{request.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Preferred Time</label>
                <p className="text-gray-900 text-lg">{request.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="text-gray-900 text-lg whitespace-pre-wrap">{request.note}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-3">Uploaded Photos</label>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Request photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => navigate(`/handyman/chat/${request.id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Client
            </Button>
            <Button
              className="flex-1"
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
