import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'citizen' | 'official' | 'analyst' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@incois.gov.in',
    role: 'analyst',
    avatar: undefined,
    verified: true
  }); // Mock user for development

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Mock login - will be replaced with actual authentication
    console.log('Login attempt:', { email, password });
    // For demo purposes, set mock user
    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
      role: 'citizen',
      verified: true
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};