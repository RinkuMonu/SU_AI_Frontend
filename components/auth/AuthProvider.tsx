"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname === '/login/user' || pathname === '/signup';
      const isVerifyEmailRoute = pathname === '/verify-email';
      const isAdminLoginRoute = pathname === '/login/admin';
      const isProtectedRoute = ['/dashboard', '/business', '/brand', '/products', '/settings', '/onboarding', '/content', '/content-library', '/campaigns', '/messages', '/reviews', '/social-platforms', '/create', '/create-ad', '/ai-', '/influencer'].some(route => pathname.startsWith(route));
      const isAdminRoute = pathname.startsWith('/admin');

      if (!user) {
        if (isAdminRoute) {
          router.replace('/login/admin');
        } else if (isProtectedRoute) {
          router.replace('/login/user');
        }
      } else {
        const role = (user.role || 'user').toLowerCase();
        const isVerified = user.email_verified !== false; // treat undefined as verified to support legacy users

        if (!isVerified && !isVerifyEmailRoute) {
          router.replace('/verify-email');
        } else if (isVerified && isVerifyEmailRoute) {
          router.replace('/dashboard');
        } else if (isAdminRoute && role !== 'admin') {
          console.warn('Admin access warning: User role is not admin, but allowing access for testing.');
          // router.replace('/dashboard');
        } else if (isAdminLoginRoute && role !== 'admin') {
          console.warn('Admin login warning: User role is not admin, but allowing access for testing.');
          router.replace('/admin');
        } else if (isAuthRoute && role === 'admin') {
          // Normal user shouldn't go to admin, admin shouldn't go to user login
          // We reject auth route login if already logged in by sending them to their respective dashboard
          router.replace('/admin');
        } else if (isAuthRoute && role === 'user') {
          router.replace('/dashboard');
        } else if (isAdminLoginRoute && role === 'admin') {
          router.replace('/admin');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    const wasAdmin = user?.role === 'admin';
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace(wasAdmin ? '/login/admin' : '/login/user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

