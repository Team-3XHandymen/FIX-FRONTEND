
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  CreditCard,
  Check,
  Calendar,
  Download,
} from "lucide-react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const planFeatures = [
  "Unlimited job scheduling",
  "Client management",
  "Invoice generation",
  "Email notifications"
];

// Mock single card (could expand for list)
const paymentMethods = [
  {
    type: "Visa",
    last4: "4242",
    expiry: "09/2025",
    default: true,
  },
];

const billingHistory = [
  {
    id: "INV-2023-001",
    date: "Apr 21, 2023",
    amount: 29.99,
    status: "Paid",
  },
  {
    id: "INV-2023-002",
    date: "Mar 21, 2023",
    amount: 29.99,
    status: "Paid",
  },
  {
    id: "INV-2023-003",
    date: "Feb 21, 2023",
    amount: 29.99,
    status: "Paid",
  },
];

const HandymanBilling = () => (
  <HandymanDashboardLayout title="Billing">
    <div className="flex flex-col gap-8">
      {/* Current Plan */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-0 px-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-lg text-green-900">
                Current Plan
              </span>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 px-6" size="sm">
              Upgrade Plan
            </Button>
          </div>
          {/* Plan Block */}
          <div className="bg-gray-50 rounded mt-4 flex flex-col md:flex-row items-center md:items-stretch justify-between px-6 py-5">
            <div>
              <div className="font-semibold text-gray-900 text-base">Professional Plan</div>
              <div className="text-gray-700 text-sm">$29.99/month</div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 ml-0 md:ml-4 mt-2 md:mt-0">Active</Badge>
          </div>
          {/* Features */}
          <div className="px-6 pb-6 pt-4">
            <div className="text-gray-700 font-medium text-base mb-2">Plan Features</div>
            <ul className="space-y-2">
              {planFeatures.map((f, i) => (
                <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Methods */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-0 px-0">
          {/* Header */}
          <div className="flex items-center px-6 pb-2">
            <CreditCard className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-lg text-green-900 ml-2">Payment Methods</span>
          </div>
          <div className="px-6 pb-6 space-y-4">
            {/* VISA card mock */}
            <div className="flex flex-col gap-2">
              <div className="bg-white border rounded flex items-center px-4 py-3 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-[#2557D6] rounded flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 object-contain" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Visa ending in 4242</div>
                    <div className="text-xs text-gray-500">Expires 09/2025</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="border px-2 py-0 bg-gray-100 text-gray-600" variant="secondary">Default</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-5 py-1 h-auto text-gray-700 border-gray-300"
                  >
                    Edit
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="mt-2 w-full flex items-center justify-center gap-1 text-gray-800 border-gray-300 font-medium bg-white">
                <span className="text-xl font-bold">+</span>
                Add Payment Method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Billing History */}
      <Card className="border border-gray-200">
        <CardContent className="pt-6 pb-2 px-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-2">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-lg text-green-900 ml-2">Billing History</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-4 h-8 border-gray-300"
            >
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
          <div className="px-6 pt-1 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((b, i) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.id}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ${b.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 border-none text-green-700 px-3 py-1">Paid</Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  </HandymanDashboardLayout>
);

export default HandymanBilling;
