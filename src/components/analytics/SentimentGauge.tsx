import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  panicLevel: number;
}

const mockSentimentData: SentimentData = {
  positive: 25,
  negative: 45,
  neutral: 30,
  panicLevel: 68
};

const SentimentGauge: React.FC = () => {
  const getPanicLevelColor = (level: number) => {
    if (level >= 70) return 'text-red-600';
    if (level >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPanicLevelIcon = (level: number) => {
    if (level >= 70) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (level >= 40) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-green-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Positive</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {mockSentimentData.positive}%
              </span>
            </div>
            <Progress value={mockSentimentData.positive} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Negative</span>
              </div>
              <span className="text-sm font-bold text-red-600">
                {mockSentimentData.negative}%
              </span>
            </div>
            <Progress value={mockSentimentData.negative} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Minus className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Neutral</span>
              </div>
              <span className="text-sm font-bold text-gray-600">
                {mockSentimentData.neutral}%
              </span>
            </div>
            <Progress value={mockSentimentData.neutral} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Panic Level Gauge */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Public Panic Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted-foreground opacity-20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(mockSentimentData.panicLevel / 100) * 314} 314`}
                  className={getPanicLevelColor(mockSentimentData.panicLevel)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getPanicLevelColor(mockSentimentData.panicLevel)}`}>
                    {mockSentimentData.panicLevel}%
                  </div>
                  <div className="text-xs text-muted-foreground">Panic Level</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {getPanicLevelIcon(mockSentimentData.panicLevel)}
            <span className={`font-medium ${getPanicLevelColor(mockSentimentData.panicLevel)}`}>
              {mockSentimentData.panicLevel >= 70 ? 'HIGH ALERT' : 
               mockSentimentData.panicLevel >= 40 ? 'MODERATE' : 'CALM'}
            </span>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Based on social media sentiment analysis and keyword frequency
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentGauge;