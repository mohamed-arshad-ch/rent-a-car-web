"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        // Handle parsing error
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData: User, token: string, rememberMe: boolean) => {
    setUser(userData);
    setToken(token);
    
    // Store in localStorage if rememberMe is true
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userData.id);
    } else {
      // Store in sessionStorage if not remembering
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userData.id);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    
    // Redirect to login page
    router.push('/auth/login');
  };

  // Value object to be provided to consumers
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    // You could return a loading indicator here
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 