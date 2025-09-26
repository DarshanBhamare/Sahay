import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Server, Database, Users, Activity, Wifi, HardDrive, Cpu, AlertCircle } from 'lucide-react';

const systemMetrics = [
  { time: '00:00', cpu: 45, memory: 67, requests: 234 },
  { time: '04:00', cpu: 23, memory: 45, requests: 123 },
  { time: '08:00', cpu: 78, memory: 89, requests: 567 },
  { time: '12:00', cpu: 56, memory: 72, requests: 789 },
  { time: '16:00', cpu: 89, memory: 91, requests: 1234 },
  { time: '20:00', cpu: 67, memory: 78, requests: 876 },
];

const SystemMonitoring: React.FC = () => {
  const getHealthColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getHealthBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.warning) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs">
                    ✓ Operational
                  </Badge>
                </div>
              </div>
              <Server className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              99.9% uptime (30 days)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Database</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-xs">
                    ✓ Healthy
                  </Badge>
                </div>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Response time: 12ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <div className="text-2xl font-bold mt-1">2,847</div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                <div className="text-2xl font-bold mt-1 text-yellow-600">3</div>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              1 high, 2 medium
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Performance (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="hsl(var(--secondary))" name="Memory %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              API Requests (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current</span>
                <span className={getHealthColor(67, { warning: 70, critical: 85 })}>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average (24h)</span>
                <span className="text-muted-foreground">54%</span>
              </div>
              <Progress value={54} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground">
              Peak: 89% at 16:00
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current</span>
                <span className={getHealthColor(78, { warning: 80, critical: 90 })}>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available</span>
                <span className="text-muted-foreground">5.2 GB</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground">
              Total: 24 GB RAM
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Pool</span>
              <Badge variant="default" className="text-xs">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Query Performance</span>
              <Badge variant="default" className="text-xs">Good</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Usage</span>
              <span className="text-sm text-muted-foreground">234 GB / 500 GB</span>
            </div>
            
            <Progress value={47} className="h-2" />
            
            <div className="text-xs text-muted-foreground">
              Last backup: 2 hours ago
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Active System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium">High Memory Usage</div>
                  <div className="text-sm text-muted-foreground">Memory usage approaching 80% threshold</div>
                </div>
              </div>
              <Badge variant="secondary">Medium</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">API Rate Limit Warning</div>
                  <div className="text-sm text-muted-foreground">External API approaching rate limit</div>
                </div>
              </div>
              <Badge variant="destructive">High</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium">Disk Space Warning</div>
                  <div className="text-sm text-muted-foreground">Log partition at 75% capacity</div>
                </div>
              </div>
              <Badge variant="secondary">Medium</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;