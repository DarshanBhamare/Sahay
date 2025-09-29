import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin, BarChart3, Users, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import RealTimeAlerts from '@/components/RealTimeAlerts';
import WeatherWidget from '@/components/WeatherWidget';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
        {/* Hero Section for SIH25039 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2070&auto=format&fit=crop')] opacity-15 bg-cover bg-center" />
          <div className="relative z-10 grid gap-6 md:grid-cols-3 items-center">
            <div className="md:col-span-2 space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">INCOIS Ocean Hazard Platform</h1>
              <p className="text-blue-100 max-w-2xl">
                Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics. Report hazards, explore live maps, and monitor public signals in real time.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Badge variant="outline" className="bg-white/15 border-white/30">Disaster Management</Badge>
                <Badge variant="outline" className="bg-white/15 border-white/30">Ministry of Earth Sciences</Badge>
                <Badge variant="outline" className="bg-white/15 border-white/30">INCOIS</Badge>
              </div>
            </div>
            <div className="flex md:justify-end gap-3">
              <Link to="/map">
                <Button size="lg" variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30">View Map</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Welcome Section (heading removed as requested) */}
        <div className="mt-2">
          <p className="text-muted-foreground text-blue-600">
            Monitor ocean hazards and coastal safety across the Indian coastline
          </p>
        </div>

        {/* Critical Alerts */}
        {recentAlerts.length > 0 && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <span className="font-medium">{recentAlerts.length} critical alert(s) require attention.</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Active Alerts */}
          <Card className="animate-hover-lift shadow-lg ring-1 ring-red-200/40 dark:ring-red-900/30 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-rose-200">Active Alerts</CardTitle>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200">
                <AlertTriangle className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-red-700 dark:text-red-200">{dashboardStats.activeAlerts}</div>
              <p className="text-xs text-red-700/70 dark:text-rose-200/70">Requiring immediate attention</p>
            </CardContent>
          </Card>

          {/* Reports Today */}
          <Card className="animate-hover-lift shadow-lg ring-1 ring-emerald-200/40 dark:ring-emerald-900/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">Reports Today</CardTitle>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                <BarChart3 className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-200">{dashboardStats.reportsToday}</div>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-200/70">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="animate-hover-lift shadow-lg ring-1 ring-sky-200/40 dark:ring-sky-900/30 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-sky-700 dark:text-sky-200">Active Users</CardTitle>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200">
                <Users className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-sky-800 dark:text-sky-200">{dashboardStats.activeUsers}</div>
              <p className="text-xs text-sky-700/70 dark:text-sky-200/70">
                <span className="inline-block mr-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Online now
              </p>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="animate-hover-lift shadow-lg ring-1 ring-violet-200/40 dark:ring-violet-900/30 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-violet-700 dark:text-violet-200">System Health</CardTitle>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
                <Activity className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-violet-800 dark:text-violet-200">{dashboardStats.systemHealth}%</div>
              <p className="text-xs text-violet-700/70 dark:text-violet-200/70">All systems operational</p>
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
            <Card className="animate-hover-lift ring-1 ring-muted/40 dark:ring-muted/20">
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-hover-lift border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/10">
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>View hotspots and verified incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/map"><Button variant="outline" className="w-full">Open Live Map</Button></Link>
            </CardContent>
          </Card>
          <Card className="animate-hover-lift border border-sky-200/60 dark:border-sky-900/40 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/10">
            <CardHeader>
              <CardTitle>Social Media Monitor</CardTitle>
              <CardDescription>NLP-driven trends and sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/social"><Button variant="secondary" className="w-full">Open Monitor</Button></Link>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Coverage + Quick Actions */}
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

          {/* Quick Actions Card (Reporting removed) */}
          <Card className="animate-hover-lift bg-gradient-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common monitoring tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/map">
                <Button variant="outline" className="w-full p-3 flex items-center gap-3">
                  <MapPin className="h-5 w-5" /> View Live Map
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="secondary" className="w-full p-3 flex items-center gap-3">
                  <BarChart3 className="h-5 w-5" /> Analytics Summary
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>


        <div className="text-center text-sm text-muted-foreground bg-gradient-to-r from-transparent via-muted/20 to-transparent p-4 rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4 animate-pulse text-primary" />
            Last updated: {dashboardStats.lastUpdate} | INCOIS Ocean Hazard Platform
          </div>
        </div>
      </div>
      </>
  );
};

export default Index;
