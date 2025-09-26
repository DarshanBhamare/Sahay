import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  sidebarCollapsed: boolean;
  theme: ThemeMode;
  highContrast: boolean;
  language: string;
  notifications: {
    sound: boolean;
    push: boolean;
    email: boolean;
  };
}

interface AppContextType {
  state: AppState;
  toggleSidebar: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleHighContrast: () => void;
  setLanguage: (language: string) => void;
  updateNotificationSettings: (settings: Partial<AppState['notifications']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    sidebarCollapsed: false,
    theme: 'system',
    highContrast: false,
    language: 'en',
    notifications: {
      sound: true,
      push: true,
      email: false,
    },
  });

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const setTheme = (theme: ThemeMode) => {
    setState(prev => ({ ...prev, theme }));
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const toggleHighContrast = () => {
    setState(prev => ({ ...prev, highContrast: !prev.highContrast }));
    document.documentElement.classList.toggle('high-contrast');
  };

  const setLanguage = (language: string) => {
    setState(prev => ({ ...prev, language }));
  };

  const updateNotificationSettings = (settings: Partial<AppState['notifications']>) => {
    setState(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...settings }
    }));
  };

  const value: AppContextType = {
    state,
    toggleSidebar,
    setTheme,
    toggleHighContrast,
    setLanguage,
    updateNotificationSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};