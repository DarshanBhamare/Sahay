import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Layers, 
  Search, 
  Filter, 
  AlertTriangle, 
  Waves, 
  Wind,
  Thermometer,
  Eye,
  Navigation,
  Maximize,
  Info
} from 'lucide-react';

interface HazardReport {
  id: string;
  type: 'tsunami' | 'storm-surge' | 'high-waves' | 'flooding' | 'erosion';
  severity: 1 | 2 | 3 | 4 | 5;
  location: { lat: number; lng: number; name: string };
  timestamp: string;
  reporter: string;
  status: 'pending' | 'verified' | 'false-alarm';
  description: string;
}

const mockHazardReports: HazardReport[] = [
  {
    id: '1',
    type: 'tsunami',
    severity: 5,
    location: { lat: 21.25, lng: 70.13, name: 'Dwarka, Gujarat' },
    timestamp: '2 hours ago',
    reporter: 'Local Fisherman',
    status: 'verified',
    description: 'Massive waves approaching coastline, immediate evacuation needed'
  },
  {
    id: '2',
    type: 'storm-surge',
    severity: 4,
    location: { lat: 13.08, lng: 80.27, name: 'Chennai, Tamil Nadu' },
    timestamp: '45 minutes ago',
    reporter: 'Coast Guard',
    status: 'verified',
    description: 'Storm surge warning, boats returning to harbor'
  },
  {
    id: '3',
    type: 'high-waves',
    severity: 3,
    location: { lat: 8.52, lng: 76.93, name: 'Kovalam, Kerala' },
    timestamp: '1 hour ago',
    reporter: 'Beach Resort',
    status: 'pending',
    description: 'Unusually high waves observed, tourists advised caution'
  },
  {
    id: '4',
    type: 'flooding',
    severity: 3,
    location: { lat: 22.57, lng: 88.36, name: 'Kolkata, West Bengal' },
    timestamp: '3 hours ago',
    reporter: 'City Official',
    status: 'verified',
    description: 'Coastal flooding in low-lying areas during high tide'
  }
];

import EnhancedMap from '@/components/EnhancedMap';

