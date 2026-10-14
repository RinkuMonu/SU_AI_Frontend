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
  updateUser: (userData: Partial<User>) => void;
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
      const cached = localStorage.getItem('user');
      let cachedUser: User | null = null;
      if (cached) {
        try {
          cachedUser = JSON.parse(cached);
          setUser(cachedUser);
        } catch (_) {}
      }
      
      if (token) {
        try {
          const freshUser = await authService.getCurrentUser();
          const mergedUser: User = { ...(cachedUser || {}), ...freshUser };
          setUser(mergedUser);
          localStorage.setItem('user', JSON.stringify(mergedUser));
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
      const isProtectedRoute = [
        '/dashboard',
        '/subscription',
        '/analytics',
        '/fashion-ai',
        '/festivals',
        '/website-builder',
        '/uni-ai',
        '/preview',
        '/business',
        '/brand',
        '/products',
        '/settings',
        '/support',
        '/onboarding',
        '/content',
        '/content-library',
        '/campaigns',
        '/messages',
        '/reviews',
        '/social-platforms',
        '/create',
        '/create-ad',
        '/ai-',
        '/influencer',
        '/influencers'
      ].some(route => pathname.startsWith(route));
      const isAdminRoute = pathname.startsWith('/admin');

      // Never redirect users away from login or signup pages
      if (isAuthRoute) {
        return;
      }

      if (!user) {
        if (isAdminRoute) {
          router.replace('/login/admin');
        } else if (isProtectedRoute) {
          router.replace('/login/user');
        }
      } else {
        const role = (user.role || 'user').toLowerCase();
        const isVerified = user.email_verified !== false; // treat undefined as verified to support legacy users

        if (!isVerified && isProtectedRoute && !isVerifyEmailRoute) {
          if (user.email) {
            router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
          } else {
            router.replace('/login/user');
          }
        } else if (isVerified && isVerifyEmailRoute) {
          router.replace('/dashboard');
        } else if (isAdminRoute && role !== 'admin') {
          console.warn('Admin access warning: User role is not admin, but allowing access for testing.');
          // router.replace('/dashboard');
        } else if (isAdminLoginRoute && role !== 'admin') {
          console.warn('Admin login warning: User role is not admin, but allowing access for testing.');
          router.replace('/admin');
        } else if (isAdminLoginRoute && role === 'admin') {
          router.replace('/admin');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    setUser(userData);
  };

  const logout = () => {
    const wasAdmin = user?.role === 'admin';
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
    setUser(null);
    router.replace(wasAdmin ? '/login/admin' : '/login/user');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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

