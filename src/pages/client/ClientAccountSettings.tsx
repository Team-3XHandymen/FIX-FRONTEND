
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientAccountSettings = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePreferenceChange = (preference: string) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference as keyof typeof preferences]
    });
    
    toast({
      title: "Preference updated",
      description: "Your notification preferences have been saved."
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate password update
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    setForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleDeleteAccount = () => {
    // Show confirmation dialog (in real app)
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (confirmed) {
      // Simulate account deletion
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully."
      });
      
      // In a real app, redirect to home page or login
      localStorage.removeItem("fixfinder_user");
      window.location.href = "/";
    }
  };

  return (
    <ClientDashboardLayout title="Account Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={form.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                Update Password
              </Button>
            </div>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive booking confirmations and updates via email</p>
              </div>
              <Switch 
                checked={preferences.emailNotifications} 
                onCheckedChange={() => handlePreferenceChange("emailNotifications")} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Receive text messages about your bookings</p>
              </div>
              <Switch 
                checked={preferences.smsNotifications} 
                onCheckedChange={() => handlePreferenceChange("smsNotifications")} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch 
                checked={preferences.pushNotifications} 
                onCheckedChange={() => handlePreferenceChange("pushNotifications")} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing Emails</h3>
                <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
              </div>
              <Switch 
                checked={preferences.marketingEmails} 
                onCheckedChange={() => handlePreferenceChange("marketingEmails")} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-red-100">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAccount}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete My Account
        </Button>
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientAccountSettings;
