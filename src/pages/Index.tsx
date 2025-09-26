import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin, BarChart3, Users, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import RealTimeAlerts from '@/components/RealTimeAlerts';
import WeatherWidget from '@/components/WeatherWidget';

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
    <>
    <div className="space-y-6 animate-fade-in">
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
          <Card className="animate-hover-lift animate-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{dashboardStats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card className="animate-hover-lift animate-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.reportsToday}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="animate-hover-lift animate-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                <div className="h-1 w-1 bg-green-500 rounded-full inline-block mr-1 animate-pulse"></div>
                Online now
              </p>
            </CardContent>
          </Card>

          <Card className="animate-hover-lift animate-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-accent animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.systemHealth}%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Dashboard Widgets */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Real-time Alerts */}
          <div className="lg:col-span-1">
            <RealTimeAlerts />
          </div>
          
          {/* Weather Widget */}
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>
          
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="animate-hover-lift">
              <CardHeader>
                <CardTitle>Recent Hazard Reports</CardTitle>
                <CardDescription>Latest reports from coastal monitoring stations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 animate-hover-lift">
                  <div className="flex h-2 w-2 rounded-full bg-destructive animate-pulse-glow" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">High waves - Gujarat Coast</p>
                    <p className="text-xs text-muted-foreground">
                      3-4m waves expected, reported 2 hours ago
                    </p>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">High</Badge>
                </div>
                <div className="flex items-center space-x-4 animate-hover-lift">
                  <div className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Coastal flooding - Chennai</p>
                    <p className="text-xs text-muted-foreground">
                      Marina Beach area, reported 4 hours ago
                    </p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex items-center space-x-4 animate-hover-lift">
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
          </div>
        </div>
        
        {/* Geographic Coverage */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-hover-lift">
              <CardHeader>
                <CardTitle>Geographic Coverage</CardTitle>
                <CardDescription>Monitoring stations across Indian coastal states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between animate-hover-lift">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Gujarat Coast</span>
                  </div>
                  <Badge variant="default" className="animate-hover-scale">24 stations</Badge>
                </div>
                <div className="flex items-center justify-between animate-hover-lift">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Tamil Nadu</span>
                  </div>
                  <Badge variant="default" className="animate-hover-scale">31 stations</Badge>
                </div>
                <div className="flex items-center justify-between animate-hover-lift">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Kerala</span>
                  </div>
                  <Badge variant="default" className="animate-hover-scale">18 stations</Badge>
                </div>
                <div className="flex items-center justify-between animate-hover-lift">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">West Bengal</span>
                  </div>
                  <Badge variant="default" className="animate-hover-scale">15 stations</Badge>
                </div>
                <div className="flex items-center justify-between animate-hover-lift">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">Odisha</span>
                  </div>
                  <Badge variant="default" className="animate-hover-scale">12 stations</Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions Card */}
            <Card className="animate-hover-lift bg-gradient-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common monitoring tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all duration-300 animate-hover-scale flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Report Emergency</div>
                    <div className="text-xs text-muted-foreground">Submit critical hazard alert</div>
                  </div>
                </button>
                <button className="w-full p-3 bg-accent/10 hover:bg-accent/20 rounded-lg transition-all duration-300 animate-hover-scale flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div className="text-left">
                    <div className="font-medium text-sm">View Live Map</div>
                    <div className="text-xs text-muted-foreground">Interactive hazard visualization</div>
                  </div>
                </button>
                <button className="w-full p-3 bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-all duration-300 animate-hover-scale flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-secondary-foreground" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Generate Report</div>
                    <div className="text-xs text-muted-foreground">Download analytics summary</div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>


        <div className="text-center text-sm text-muted-foreground bg-gradient-to-r from-transparent via-muted/20 to-transparent p-4 rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4 animate-pulse text-primary" />
            Last updated: {dashboardStats.lastUpdate} | INCOIS Ocean Hazard Monitoring Platform
          </div>
        </div>
      </>
  );
};

export default Index;
