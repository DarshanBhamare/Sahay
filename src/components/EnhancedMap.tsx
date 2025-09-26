import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Eye, 
  Maximize, 
  AlertTriangle,
  Waves,
  Wind,
  Thermometer,
  Satellite,
  Map as MapIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface EnhancedMapProps {
  selectedReport?: HazardReport | null;
  onReportSelect?: (report: HazardReport | null) => void;
  mapStyle?: 'satellite' | 'street' | 'terrain' | 'hybrid';
  showWeatherLayer?: boolean;
  showWaveLayer?: boolean;
  showWindLayer?: boolean;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({
  selectedReport,
  onReportSelect,
  mapStyle = 'satellite',
  showWeatherLayer = false,
  showWaveLayer = false,
  showWindLayer = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  const getMapboxStyle = (style: string) => {
    switch (style) {
      case 'satellite': return 'mapbox://styles/mapbox/satellite-v9';
      case 'street': return 'mapbox://styles/mapbox/streets-v12';
      case 'terrain': return 'mapbox://styles/mapbox/outdoors-v12';
      case 'hybrid': return 'mapbox://styles/mapbox/satellite-streets-v12';
      default: return 'mapbox://styles/mapbox/satellite-v9';
    }
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 5: return '#dc2626'; // Red
      case 4: return '#ea580c'; // Orange
      case 3: return '#ca8a04'; // Yellow
      case 2: return '#2563eb'; // Blue
      case 1: return '#16a34a'; // Green
      default: return '#6b7280'; // Gray
    }
  };

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              duration: 2000
            });
            
            // Add user location marker
            new mapboxgl.Marker({ color: '#22c55e' })
              .setLngLat([longitude, latitude])
              .setPopup(new mapboxgl.Popup().setHTML('<p>Your Location</p>'))
              .addTo(map.current);
          }
          
          toast({
            title: "Location Found",
            description: "Map centered on your current location",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // For demo purposes, using a placeholder token message
    if (!mapboxToken) {
      // Create a fallback map without Mapbox
      const fallbackElement = document.createElement('div');
      fallbackElement.className = 'h-full w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden rounded-lg flex items-center justify-center';
      fallbackElement.innerHTML = `
        <div class="text-center text-white p-8">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">Enhanced Map View</h3>
          <p class="text-sm opacity-90">Interactive map with hazard markers</p>
          <p class="text-xs opacity-75 mt-2">Connect Mapbox API for full functionality</p>
        </div>
      `;
      
      if (mapContainer.current.firstChild) {
        mapContainer.current.removeChild(mapContainer.current.firstChild);
      }
      mapContainer.current.appendChild(fallbackElement);
      
      // Add interactive markers to fallback
      mockHazardReports.forEach((report, index) => {
        const marker = document.createElement('div');
        marker.className = 'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow';
        marker.style.left = `${20 + index * 15}%`;
        marker.style.top = `${30 + index * 10}%`;
        marker.innerHTML = `
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300 hover:scale-125" 
               style="background-color: ${getSeverityColor(report.severity)}">
            ${report.severity}
          </div>
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            ${report.location.name}
          </div>
        `;
        
        marker.addEventListener('click', () => {
          onReportSelect?.(report);
          toast({
            title: "Hazard Selected",
            description: `${report.type.replace('-', ' ')} at ${report.location.name}`,
          });
        });
        
        fallbackElement.appendChild(marker);
      });
      
      setIsLoading(false);
      return;
    }

    // Initialize Mapbox map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapboxStyle(mapStyle),
      center: [77.2090, 28.6139], // Center on India
      zoom: 5,
      pitch: 45,
    });

    map.current.on('load', () => {
      setIsLoading(false);
      addHazardMarkers();
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  };

  const addHazardMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    mockHazardReports.forEach((report) => {
      const el = document.createElement('div');
      el.className = 'hazard-marker animate-pulse-glow';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${getSeverityColor(report.severity)};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      `;
      el.textContent = report.severity.toString();
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h4 class="font-semibold text-sm mb-1">${getHazardIcon(report.type)} ${report.type.replace('-', ' ')}</h4>
          <p class="text-xs text-gray-600 mb-2">${report.location.name}</p>
          <p class="text-xs mb-2">${report.description}</p>
          <div class="flex items-center justify-between text-xs">
            <span class="px-2 py-1 rounded" style="background-color: ${getSeverityColor(report.severity)}; color: white;">
              Level ${report.severity}
            </span>
            <span class="text-gray-500">${report.timestamp}</span>
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.location.lng, report.location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onReportSelect?.(report);
      });

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    initializeMap();
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(getMapboxStyle(mapStyle));
    }
  }, [mapStyle]);

  return (
    <Card className="relative h-full">
      <CardContent className="p-0 h-full">
        <div 
          ref={mapContainer}
          className="h-full w-full rounded-lg relative overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading enhanced map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="animate-hover-scale"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="animate-hover-scale">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" className="animate-hover-scale">
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        {/* Layer Indicators */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <Badge variant="secondary" className="animate-hover-lift">
            <MapIcon className="h-3 w-3 mr-1" />
            {mapStyle.charAt(0).toUpperCase() + mapStyle.slice(1)}
          </Badge>
          {showWeatherLayer && (
            <Badge variant="outline" className="animate-hover-lift">
              <Thermometer className="h-3 w-3 mr-1" />
              Weather
            </Badge>
          )}
          {showWaveLayer && (
            <Badge variant="outline" className="animate-hover-lift">
              <Waves className="h-3 w-3 mr-1" />
              Waves
            </Badge>
          )}
          {showWindLayer && (
            <Badge variant="outline" className="animate-hover-lift">
              <Wind className="h-3 w-3 mr-1" />
              Wind
            </Badge>
          )}
        </div>

        {/* Mapbox Token Input (for demo) */}
        {!mapboxToken && (
          <div className="absolute top-4 left-4 z-20">
            <Card className="p-3 bg-background/95 backdrop-blur-sm">
              <div className="text-xs text-muted-foreground mb-2">
                Enter Mapbox token for full functionality:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="pk.ey..."
                  className="text-xs px-2 py-1 border rounded flex-1"
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <Button 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    if (mapboxToken) {
                      initializeMap();
                    }
                  }}
                >
                  Connect
                </Button>
              </div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMap;