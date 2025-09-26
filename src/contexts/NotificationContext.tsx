import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type NotificationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type NotificationType = 'hazard_alert' | 'system' | 'report_update' | 'weather';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  timestamp: Date;
  read: boolean;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Mock notifications for development
    {
      id: '1',
      title: 'High Wave Alert',
      message: 'High waves (3-4m) expected along Gujarat coast in next 6 hours',
      type: 'hazard_alert',
      severity: 'high',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      location: { lat: 22.2587, lng: 71.1924, name: 'Gujarat Coast' }
    },
    {
      id: '2',
      title: 'New Hazard Report',
      message: 'Coastal flooding reported in Chennai Marina Beach area',
      type: 'report_update',
      severity: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Marina Beach' }
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed successfully',
      type: 'system',
      severity: 'low',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};