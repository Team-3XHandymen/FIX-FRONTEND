
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-orange-50 to-green-50">
      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Enter your full name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Your phone number" required />
            </div>

            <div className="space-y-2">
              <Label>Address Details</Label>
              <div className="space-y-3">
                <Input placeholder="Address Line 1" required />
                <Input placeholder="Address Line 2 (Optional)" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="City" required />
                  <Input placeholder="State/Province" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Postal Code" required />
                  <Input placeholder="Country" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-picture">Profile Picture (Optional)</Label>
              <Input 
                id="profile-picture" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setProfileImage(file);
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
