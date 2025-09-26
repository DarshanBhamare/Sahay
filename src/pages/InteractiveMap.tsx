import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
  Info,
  Activity,
  Clock,
  Users,
  RefreshCw,
  Locate,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

// Fix Leaflet default markers
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HazardReport {
  id: string;
  type: 'tsunami' | 'storm-surge' | 'high-waves' | 'flooding' | 'erosion';
  severity: 1 | 2 | 3 | 4 | 5;
  location: { lat: number; lng: number; name: string };
  timestamp: string;
  reporter: string;
  status: 'pending' | 'verified' | 'false-alarm';
  description: string;
  affectedPeople?: number;
  verifiedBy?: string;
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
    description: 'Massive waves approaching coastline, immediate evacuation needed',
    affectedPeople: 15000,
    verifiedBy: 'Coast Guard Station'
  },
  {
    id: '2',
    type: 'storm-surge',
    severity: 4,
    location: { lat: 13.08, lng: 80.27, name: 'Chennai, Tamil Nadu' },
    timestamp: '45 minutes ago',
    reporter: 'Coast Guard',
    status: 'verified',
    description: 'Storm surge warning, boats returning to harbor',
    affectedPeople: 8500,
    verifiedBy: 'Regional Authority'
  },
  {
    id: '3',
    type: 'high-waves',
    severity: 3,
    location: { lat: 8.52, lng: 76.93, name: 'Kovalam, Kerala' },
    timestamp: '1 hour ago',
    reporter: 'Beach Resort',
    status: 'pending',
    description: 'Unusually high waves observed, tourists advised caution',
    affectedPeople: 200
  },
  {
    id: '4',
    type: 'flooding',
    severity: 3,
    location: { lat: 22.57, lng: 88.36, name: 'Kolkata, West Bengal' },
    timestamp: '3 hours ago',
    reporter: 'City Official',
    status: 'verified',
    description: 'Coastal flooding in low-lying areas during high tide',
    affectedPeople: 5000,
    verifiedBy: 'Municipal Authority'
  },
  {
    id: '5',
    type: 'erosion',
    severity: 2,
    location: { lat: 15.55, lng: 73.75, name: 'Panaji, Goa' },
    timestamp: '5 hours ago',
    reporter: 'Environmental Agency',
    status: 'verified',
    description: 'Accelerated coastal erosion observed after recent storms',
    affectedPeople: 100
  }
];

// Custom marker icons for different severity levels
const createCustomIcon = (severity: number, type: string) => {
  const colors = {
    5: '#dc2626', // red-600
    4: '#ea580c', // orange-600
    3: '#ca8a04', // yellow-600
    2: '#2563eb', // blue-600
    1: '#16a34a'  // green-600
  };

  const color = colors[severity as keyof typeof colors];
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
      ">
        ${severity}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Map Controls Component
const MapControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
  onLocate: () => void;
}> = ({ onZoomIn, onZoomOut, onCenter, onLocate }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={onZoomIn}
        className="shadow-lg hover:shadow-xl transition-all bg-white hover:bg-gray-50"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onZoomOut}
        className="shadow-lg hover:shadow-xl transition-all bg-white hover:bg-gray-50"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onCenter}
        className="shadow-lg hover:shadow-xl transition-all bg-white hover:bg-gray-50"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={onLocate}
        className="shadow-lg hover:shadow-xl transition-all bg-white hover:bg-gray-50"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Map Event Handler Component
const MapEventHandler: React.FC<{
  onMapReady: (map: L.Map) => void;
}> = ({ onMapReady }) => {
  const map = useMap();
  
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useMapEvents({
    locationfound: (e) => {
      map.flyTo(e.latlng, 12);
    },
    locationerror: (e) => {
      console.error('Location error:', e.message);
    }
  });

  return null;
};

// Weather Layer Component
const WeatherLayer: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <TileLayer
      url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_OPENWEATHER_API_KEY"
      opacity={0.6}
      attribution="Weather data © OpenWeatherMap"
    />
  );
};

