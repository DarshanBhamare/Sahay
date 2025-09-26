import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp, MapPin } from 'lucide-react';

interface TrendingTopic {
  id: string;
  hashtag: string;
  mentions: number;
  trend: 'up' | 'down' | 'stable';
  location: string;
  category: 'warning' | 'info' | 'emergency';
}

const mockTrends: TrendingTopic[] = [
  {
    id: '1',
    hashtag: 'TsunamiAlert',
    mentions: 12843,
    trend: 'up',
    location: 'Gujarat',
    category: 'emergency'
  },
  {
    id: '2',
    hashtag: 'StormSurge',
    mentions: 8621,
    trend: 'up',
    location: 'Tamil Nadu',
    category: 'warning'
  },
  {
    id: '3',
    hashtag: 'HighWaves',
    mentions: 5432,
    trend: 'stable',
    location: 'Kerala',
    category: 'warning'
  },
  {
    id: '4',
    hashtag: 'CoastalFlooding',
    mentions: 3891,
    trend: 'down',
    location: 'West Bengal',
    category: 'info'
  },
  {
    id: '5',
    hashtag: 'INCOIS',
    mentions: 2764,
    trend: 'up',
    location: 'All India',
    category: 'info'
  }
];

const TrendingTopics: React.FC = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${(num / 1000).toFixed(1)}k`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Trending Hashtags & Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTrends.map((trend) => (
            <div key={trend.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {getTrendIcon(trend.trend)}
                  <Hash className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">#{trend.hashtag}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {trend.location}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-sm">{formatNumber(trend.mentions)}</div>
                  <div className="text-xs text-muted-foreground">mentions</div>
                </div>
                <Badge variant={getCategoryColor(trend.category)} className="text-xs">
                  {trend.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium mb-2">Word Cloud Preview</div>
          <div className="flex flex-wrap gap-2">
            {['tsunami', 'waves', 'alert', 'coastal', 'warning', 'emergency', 'surge', 'flooding'].map((word, index) => (
              <span 
                key={word}
                className={`px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium`}
                style={{
                  fontSize: `${0.7 + (index % 3) * 0.1}rem`,
                  opacity: 1 - (index * 0.05)
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;