import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin, BarChart3, Users, TrendingUp, Activity } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const Index = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  // Mock dashboard data
  const dashboardStats = {
    activeAlerts: 3,
    totalReports: 1247,
    reportsToday: 127,
    activeUsers: 1543,
    systemHealth: 98.5,
    lastUpdate: new Date().toLocaleTimeString()
  };

  const recentAlerts = notifications
    .filter(n => n.severity === 'high' || n.severity === 'critical')
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground text-blue-600">
            Monitor ocean hazards and coastal safety across the Indian Ocean region
          </p>
        </div>

        {/* Critical Alerts */}
        {recentAlerts.length > 0 && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <span className="font-medium">{recentAlerts.length} critical alert(s) require attention.</span>
              {recentAlerts.map(alert => (
                <div key={alert.id} className="mt-1 text-sm">
                  • {alert.title} - {alert.location?.name}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{dashboardStats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.reportsToday}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Online now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Hazard Reports</CardTitle>
              <CardDescription>Latest reports from coastal monitoring stations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-2 w-2 rounded-full bg-destructive" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">High waves - Gujarat Coast</p>
                  <p className="text-xs text-muted-foreground">
                    3-4m waves expected, reported 2 hours ago
                  </p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-2 w-2 rounded-full bg-orange-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Coastal flooding - Chennai</p>
                  <p className="text-xs text-muted-foreground">
                    Marina Beach area, reported 4 hours ago
                  </p>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-2 w-2 rounded-full bg-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Storm surge warning - Odisha</p>
                  <p className="text-xs text-muted-foreground">
                    Low pressure area, reported 6 hours ago
                  </p>
                </div>
                <Badge variant="outline">Low</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Coverage</CardTitle>
              <CardDescription>Monitoring stations across Indian coastal states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Gujarat Coast</span>
                </div>
                <Badge variant="default">24 stations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Tamil Nadu</span>
                </div>
                <Badge variant="default">31 stations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Kerala</span>
                </div>
                <Badge variant="default">18 stations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">West Bengal</span>
                </div>
                <Badge variant="default">15 stations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">Odisha</span>
                </div>
                <Badge variant="default">12 stations</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {dashboardStats.lastUpdate} | INCOIS Ocean Hazard Monitoring Platform
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
