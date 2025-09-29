import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const About: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">SIH25039 · Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/15 border-white/30">INCOIS</Badge>
            <Badge variant="outline" className="bg-white/15 border-white/30">Ministry of Earth Sciences</Badge>
            <Badge variant="outline" className="bg-white/15 border-white/30">Disaster Management</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About INCOIS</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            The Indian National Centre for Ocean Information Services (INCOIS), under the Ministry of Earth Sciences, provides
            ocean information and advisory services to support disaster risk reduction and maritime safety for coastal stakeholders.
            Early warning services cover hazards such as tsunamis, storm surges, high waves, swell surges, and coastal currents.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Background</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            India’s vast coastline is vulnerable to ocean hazards like tsunamis, storm surges, high waves, and abnormal sea behaviour.
            While agencies provide early warnings based on satellite data, sensors, and models; real-time field reporting from citizens
            and community networks is often unavailable or delayed. Public discussions on social media during hazard events remain an
            untapped yet critical source for situational awareness.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Requirements</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <ul className="list-disc pl-6 space-y-1">
            <li>Citizen reporting via mobile/web app with geotagged submissions and media uploads.</li>
            <li>Role-based access for citizens, officials, and analysts.</li>
            <li>Real-time dashboard to aggregate and visualize crowd reports.</li>
            <li>Interactive map with hotspots based on report density, keyword frequency, or verified incidents.</li>
            <li>Integration of social media feeds and NLP for classification, trend and sentiment analysis.</li>
            <li>Filters by location, event type, date, and source for validation and situational awareness.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Solution</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <ul className="list-disc pl-6 space-y-1">
            <li>Mobile + Web platform with registration and report submission interface.</li>
            <li>Map-based dashboard showing live crowd reports and social media activity.</li>
            <li>Dynamic hotspot generation and verified threat indicators.</li>
            <li>Backend API & database for data management and integration with early warning systems.</li>
            <li>NLP engine for detecting hazard-related posts, keywords, and engagement metrics.</li>
            <li>Multilingual support and offline data collection with sync.</li>
          </ul>
        </CardContent>
      </Card>

      <Separator />
      <div className="text-center text-xs text-muted-foreground">Problem ID: SIH25039 · Organization: Ministry of Earth Sciences (INCOIS)</div>
    </div>
  );
};

export default About;
