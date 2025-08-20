
import { useState } from "react";
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
import RecentJobs from "@/components/handyman/dashboard/RecentJobs";

const HandymanDashboard = () => {
  const [tab, setTab] = useState<"requests" | "today">("requests");

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
          <ClientRequests />
        </TabsContent>
        <TabsContent value="today">
          <TodaySchedule />
        </TabsContent>
      </Tabs>
      
      <RecentJobs />
    </HandymanDashboardLayout>
  );
};

export default HandymanDashboard;
