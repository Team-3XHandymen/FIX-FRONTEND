
import { useState, useCallback } from "react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import StatsCards from "@/components/handyman/dashboard/StatsCards";
import ClientRequests from "@/components/handyman/dashboard/ClientRequests";
import TodaySchedule from "@/components/handyman/dashboard/TodaySchedule";

const HandymanDashboard = () => {
  const [tab, setTab] = useState<"requests" | "today">("requests");
  const [refreshKey, setRefreshKey] = useState(0);

  // Callback to refresh all components when booking status changes
  const handleBookingStatusChange = useCallback(() => {
    console.log('Handyman dashboard - Status change detected, refreshing...');
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <HandymanDashboardLayout title="Dashboard">
      <StatsCards />

      <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)} className="mb-8">
        <TabsList className="bg-white border rounded-lg shadow p-0">
          <TabsTrigger value="requests" className="px-6 py-2 font-semibold">
            Client Requests
          </TabsTrigger>
          <TabsTrigger value="today" className="px-6 py-2 font-semibold">
            Today's Schedule
          </TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <ClientRequests key={refreshKey} onStatusChange={handleBookingStatusChange} />
        </TabsContent>
        <TabsContent value="today">
          <TodaySchedule />
        </TabsContent>
      </Tabs>
    </HandymanDashboardLayout>
  );
};

export default HandymanDashboard;
