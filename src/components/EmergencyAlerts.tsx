import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Siren, Clock, MapPin } from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'tsunami' | 'cyclone' | 'storm-surge';
  severity: 'critical' | 'high';
  title: string;
  location: string;
  timeRemaining: string;
  evacuationZones: string[];
}

const emergencyAlerts: EmergencyAlert[] = [
  {
    id: '1',
    type: 'tsunami',
    severity: 'critical',
    title: 'TSUNAMI WARNING - IMMEDIATE EVACUATION',
    location: 'Gujarat Coast',
    timeRemaining: '35 minutes',
    evacuationZones: ['Zone A', 'Zone B', 'Zone C']
  }
];

const EmergencyAlerts: React.FC = () => {
  return (
    <div className="space-y-4">
      {emergencyAlerts.map((alert) => (
        <Alert key={alert.id} className="border-destructive bg-destructive/10 animate-pulse-glow">
          <Siren className="h-5 w-5 text-destructive animate-pulse" />
          <AlertDescription>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-destructive text-lg">{alert.title}</h3>
                <Badge variant="destructive" className="animate-pulse">
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{alert.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>ETA: {alert.timeRemaining}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" className="animate-button-bounce">
                  View Evacuation Map
                </Button>
                <Button variant="outline" size="sm">
                  Emergency Contacts
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default EmergencyAlerts;