"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define admin type
type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Admin Auth context type
type AdminAuthContextType = {
  admin: Admin | null;
  token: string | null;
  login: (adminData: Admin, token: string, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

// Create context
const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Provider component
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const storedToken = localStorage.getItem('adminToken');
    
    if (storedAdmin && storedToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        setToken(storedToken);
      } catch (error) {
        // Handle parsing error
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
      }
    } else {
      // Try session storage too
      const sessionAdmin = sessionStorage.getItem('admin');
      const sessionToken = sessionStorage.getItem('adminToken');
      
      if (sessionAdmin && sessionToken) {
        try {
          const parsedAdmin = JSON.parse(sessionAdmin);
          setAdmin(parsedAdmin);
          setToken(sessionToken);
        } catch (error) {
          console.error('Error parsing admin data from session:', error);
          sessionStorage.removeItem('admin');
          sessionStorage.removeItem('adminToken');
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = (adminData: Admin, token: string, rememberMe: boolean) => {
    setAdmin(adminData);
    setToken(token);
    
    // Store in localStorage if rememberMe is true
    if (rememberMe) {
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminId', adminData.id);
    } else {
      // Store in sessionStorage if not remembering
      sessionStorage.setItem('admin', JSON.stringify(adminData));
      sessionStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminId', adminData.id);
    }
  };

  // Logout function
  const logout = () => {
    setAdmin(null);
    setToken(null);
    
    // Clear storage
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminId');
    
    // Redirect to admin login page
    router.push('/admin/login');
  };

  // Value object to be provided to consumers
  const value = {
    admin,
    token,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  if (isLoading) {
    // You could return a loading indicator here
    return <div>Loading...</div>;
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

// Custom hook to use the admin auth context
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 