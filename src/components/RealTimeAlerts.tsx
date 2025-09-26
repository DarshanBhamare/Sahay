import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  MapPin, 
  Users, 
  Eye,
  EyeOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'tsunami' | 'storm-surge' | 'high-waves' | 'flooding' | 'erosion' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  timestamp: Date;
  isRead: boolean;
  affectedAreas: string[];
  estimatedImpact: number;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'tsunami',
    severity: 'critical',
    title: 'Tsunami Warning - Gujarat Coast',
    message: 'Massive underwater earthquake detected. 8-10m waves expected to reach coast in 45 minutes.',
    location: 'Dwarka, Gujarat',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    isRead: false,
    affectedAreas: ['Dwarka', 'Jamnagar', 'Rajkot'],
    estimatedImpact: 50000
  },
  {
    id: '2',
    type: 'storm-surge',
    severity: 'high',
    title: 'Storm Surge Alert - Chennai',
    message: 'Cyclonic storm approaching. 4-6m surge expected during high tide.',
    location: 'Chennai, Tamil Nadu',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    isRead: false,
    affectedAreas: ['Chennai', 'Mahabalipuram', 'Puducherry'],
    estimatedImpact: 25000
  },
  {
    id: '3',
    type: 'high-waves',
    severity: 'medium',
    title: 'High Wave Advisory - Kerala',
    message: 'Monsoon surge causing 3-4m waves. Fishing activities suspended.',
    location: 'Kovalam, Kerala',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: true,
    affectedAreas: ['Kovalam', 'Varkala', 'Alappuzha'],
    estimatedImpact: 5000
  },
  {
    id: '4',
    type: 'system',
    severity: 'low',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance on monitoring stations from 2:00-4:00 AM IST.',
    location: 'All Regions',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    affectedAreas: ['National Network'],
    estimatedImpact: 0
  }
];

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<Date>(new Date());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary'; // Orange-ish
      case 'medium': return 'default'; // Yellow-ish
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tsunami': return '🌊';
      case 'storm-surge': return '⛈️';
      case 'high-waves': return '🌊';
      case 'flooding': return '💧';
      case 'erosion': return '🏔️';
      case 'system': return '⚙️';
      default: return '⚠️';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: "All alerts marked as read",
      description: "Your alert list has been updated",
    });
  };

  const playAlertSound = () => {
    if (soundEnabled) {
      // In a real app, you'd play an actual sound file
      console.log('🔊 Alert sound played');
    }
  };

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddAlert = Math.random() < 0.1; // 10% chance every 30 seconds
      
      if (shouldAddAlert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ['tsunami', 'storm-surge', 'high-waves', 'flooding'][Math.floor(Math.random() * 4)] as any,
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          title: 'New Hazard Alert',
          message: 'Automated detection system has identified a potential coastal hazard.',
          location: ['Gujarat', 'Tamil Nadu', 'Kerala', 'Odisha'][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          isRead: false,
          affectedAreas: ['Coastal Areas'],
          estimatedImpact: Math.floor(Math.random() * 10000)
        };

        setAlerts(prev => [newAlert, ...prev]);
        setLastAlertTime(new Date());
        playAlertSound();
        
        toast({
          title: "New Alert",
          description: newAlert.title,
          variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const filteredAlerts = showOnlyUnread ? alerts.filter(alert => !alert.isRead) : alerts;
  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Card className="h-full animate-hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Real-Time Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 animate-pulse-glow">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8 p-0"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              className="h-8 w-8 p-0"
            >
              {showOnlyUnread ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Last update: {formatTimestamp(lastAlertTime)}
          </p>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No alerts to display</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer animate-hover-lift ${
                    !alert.isRead 
                      ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-lg">{getTypeIcon(alert.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold truncate">
                          {alert.title}
                        </h4>
                        <Badge 
                          variant={getSeverityColor(alert.severity)}
                          className="text-xs flex-shrink-0"
                        >
                          {getSeverityIcon(alert.severity)} {alert.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {alert.estimatedImpact > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.estimatedImpact.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {alert.affectedAreas.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {alert.affectedAreas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {alert.affectedAreas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{alert.affectedAreas.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {!alert.isRead && (
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealTimeAlerts;