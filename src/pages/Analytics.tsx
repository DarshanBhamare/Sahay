import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialMediaFeed from '@/components/analytics/SocialMediaFeed';
import SentimentGauge from '@/components/analytics/SentimentGauge';
import TrendingTopics from '@/components/analytics/TrendingTopics';
import EngagementCharts from '@/components/analytics/EngagementCharts';
import { BarChart3, TrendingUp, MessageSquare, Users } from 'lucide-react';
import WebsiteHeader from '@/components/WebsiteHeader';

const Analytics: React.FC = () => {
  return (
    <>
      <WebsiteHeader />
      <div className="space-y-6 px-4 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media Analytics</h1>
          <p className="text-muted-foreground">
            Monitor social media activity and public sentiment in real-time
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SocialMediaFeed />
            </div>
            <div className="space-y-6">
              <TrendingTopics />
            </div>
          </div>
          <SentimentGauge />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <SentimentGauge />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SocialMediaFeed />
            <TrendingTopics />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <EngagementCharts />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendingTopics />
            <SocialMediaFeed />
          </div>
          <EngagementCharts />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default Analytics;