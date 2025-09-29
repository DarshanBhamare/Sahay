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
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

// Navigation items based on user role
const getNavigationItems = (role: string) => {
  const baseItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Interactive Map', url: '/map', icon: MapPin },
    // Removed 'Report Hazard' and 'About SIH' per request
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
    <Sidebar
      className={`${className ?? ''} text-white bg-gradient-to-b from-emerald-700 to-teal-700 dark:from-slate-950 dark:to-slate-900 border-r border-emerald-800 dark:border-slate-800`}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-emerald-100 dark:text-teal-200">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                          isActive
                            ? 'bg-white text-emerald-700 shadow-md border border-emerald-200'
                            : 'text-white/85 hover:text-white hover:bg-white/10'
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
            <SidebarGroupLabel className="text-emerald-100">Real-time Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Active Alerts</span>
                  <Badge variant="destructive" className="text-xs">
                    {mockStats.activeAlerts}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Reports Today</span>
                  <Badge variant="secondary" className="text-xs">
                    {mockStats.reportsToday}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Online Users</span>
                  <Badge variant="outline" className="text-xs">
                    {mockStats.onlineUsers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">System</span>
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
          <div className="lg:hidden border-t bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-slate-950 dark:to-slate-900 p-4 text-white">
            <div className="flex items-center justify-around">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 rounded-md ${
                    isActive ? 'text-emerald-700 bg-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </NavLink>
              <NavLink
                to="/map"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 rounded-md ${
                    isActive ? 'text-emerald-700 bg-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <MapPin className="h-5 w-5" />
                <span className="text-xs">Map</span>
              </NavLink>
              {/* Removed 'Report' bottom toolbar icon per request */}
              <NavLink
                to="/social"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 rounded-md ${
                    isActive ? 'text-emerald-700 bg-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-xs">Social</span>
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 rounded-md ${
                    isActive ? 'text-emerald-700 bg-white' : 'text-white/85 hover:text-white hover:bg-white/10'
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