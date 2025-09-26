import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Send, Users, MapPin, Clock, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertHistory {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  channels: string[];
  sentAt: string;
  recipients: number;
  status: 'sent' | 'pending' | 'failed';
}

const mockAlertHistory: AlertHistory[] = [
  {
    id: '1',
    title: 'Tsunami Warning - Gujarat Coast',
    message: 'High waves expected along Gujarat coastline. All vessels advised to return to harbor immediately.',
    severity: 'critical',
    location: 'Gujarat',
    channels: ['SMS', 'Push', 'Social Media'],
    sentAt: '2 hours ago',
    recipients: 125000,
    status: 'sent'
  },
  {
    id: '2',
    title: 'Storm Surge Alert - Tamil Nadu',
    message: 'Moderate storm surge warning issued for Tamil Nadu coastal areas.',
    severity: 'high',
    location: 'Tamil Nadu',
    channels: ['Push', 'Email'],
    sentAt: '6 hours ago',
    recipients: 45000,
    status: 'sent'
  }
];

const AlertBroadcast: React.FC = () => {
  const { toast } = useToast();
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    severity: 'medium',
    location: '',
    channels: {
      sms: false,
      push: true,
      email: false,
      socialMedia: false,
      radio: false
    }
  });

  const handleChannelChange = (channel: string, checked: boolean) => {
    setAlertForm(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked
      }
    }));
  };

  const handleSendAlert = () => {
    if (!alertForm.title || !alertForm.message || !alertForm.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedChannels = Object.entries(alertForm.channels)
      .filter(([_, selected]) => selected)
      .map(([channel, _]) => channel);

    if (selectedChannels.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one broadcast channel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alert Broadcast Sent",
      description: `Emergency alert sent via ${selectedChannels.join(', ')} to ${alertForm.location}`,
    });

    // Reset form
    setAlertForm({
      title: '',
      message: '',
      severity: 'medium',
      location: '',
      channels: {
        sms: false,
        push: true,
        email: false,
        socialMedia: false,
        radio: false
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'pending': return 'secondary';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Emergency Alert Broadcast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alert Title *</label>
              <Input
                placeholder="Enter alert title..."
                value={alertForm.title}
                onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity Level *</label>
              <Select value={alertForm.severity} onValueChange={(value) => setAlertForm(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alert Message *</label>
            <Textarea
              placeholder="Enter detailed alert message..."
              value={alertForm.message}
              onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
            <div className="text-xs text-muted-foreground">
              {alertForm.message.length}/280 characters
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Location *</label>
            <Select value={alertForm.location} onValueChange={(value) => setAlertForm(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coastal Areas</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="odisha">Odisha</SelectItem>
                <SelectItem value="west-bengal">West Bengal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Broadcast Channels *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'sms', label: 'SMS', icon: '📱' },
                { key: 'push', label: 'Push Notifications', icon: '🔔' },
                { key: 'email', label: 'Email', icon: '📧' },
                { key: 'socialMedia', label: 'Social Media', icon: '📢' },
                { key: 'radio', label: 'Emergency Radio', icon: '📻' }
              ].map((channel) => (
                <div key={channel.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel.key}
                    checked={alertForm.channels[channel.key as keyof typeof alertForm.channels]}
                    onCheckedChange={(checked) => handleChannelChange(channel.key, !!checked)}
                  />
                  <label htmlFor={channel.key} className="text-sm font-medium cursor-pointer">
                    {channel.icon} {channel.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button onClick={handleSendAlert} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Emergency Alert
            </Button>
            <Button variant="outline">
              Schedule for Later
            </Button>
            <Button variant="ghost">
              Preview Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Alert History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlertHistory.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <Badge variant={getStatusColor(alert.status)} className="text-xs">
                    {alert.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {alert.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {alert.recipients.toLocaleString()} recipients
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {alert.sentAt}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Channels:</span>
                  {alert.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertBroadcast;