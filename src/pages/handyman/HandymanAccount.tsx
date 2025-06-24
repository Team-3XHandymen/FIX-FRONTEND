
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  User,
  Lock,
  Shield,
  Mail,
  Facebook,
  Trash2,
} from "lucide-react";

const AccountSection = () => {
  const [email, setEmail] = useState("john.doe@example.com");
  const [username, setUsername] = useState("johndoe");
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4 flex flex-row items-center gap-2">
        <User className="h-5 w-5 text-green-600" strokeWidth={2.2} />
        <CardTitle className="text-base font-semibold text-gray-900">Account Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            className="px-6 bg-green-500 hover:bg-green-600 text-white font-medium"
            style={{ borderColor: "#22c55e" }}
            variant="outline"
            type="button"
          >
            Update Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SecuritySection = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4 flex flex-row items-center gap-2">
        <Lock className="h-5 w-5 text-green-600" strokeWidth={2.2} />
        <CardTitle className="text-base font-semibold text-gray-900">Security</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1 text-gray-700" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value="passwordpassword"
              disabled
              className="bg-white border-gray-300 text-gray-900 tracking-widest font-medium"
              style={{ letterSpacing: "0.2em" }}
            />
          </div>
          <div className="md:text-right w-full md:w-auto flex flex-col items-end mt-2 md:mt-0">
            <span className="text-xs text-gray-500 mb-2 md:mb-1">Last changed 3 months ago</span>
            <Button
              className="px-6 bg-green-500 hover:bg-green-600 text-white font-medium"
              style={{ borderColor: "#22c55e" }}
              variant="outline"
              type="button"
            >
              Change Password
            </Button>
          </div>
        </div>
        <div className="border p-4 mt-5 rounded-md bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-600" strokeWidth={2} />
            <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              Protect your account with two-factor authentication
            </span>
            <Button
              className="px-6"
              style={{ borderColor: "#22c55e", color: "#22c55e" }}
              variant="outline"
              type="button"
            >
              Enable
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ConnectedAccountsSection = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4 flex flex-row items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" strokeWidth={2.2} />
        <CardTitle className="text-base font-semibold text-gray-900">Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-700" />
              </div>
              <span className="font-medium text-gray-900">Google</span>
              <span className="text-xs text-gray-500 ml-2">Not Connected</span>
            </div>
            <Button
              className="px-6"
              style={{ borderColor: "#22c55e", color: "#22c55e" }}
              variant="outline"
              type="button"
            >
              Connect
            </Button>
          </div>
          <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                <Facebook className="h-4 w-4 text-blue-700" />
              </div>
              <span className="font-medium text-gray-900">Facebook</span>
              <span className="text-xs text-gray-500 ml-2">Not Connected</span>
            </div>
            <Button
              className="px-6"
              style={{ borderColor: "#22c55e", color: "#22c55e" }}
              variant="outline"
              type="button"
            >
              Connect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DangerZoneSection = () => {
  return (
    <Card className="mb-6 border-red-200 bg-red-50">
      <CardHeader className="pb-2 pl-2">
        <CardTitle className="text-base font-semibold text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-red-100 rounded p-4">
          <div className="font-semibold mb-1 text-gray-800">Delete Account</div>
          <div className="text-gray-600 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </div>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6"
            variant="destructive"
            type="button"
          >
            <Trash2 className="h-5 w-5 mr-1" /> Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const HandymanAccount = () => (
  <HandymanDashboardLayout title="Account">
    <div className="mx-auto max-w-4xl w-full">
      <AccountSection />
      <SecuritySection />
      <ConnectedAccountsSection />
      <DangerZoneSection />
    </div>
  </HandymanDashboardLayout>
);

export default HandymanAccount;
