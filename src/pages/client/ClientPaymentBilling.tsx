
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientPaymentBilling = () => {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/24",
      default: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8765",
      expiry: "03/25",
      default: false
    }
  ];
  
  const billingHistory = [
    {
      id: "INV-001-2023",
      date: "Jan 15, 2023",
      description: "Plumbing Repair",
      amount: "$125.00",
      status: "Paid"
    },
    {
      id: "INV-002-2023",
      date: "Dec 20, 2022",
      description: "Electrical Installation",
      amount: "$210.00",
      status: "Paid"
    },
    {
      id: "INV-003-2022",
      date: "Nov 05, 2022",
      description: "Furniture Assembly",
      amount: "$85.00",
      status: "Pending"
    }
  ];

  return (
    <ClientDashboardLayout title="Payment & Billing">
      <Tabs defaultValue="paymentMethods" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="paymentMethods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billingHistory">Billing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paymentMethods">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Your Payment Methods</h2>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Add New Card
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(card => (
                <Card key={card.id} className={`relative overflow-hidden ${card.default ? 'border-green-500' : ''}`}>
                  {card.default && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 transform rotate-45 translate-x-4 translate-y-2">
                        Default
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold">{card.type} •••• {card.last4}</div>
                      <div className="flex space-x-2">
                        {!card.default && (
                          <Button variant="outline" size="sm">
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-600">
                      Expires: {card.expiry}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billingHistory">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{invoice.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-green-600 hover:text-green-900">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </ClientDashboardLayout>
  );
};

export default ClientPaymentBilling;
