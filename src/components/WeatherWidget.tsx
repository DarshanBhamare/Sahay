import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye,
  Compass,
  Waves,
  Zap
} from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  waveHeight: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  forecast: {
    time: string;
    temp: number;
    condition: string;
    waves: number;
  }[];
}

const mockWeatherData: WeatherData[] = [
  {
    location: 'Dwarka, Gujarat',
    temperature: 28,
    feelsLike: 32,
    humidity: 78,
    windSpeed: 25,
    windDirection: 225,
    visibility: 8,
    pressure: 1008,
    uvIndex: 7,
    waveHeight: 3.2,
    condition: 'stormy',
    forecast: [
      { time: '12:00', temp: 29, condition: 'Stormy', waves: 3.5 },
      { time: '15:00', temp: 30, condition: 'Heavy Rain', waves: 4.1 },
      { time: '18:00', temp: 27, condition: 'Rain', waves: 3.8 },
      { time: '21:00', temp: 25, condition: 'Cloudy', waves: 3.2 }
    ]
  },
  {
    location: 'Chennai, Tamil Nadu',
    temperature: 31,
    feelsLike: 36,
    humidity: 85,
    windSpeed: 18,
    windDirection: 180,
    visibility: 12,
    pressure: 1012,
    uvIndex: 8,
    waveHeight: 2.1,
    condition: 'rainy',
    forecast: [
      { time: '12:00', temp: 32, condition: 'Partly Cloudy', waves: 2.3 },
      { time: '15:00', temp: 33, condition: 'Rain', waves: 2.8 },
      { time: '18:00', temp: 30, condition: 'Heavy Rain', waves: 3.1 },
      { time: '21:00', temp: 28, condition: 'Rain', waves: 2.5 }
    ]
  },
  {
    location: 'Kovalam, Kerala',
    temperature: 26,
    feelsLike: 29,
    humidity: 82,
    windSpeed: 12,
    windDirection: 270,
    visibility: 15,
    pressure: 1015,
    uvIndex: 6,
    waveHeight: 1.8,
    condition: 'cloudy',
    forecast: [
      { time: '12:00', temp: 27, condition: 'Cloudy', waves: 2.0 },
      { time: '15:00', temp: 28, condition: 'Partly Cloudy', waves: 2.2 },
      { time: '18:00', temp: 26, condition: 'Cloudy', waves: 1.9 },
      { time: '21:00', temp: 24, condition: 'Clear', waves: 1.6 }
    ]
  }
];

const WeatherWidget: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [currentData, setCurrentData] = useState(mockWeatherData[0]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy':
      case 'rain':
      case 'heavy rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'stormy':
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'cloudy': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'rainy': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'stormy': return 'bg-gradient-to-r from-purple-500 to-red-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-600' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (index <= 7) return { level: 'High', color: 'text-orange-600' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        waveHeight: Math.max(0.5, prev.waveHeight + (Math.random() - 0.5) * 0.5),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 3),
        humidity: Math.max(30, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5))
      }));
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentData(mockWeatherData[selectedLocation]);
  }, [selectedLocation]);

  const uvData = getUVLevel(currentData.uvIndex);

  return (
    <Card className="h-full animate-hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon(currentData.condition)}
            Weather & Sea Conditions
          </div>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardTitle>
        
        {/* Location Selector */}
        <div className="flex gap-1 mt-2">
          {mockWeatherData.map((data, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(index)}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                selectedLocation === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {data.location.split(',')[0]}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Conditions */}
        <div className={`p-4 rounded-lg text-white ${getConditionColor(currentData.condition)} animate-gradient`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold">{currentData.location}</h3>
              <p className="text-sm opacity-90">
                {currentData.condition.charAt(0).toUpperCase() + currentData.condition.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(currentData.temperature)}°C</div>
              <div className="text-sm opacity-90">Feels {Math.round(currentData.feelsLike)}°C</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Wind</span>
                  <span className="font-medium">{Math.round(currentData.windSpeed)} km/h</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Compass className="h-3 w-3" />
                  {getWindDirection(currentData.windDirection)} ({currentData.windDirection}°)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Humidity</span>
                  <span className="font-medium">{Math.round(currentData.humidity)}%</span>
                </div>
                <Progress value={currentData.humidity} className="h-1 mt-1" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Visibility</span>
                  <span className="font-medium">{currentData.visibility} km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Wave Height</span>
                  <span className="font-medium">{currentData.waveHeight.toFixed(1)}m</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentData.waveHeight > 3 ? 'High' : currentData.waveHeight > 2 ? 'Moderate' : 'Low'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Pressure</span>
                  <span className="font-medium">{currentData.pressure} hPa</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>UV Index</span>
                  <span className={`font-medium ${uvData.color}`}>{currentData.uvIndex}</span>
                </div>
                <div className={`text-xs ${uvData.color}`}>{uvData.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div>
          <h4 className="text-sm font-medium mb-2">Today's Forecast</h4>
          <div className="grid grid-cols-4 gap-2">
            {currentData.forecast.map((item, index) => (
              <div key={index} className="text-center p-2 rounded bg-muted/30 animate-hover-scale">
                <div className="text-xs text-muted-foreground mb-1">{item.time}</div>
                <div className="mb-1">{getWeatherIcon(item.condition)}</div>
                <div className="text-xs font-medium">{item.temp}°</div>
                <div className="text-xs text-blue-600">{item.waves}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;