const InteractiveMap: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [mapLayer, setMapLayer] = useState('satellite');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [hazardTypeFilter, setHazardTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeatherLayer, setShowWeatherLayer] = useState(false);
  const [showWaveLayer, setShowWaveLayer] = useState(false);
  const [showWindLayer, setShowWindLayer] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const getHazardIcon = (type: string) => {
    switch (type) {
      case 'tsunami': return '🌊';
      case 'storm-surge': return '⛈️';
      case 'high-waves': return '🌊';
      case 'flooding': return '💧';
      case 'erosion': return '🏔️';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 5) return 'bg-red-600';
    if (severity >= 4) return 'bg-orange-500';
    if (severity >= 3) return 'bg-yellow-500';
    if (severity >= 2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'default';
      case 'pending': return 'secondary';
      case 'false-alarm': return 'outline';
      default: return 'outline';
    }
  };

  const filteredReports = mockHazardReports.filter(report => {
    const matchesSeverity = severityFilter === 'all' || report.severity.toString() === severityFilter;
    const matchesType = hazardTypeFilter === 'all' || report.type === hazardTypeFilter;
    const matchesSearch = searchQuery === '' || 
      report.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-gradient">
              Interactive Hazard Map
            </h1>
            <p className="text-muted-foreground">
              Real-time visualization of coastal hazards across the Indian Ocean
            </p>
          </div>
          <Button className="flex items-center gap-2 animate-button-bounce">
            <Navigation className="h-4 w-4" />
            Get Current Location
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="animate-hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Map Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Map Layer */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Map Layer</label>
                <Select value={mapLayer} onValueChange={setMapLayer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="street">Street Map</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity Level</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="5">Critical (5)</SelectItem>
                    <SelectItem value="4">High (4)</SelectItem>
                    <SelectItem value="3">Medium (3)</SelectItem>
                    <SelectItem value="2">Low (2)</SelectItem>
                    <SelectItem value="1">Minimal (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hazard Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hazard Type</label>
                <Select value={hazardTypeFilter} onValueChange={setHazardTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tsunami">Tsunami</SelectItem>
                    <SelectItem value="storm-surge">Storm Surge</SelectItem>
                    <SelectItem value="high-waves">High Waves</SelectItem>
                    <SelectItem value="flooding">Coastal Flooding</SelectItem>
                    <SelectItem value="erosion">Coastal Erosion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                {/* Layer Toggles */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Overlay Layers</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weather Conditions</span>
                      <Button 
                        variant={showWeatherLayer ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setShowWeatherLayer(!showWeatherLayer)}
                        className="animate-hover-scale"
                      >
                        <Thermometer className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wind Patterns</span>
                      <Button 
                        variant={showWindLayer ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setShowWindLayer(!showWindLayer)}
                        className="animate-hover-scale"
                      >
                        <Wind className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wave Heights</span>
                      <Button 
                        variant={showWaveLayer ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setShowWaveLayer(!showWaveLayer)}
                        className="animate-hover-scale"
                      >
                        <Waves className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>

            {/* Legend */}
            <Card className="animate-hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Severity Levels</div>
                {[5, 4, 3, 2, 1].map(level => (
                  <div key={level} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(level)}`} />
                    <span className="text-xs">Level {level} - {
                      level === 5 ? 'Critical' :
                      level === 4 ? 'High' :
                      level === 3 ? 'Medium' :
                      level === 2 ? 'Low' : 'Minimal'
                    }</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Hazard Types</div>
                {['tsunami', 'storm-surge', 'high-waves', 'flooding', 'erosion'].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-sm">{getHazardIcon(type)}</span>
                    <span className="text-xs capitalize">{type.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Main Map Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Enhanced Map Container */}
            <div className="h-[600px]">
              <EnhancedMap 
                selectedReport={selectedReport}
                onReportSelect={setSelectedReport}
                mapStyle={mapLayer as any}
                showWeatherLayer={showWeatherLayer}
                showWaveLayer={showWaveLayer}
                showWindLayer={showWindLayer}
              />
            </div>

            {/* Report Details */}
            {selectedReport && (
              <Card className="animate-scale-in animate-hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                    Hazard Report Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Location:</span>
                      <p className="font-medium">{selectedReport.location.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Hazard Type:</span>
                      <p className="font-medium capitalize flex items-center gap-2">
                        {getHazardIcon(selectedReport.type)} {selectedReport.type.replace('-', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Severity:</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(selectedReport.severity)}`} />
                        <span className="font-medium">Level {selectedReport.severity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Reported by:</span>
                      <p className="font-medium">{selectedReport.reporter}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      <Badge variant={getStatusColor(selectedReport.status)} className="ml-2">
                        {selectedReport.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Time:</span>
                      <p className="font-medium">{selectedReport.timestamp}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-muted-foreground">Description:</span>
                  <p className="mt-1 text-sm">{selectedReport.description}</p>
                </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="animate-button-bounce">View Full Report</Button>
                    <Button variant="outline" size="sm" className="animate-hover-scale">Share Location</Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)} className="animate-hover-scale">
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Reports Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="animate-hover-lift animate-card-glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 animate-pulse">{filteredReports.filter(r => r.severity >= 4).length}</div>
                  <div className="text-sm text-muted-foreground">High Severity</div>
                </CardContent>
              </Card>
              <Card className="animate-hover-lift animate-card-glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{filteredReports.filter(r => r.severity === 3).length}</div>
                  <div className="text-sm text-muted-foreground">Medium Severity</div>
                </CardContent>
              </Card>
              <Card className="animate-hover-lift animate-card-glow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredReports.filter(r => r.severity <= 2).length}</div>
                  <div className="text-sm text-muted-foreground">Low Severity</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredReports.length}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default InteractiveMap;