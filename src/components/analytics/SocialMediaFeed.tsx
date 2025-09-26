import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart, Share2, TrendingUp, AlertTriangle } from 'lucide-react';

interface SocialPost {
  id: string;
  user: string;
  platform: 'twitter' | 'facebook' | 'instagram';
  content: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  location?: string;
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    user: 'CoastalResident_GJ',
    platform: 'twitter',
    content: 'Massive waves hitting the Gujarat coast near Dwarka! Never seen anything like this before. #TsunamiAlert #Gujarat',
    timestamp: '2 minutes ago',
    sentiment: 'negative',
    engagement: 847,
    location: 'Dwarka, Gujarat',
    verified: false,
    riskLevel: 'high'
  },
  {
    id: '2',
    user: 'FisherManTN',
    platform: 'facebook',
    content: 'Storm surge warning issued for Tamil Nadu coast. All boats returning to harbor immediately.',
    timestamp: '5 minutes ago',
    sentiment: 'neutral',
    engagement: 234,
    location: 'Chennai, Tamil Nadu',
    verified: true,
    riskLevel: 'medium'
  },
  {
    id: '3',
    user: 'KeralaTourism',
    platform: 'instagram',
    content: 'Beautiful sunset at Kovalam beach today! Perfect weather for visitors. #Kerala #Tourism',
    timestamp: '1 hour ago',
    sentiment: 'positive',
    engagement: 1205,
    location: 'Kovalam, Kerala',
    verified: true,
    riskLevel: 'low'
  }
];

const SocialMediaFeed: React.FC = () => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return '𝕏';
      case 'facebook': return 'f';
      case 'instagram': return '📷';
      default: return '📱';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Real-Time Social Media Feed
        </CardTitle>
        <Badge variant="outline" className="animate-pulse">
          Live
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {mockPosts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getPlatformIcon(post.platform)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">@{post.user}</span>
                    {post.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRiskColor(post.riskLevel)} className="text-xs">
                  {post.riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {post.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed">{post.content}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {Math.floor(post.engagement * 0.1)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {Math.floor(post.engagement * 0.7)}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {Math.floor(post.engagement * 0.2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                  {post.sentiment}
                </Badge>
                {post.location && (
                  <span className="text-muted-foreground">📍 {post.location}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialMediaFeed;