import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // If there's history, go back, otherwise go to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        aria-label="Go back"
        className="hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleHome}
        aria-label="Go to home"
        className="hover:bg-accent hover:text-accent-foreground"
      >
        <Home className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default BackButton;