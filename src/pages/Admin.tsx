import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/admin/UserManagement';
import AlertBroadcast from '@/components/admin/AlertBroadcast';
import SystemMonitoring from '@/components/admin/SystemMonitoring';
import { Shield, Megaphone, Activity, Users } from 'lucide-react';
import WebsiteHeader from '@/components/WebsiteHeader';

const Admin: React.FC = () => {
  return (
    <>
      <WebsiteHeader />
      <div className="space-y-6 px-4 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">
            Manage users, broadcast alerts, and monitor system health
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertBroadcast />
        </TabsContent>

        <TabsContent value="monitoring">
          <SystemMonitoring />
        </TabsContent>

        <TabsContent value="security">
          <div className="text-center py-12 text-muted-foreground">
            Security management features coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default Admin;