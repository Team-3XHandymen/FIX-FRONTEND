import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Star, User } from "lucide-react";
import { ReviewAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  providerName: string;
  onComplete: () => void;
}

const ISSUE_OPTIONS = [
  "Cleanliness",
  "Navigation",
  "Price",
  "Pickup",
  "Route",
  "Driving",
  "Service Quality",
  "Other"
];

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

const RatingDialog = ({
  open,
  onOpenChange,
  bookingId,
  providerName,
  onComplete,
}: RatingDialogProps) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [detailedFeedback, setDetailedFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleToggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter((i) => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please login.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const headers = {
        'X-User-ID': user.id,
        'X-User-Type': 'client',
      };

      const response = await axios.post(
        `${API_BASE_URL}/reviews`,
        {
          bookingId,
          rating,
          comment: shortDescription || RATING_LABELS[rating],
          shortDescription,
          selectedIssues,
          detailedFeedback,
        },
        { headers, withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });

        onComplete();
        onOpenChange(false);
        
        // Reset form
        setRating(0);
        setSelectedIssues([]);
        setShortDescription("");
        setDetailedFeedback("");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            Rate Your Experience
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Provider Info */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{providerName}</h3>
                <p className="text-sm text-gray-600">Please share your feedback</p>
              </div>
            </div>
          </div>

          {/* Star Rating - Mandatory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              How was your experience? *
            </label>
            <div className="flex justify-center items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm font-medium text-gray-700">
                {RATING_LABELS[rating]}
              </p>
            )}
          </div>

          {/* Issue Selection (Optional) */}
          {rating > 0 && rating < 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What was the issue? (Optional - select one or more)
              </label>
              {selectedIssues.length === 0 && (
                <p className="text-sm text-red-600 mb-3">
                  Please select one or more issues
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {ISSUE_OPTIONS.map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    onClick={() => handleToggleIssue(issue)}
                    className={`px-4 py-2 text-sm rounded-lg border-2 transition-colors ${
                      selectedIssues.includes(issue)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                    disabled={isSubmitting}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brief Description (Optional)
            </label>
            <Input
              type="text"
              placeholder="One or two words..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              disabled={isSubmitting}
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{shortDescription.length}/50</p>
          </div>

          {/* Detailed Feedback (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell us more (Optional)
            </label>
            <Textarea
              placeholder="Share any additional feedback..."
              value={detailedFeedback}
              onChange={(e) => setDetailedFeedback(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              maxLength={5000}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{detailedFeedback.length}/5000</p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review & Complete"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;