const InteractiveMap: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [mapLayer, setMapLayer] = useState('satellite');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [hazardTypeFilter, setHazardTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeatherLayer, setShowWeatherLayer] = useState(false);
  const [showWaveLayer, setShowWaveLayer] = useState(false);
  const [showWindLayer, setShowWindLayer] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  // Center position for Indian Ocean
  const center: [number, number] = [15.0, 75.0];
  const zoom = 6;

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Map tile layer URLs
  const getTileLayerUrl = (layer: string) => {
    switch (layer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'street':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'hybrid':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = (layer: string) => {
    switch (layer) {
      case 'satellite':
        return '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)';
      case 'street':
        return '© OpenStreetMap contributors';
      case 'hybrid':
        return '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      default:
        return '© OpenStreetMap contributors';
    }
  };

  const getHazardIcon = (type: string) => {
    const icons = {
      'tsunami': '🌊',
      'storm-surge': '⛈️',
      'high-waves': '🌊',
      'flooding': '💧',
      'erosion': '🏔️'
    };
    return icons[type as keyof typeof icons] || '⚠️';
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

  const handleMapReady = useCallback((mapInstance: L.Map) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  }, []);

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const handleCenter = () => {
    if (map) map.setView(center, zoom);
  };

  const handleLocate = () => {
    if (map) {
      map.locate({ setView: true, maxZoom: 12 });
    }
  };

  const handleReportSelect = useCallback((report: HazardReport | null) => {
    setSelectedReport(report);
    if (report && map) {
      map.setView([report.location.lat, report.location.lng], 12);
    }
  }, [map]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                🌊 Interactive Hazard Map
              </h1>
              <p className="text-blue-100 text-lg">
                Real-time visualization of coastal hazards across the Indian Ocean
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {filteredReports.length} active reports
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Live monitoring
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setLastUpdate(new Date())}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-lg transition-all duration-300 hover:scale-105"
                onClick={handleLocate}
              >
                <Navigation className="h-4 w-4 mr-2" />
                My Location
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Enhanced Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Map Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-2 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <Separator />

                {/* Map Layer */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Map Layer</label>
                  <Select value={mapLayer} onValueChange={setMapLayer}>
                    <SelectTrigger className="border-2 focus:border-blue-500 transition-all duration-300 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="satellite">🛰️ Satellite</SelectItem>
                      <SelectItem value="terrain">🏔️ Terrain</SelectItem>
                      <SelectItem value="street">🗺️ Street Map</SelectItem>
                      <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Filters */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Severity Level</label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="border-2 focus:border-blue-500 transition-all duration-300 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="5">🔴 Critical (5)</SelectItem>
                        <SelectItem value="4">🟠 High (4)</SelectItem>
                        <SelectItem value="3">🟡 Medium (3)</SelectItem>
                        <SelectItem value="2">🔵 Low (2)</SelectItem>
                        <SelectItem value="1">🟢 Minimal (1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Hazard Type</label>
                    <Select value={hazardTypeFilter} onValueChange={setHazardTypeFilter}>
                      <SelectTrigger className="border-2 focus:border-blue-500 transition-all duration-300 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="tsunami">🌊 Tsunami</SelectItem>
                        <SelectItem value="storm-surge">⛈️ Storm Surge</SelectItem>
                        <SelectItem value="high-waves">🌊 High Waves</SelectItem>
                        <SelectItem value="flooding">💧 Coastal Flooding</SelectItem>
                        <SelectItem value="erosion">🏔️ Coastal Erosion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Layer Toggles */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">Overlay Layers</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Weather (28°C)</span>
                      </div>
                      <Switch
                        checked={showWeatherLayer}
                        onCheckedChange={setShowWeatherLayer}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Wind (15 km/h)</span>
                      </div>
                      <Switch
                        checked={showWindLayer}
                        onCheckedChange={setShowWindLayer}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Waves className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Waves (2.5m)</span>
                      </div>
                      <Switch
                        checked={showWaveLayer}
                        onCheckedChange={setShowWaveLayer}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Legend */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700">Severity Levels</div>
                  {[5, 4, 3, 2, 1].map(level => (
                    <div key={level} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-4 h-4 rounded-full shadow-md ${getSeverityColor(level)}`} />
                      <span className="text-sm font-medium">
                        Level {level} - {
                          level === 5 ? 'Critical' :
                          level === 4 ? 'High' :
                          level === 3 ? 'Medium' :
                          level === 2 ? 'Low' : 'Minimal'
                        }
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700">Hazard Types</div>
                  {['tsunami', 'storm-surge', 'high-waves', 'flooding', 'erosion'].map(type => (
                    <div key={type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-lg">{getHazardIcon(type)}</span>
                      <span className="text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map Container */}
            <div className="h-[600px] relative">
              <Card className="h-full shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-0 h-full">
                  <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      url={getTileLayerUrl(mapLayer)}
                      attribution={getTileLayerAttribution(mapLayer)}
                    />
                    
                    {/* Weather Layer */}
                    <WeatherLayer show={showWeatherLayer} />
                    
                    {/* Hazard Markers */}
                    {filteredReports.map((report) => (
                      <Marker
                        key={report.id}
                        position={[report.location.lat, report.location.lng]}
                        icon={createCustomIcon(report.severity, report.type)}
                        eventHandlers={{
                          click: () => handleReportSelect(report)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[250px]">
                            <h3 className="font-bold text-lg mb-2">{report.location.name}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Type:</span>
                                <span className="capitalize">{report.type.replace('-', ' ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Severity:</span>
                                <span className="font-bold" style={{ 
                                  color: report.severity >= 5 ? '#dc2626' : 
                                         report.severity >= 4 ? '#ea580c' :
                                         report.severity >= 3 ? '#ca8a04' :
                                         report.severity >= 2 ? '#2563eb' : '#16a34a'
                                }}>
                                  Level {report.severity}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  report.status === 'verified' ? 'bg-green-100 text-green-800' :
                                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status}
                                </span>
                              </div>
                              <div className="mt-2">
                                <span className="font-medium">Description:</span>
                                <p className="text-xs mt-1 text-gray-600">{report.description}</p>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Current Location Marker */}
                    {currentLocation && (
                      <Marker position={[currentLocation.lat, currentLocation.lng]}>
                        <Popup>Your current location</Popup>
                      </Marker>
                    )}
                    
                    <MapEventHandler onMapReady={handleMapReady} />
                  </MapContainer>
                  
                  {/* Map Controls Overlay */}
                  <MapControls
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onCenter={handleCenter}
                    onLocate={handleLocate}
                  />
                  
                  {/* Map Info Overlay */}
                  <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
                    <Badge variant="secondary" className="shadow-lg bg-black/80 text-white border-0">
                      {mapLayer.charAt(0).toUpperCase() + mapLayer.slice(1)} View
                    </Badge>
                    <Badge variant="secondary" className="shadow-lg bg-black/80 text-white border-0">
                      {filteredReports.length} Reports
                    </Badge>
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="absolute top-4 left-4 z-[1000]">
                    <div className="flex items-center gap-2 bg-black/80 text-white px-3 py-1 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs font-medium">LIVE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Report Details */}
            {selectedReport && (
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Hazard Report Details
                    </div>
                    <Badge variant={getStatusColor(selectedReport.status)} className="bg-white/20 border-white/30">
                      {selectedReport.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <span className="text-sm font-semibold text-blue-700">Location:</span>
                        <p className="font-bold text-lg text-blue-900">{selectedReport.location.name}</p>
                        <p className="text-xs text-blue-600">
                          📍 {selectedReport.location.lat.toFixed(4)}, {selectedReport.location.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <span className="text-sm font-semibold text-orange-700">Hazard Type:</span>
                        <p className="font-bold text-lg capitalize flex items-center gap-2 text-orange-900">
                          {getHazardIcon(selectedReport.type)} {selectedReport.type.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <span className="text-sm font-semibold text-red-700">Severity:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-6 h-6 rounded-full ${getSeverityColor(selectedReport.severity)} shadow-md`} />
                          <span className="font-bold text-lg text-red-900">Level {selectedReport.severity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <span className="text-sm font-semibold text-green-700">Reported by:</span>
                        <p className="font-bold text-lg text-green-900">{selectedReport.reporter}</p>
                      </div>
                      {selectedReport.verifiedBy && (
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <span className="text-sm font-semibold text-purple-700">Verified by:</span>
                          <p className="font-bold text-lg text-purple-900">{selectedReport.verifiedBy}</p>
                        </div>
                      )}
                      <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                        <span className="text-sm font-semibold text-gray-700">Time:</span>
                        <p className="font-bold text-lg text-gray-900">{selectedReport.timestamp}</p>
                      </div>
                      {selectedReport.affectedPeople && (
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <span className="text-sm font-semibold text-yellow-700">Affected People:</span>
                          <p className="font-bold text-lg text-yellow-900">{selectedReport.affectedPeople.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
                    <span className="text-sm font-semibold text-slate-700">Description:</span>
                    <p className="mt-2 text-slate-800 leading-relaxed">{selectedReport.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-105">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                    <Button variant="outline" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <MapPin className="h-4 w-4 mr-2" />
                      Share Location
                    </Button>
                    <Button variant="outline" className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedReport(null)}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      ✕ Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-red-500 to-pink-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold">{filteredReports.filter(r => r.severity >= 4).length}</div>
                  <div className="text-sm opacity-90 font-medium">Critical & High</div>
                  <AlertTriangle className="h-6 w-6 mx-auto mt-2 opacity-80" />
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-500 to-orange-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold">{filteredReports.filter(r => r.severity === 3).length}</div>
                  <div className="text-sm opacity-90 font-medium">Medium Severity</div>
                  <AlertTriangle className="h-6 w-6 mx-auto mt-2 opacity-80" />
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold">{filteredReports.filter(r => r.severity <= 2).length}</div>
                  <div className="text-sm opacity-90 font-medium">Low Severity</div>
                  <Activity className="h-6 w-6 mx-auto mt-2 opacity-80" />
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold">{filteredReports.length}</div>
                  <div className="text-sm opacity-90 font-medium">Total Reports</div>
                  <MapPin className="h-6 w-6 mx-auto mt-2 opacity-80" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
