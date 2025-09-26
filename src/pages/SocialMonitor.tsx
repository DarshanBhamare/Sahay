import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  Eye, 
  MessageCircle,
  Share2,
  Heart,
  MoreVertical,
  MapPin,
  Clock,
  Target,
  Brain,
  Globe
} from 'lucide-react';
import WebsiteHeader from '@/components/WebsiteHeader';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube';
  user: {
    name: string;
    handle: string;
    verified: boolean;
    followers: number;
  };
  content: string;
  timestamp: string;
  location?: string;
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  confidence: number;
  language: string;
}

const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    user: {
      name: 'Coastal Resident',
      handle: '@coast_watch_gj',
      verified: false,
      followers: 1250
    },
    content: 'URGENT: Massive waves hitting Dwarka beach! Water level rising rapidly. Everyone evacuate immediately! #TsunamiAlert #Gujarat #Emergency',
    timestamp: '2 minutes ago',
    location: 'Dwarka, Gujarat',
    metrics: { likes: 342, shares: 156, comments: 89 },
    sentiment: 'negative',
    riskLevel: 'critical',
    categories: ['tsunami', 'evacuation', 'emergency'],
    confidence: 95,
    language: 'English'
  },
  {
    id: '2',
    platform: 'facebook',
    user: {
      name: 'Chennai Port Authority',
      handle: '@chennaiport',
      verified: true,
      followers: 45000
    },
    content: 'Storm surge warning issued for Chennai coast. All fishing vessels advised to return to harbor immediately. Coast Guard on high alert.',
    timestamp: '15 minutes ago',
    location: 'Chennai, Tamil Nadu',
    metrics: { likes: 234, shares: 89, comments: 45 },
    sentiment: 'neutral',
    riskLevel: 'high',
    categories: ['storm-surge', 'official', 'warning'],
    confidence: 88,
    language: 'English'
  },
  {
    id: '3',
    platform: 'instagram',
    user: {
      name: 'Kerala Tourism',
      handle: '@kerala_tourism',
      verified: true,
      followers: 2300000
    },
    content: 'Beautiful sunset at Kovalam beach today! Perfect conditions for visitors. Come experience God\'s Own Country! 🌅 #Kerala #Tourism #Beach',
    timestamp: '1 hour ago',
    location: 'Kovalam, Kerala',
    metrics: { likes: 1205, shares: 45, comments: 78 },
    sentiment: 'positive',
    riskLevel: 'low',
    categories: ['tourism', 'positive'],
    confidence: 92,
    language: 'English'
  },
  {
    id: '4',
    platform: 'twitter',
    user: {
      name: 'West Bengal Fisher',
      handle: '@fisherman_wb',
      verified: false,
      followers: 890
    },
    content: 'কলকাতার উপকূলে বন্যার পানি। অনেক এলাকা প্লাবিত। সরকারি সাহায্য প্রয়োজন। #WestBengal #Flooding #Help',
    timestamp: '45 minutes ago',
    location: 'Kolkata, West Bengal',
    metrics: { likes: 67, shares: 23, comments: 12 },
    sentiment: 'negative',
    riskLevel: 'medium',
    categories: ['flooding', 'help-needed'],
    confidence: 78,
    language: 'Bengali'
  },
  {
    id: '5',
    platform: 'youtube',
    user: {
      name: 'Mumbai Weather Update',
      handle: '@mumbaiweather',
      verified: false,
      followers: 15600
    },
    content: 'Live: High tide warning for Mumbai coast. Marine Drive experiencing rough seas. Citizens advised to avoid coastal areas.',
    timestamp: '30 minutes ago',
    location: 'Mumbai, Maharashtra',
    metrics: { likes: 189, shares: 34, comments: 56 },
    sentiment: 'neutral',
    riskLevel: 'medium',
    categories: ['high-tide', 'warning'],
    confidence: 85,
    language: 'English'
  }
];

const SocialMonitor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const filteredPosts = mockSocialPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    const matchesRisk = riskFilter === 'all' || post.riskLevel === riskFilter;
    const matchesSentiment = sentimentFilter === 'all' || post.sentiment === sentimentFilter;
    const matchesLocation = locationFilter === 'all' || post.location?.includes(locationFilter);
    
    return matchesSearch && matchesPlatform && matchesRisk && matchesSentiment && matchesLocation;
  });

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500';
      case 'facebook': return 'bg-blue-700';
      case 'instagram': return 'bg-pink-500';
      case 'youtube': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <>
      <WebsiteHeader />
      <div className="space-y-6 px-4 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media Monitor</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of social media for ocean hazard information
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Create Alert Rule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, users, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="West Bengal">West Bengal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Live Feed</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trending Topics</TabsTrigger>
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredPosts.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Risk Posts</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredPosts.reduce((sum, post) => sum + post.metrics.shares, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Shares</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(filteredPosts.reduce((sum, post) => sum + post.confidence, 0) / filteredPosts.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Feed */}
            <div className="lg:col-span-3 space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={`text-white ${getPlatformColor(post.platform)}`}>
                                {post.platform === 'twitter' ? '𝕏' : 
                                 post.platform === 'facebook' ? 'f' :
                                 post.platform === 'instagram' ? '📷' : '▶️'}
                              </AvatarFallback>
                            </Avatar>
                            {post.user.verified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.user.name}</span>
                              <span className="text-sm text-muted-foreground">{post.user.handle}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatNumber(post.user.followers)} followers</span>
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskColor(post.riskLevel)} className="text-xs">
                            {post.riskLevel.toUpperCase()}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">{post.content}</p>
                        
                        {post.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {post.location}
                          </div>
                        )}
                      </div>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{category}
                          </Badge>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {formatNumber(post.metrics.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {formatNumber(post.metrics.comments)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {formatNumber(post.metrics.shares)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                            {post.sentiment.toUpperCase()}
                          </span>
                          <span className="text-xs">
                            <Globe className="h-3 w-3 inline mr-1" />
                            {post.language}
                          </span>
                          <span className="text-xs">
                            <Brain className="h-3 w-3 inline mr-1" />
                            {post.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Positive</span>
                    <span className="text-green-600">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Negative</span>
                    <span className="text-red-600">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Neutral</span>
                    <span className="text-gray-600">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Level Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Critical</span>
                    <span className="text-red-600">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>High</span>
                    <span className="text-orange-600">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Medium</span>
                    <span className="text-yellow-600">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Low</span>
                    <span className="text-green-600">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">English</span>
                  <Badge variant="outline">65%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hindi</span>
                  <Badge variant="outline">15%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bengali</span>
                  <Badge variant="outline">8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tamil</span>
                  <Badge variant="outline">7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Others</span>
                  <Badge variant="outline">5%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="text-center py-12 text-muted-foreground">
            Trending topics analysis coming soon...
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="text-center py-12 text-muted-foreground">
            Alert rules configuration coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default SocialMonitor;