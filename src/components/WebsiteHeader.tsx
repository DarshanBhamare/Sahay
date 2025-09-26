import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import BackButton from './BackButton';

const WebsiteHeader: React.FC = () => {
  const { state, setTheme } = useApp();

  const toggleTheme = () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <BackButton />
          
          {/* INCOIS Branding */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">IO</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Ocean Hazard Monitor</h1>
              <p className="text-xs text-muted-foreground">INCOIS - Indian National Centre for Ocean Information Services</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Live Status Badge */}
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Live Monitoring
          </Badge>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {state.theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;