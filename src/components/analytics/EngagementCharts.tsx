import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, MessageSquare } from 'lucide-react';

const hourlyData = [
  { hour: '00:00', social: 45, official: 12 },
  { hour: '04:00', social: 23, official: 8 },
  { hour: '08:00', social: 189, official: 34 },
  { hour: '12:00', social: 267, official: 45 },
  { hour: '16:00', social: 432, official: 67 },
  { hour: '20:00', social: 389, official: 54 },
];

const platformData = [
  { name: 'Twitter', value: 45, color: '#1DA1F2' },
  { name: 'Facebook', value: 30, color: '#4267B2' },
  { name: 'Instagram', value: 20, color: '#E4405F' },
  { name: 'Others', value: 5, color: '#34D399' }
];

const EngagementCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Social vs Official Reports Timeline */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Social Media vs Official Reports (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="social" fill="hsl(var(--primary))" name="Social Media Reports" />
              <Bar dataKey="official" fill="hsl(var(--secondary))" name="Official Reports" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Total Mentions</div>
                <div className="text-sm text-muted-foreground">Last 24 hours</div>
              </div>
              <div className="text-2xl font-bold text-primary">34,521</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Avg. Response Time</div>
                <div className="text-sm text-muted-foreground">Official replies</div>
              </div>
              <div className="text-2xl font-bold text-green-600">12m</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Reach</div>
                <div className="text-sm text-muted-foreground">Estimated users</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">2.4M</div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Accuracy Score</div>
                <div className="text-sm text-muted-foreground">Information quality</div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">78%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementCharts;