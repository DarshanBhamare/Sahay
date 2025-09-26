import React from 'react';
import { MapPin, AlertTriangle, BarChart3, MessageSquare, Users, Settings, Home, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

// Navigation items based on user role
const getNavigationItems = (role: string) => {
  const baseItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Interactive Map', url: '/map', icon: MapPin },
    { title: 'Report Hazard', url: '/report', icon: AlertTriangle },
  ];

  const officialItems = [
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Social Monitor', url: '/social', icon: MessageSquare },
    { title: 'Reports Review', url: '/reports', icon: FileText },
  ];

  const adminItems = [
    { title: 'Admin Panel', url: '/admin', icon: Users },
    { title: 'System Settings', url: '/settings', icon: Settings },
  ];

  if (role === 'admin') {
    return [...baseItems, ...officialItems, ...adminItems];
  } else if (role === 'official' || role === 'analyst') {
    return [...baseItems, ...officialItems];
  }
  
  return baseItems;
};

// Mock real-time statistics
const mockStats = {
  activeAlerts: 3,
  reportsToday: 127,
  onlineUsers: 1543,
  systemStatus: 'operational'
};

interface AppSidebarProps {
  className?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ className }) => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const navigationItems = getNavigationItems(user?.role || 'citizen');
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={className}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Real-time Statistics */}
        {!isCollapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Real-time Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Alerts</span>
                  <Badge variant="destructive" className="text-xs">
                    {mockStats.activeAlerts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reports Today</span>
                  <Badge variant="secondary" className="text-xs">
                    {mockStats.reportsToday}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Online Users</span>
                  <Badge variant="outline" className="text-xs">
                    {mockStats.onlineUsers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">System</span>
                  <Badge variant="default" className="text-xs bg-accent">
                    {mockStats.systemStatus}
                  </Badge>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { toggleSidebar } = useApp();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={toggleSidebar} />
          
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>

          {/* Bottom Toolbar - Mobile responsive */}
          <div className="lg:hidden border-t bg-background p-4">
            <div className="flex items-center justify-around">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </NavLink>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs">Map</span>
              </NavLink>
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs">Report</span>
              </NavLink>
              <NavLink
                to="/social"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Social</span>
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Reports</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;