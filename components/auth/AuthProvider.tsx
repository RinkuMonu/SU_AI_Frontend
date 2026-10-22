"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { needsRoleSelection, getDashboardRouteForRole } from '@/lib/role-routing';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  updateUser: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
      return freshUser;
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [refreshUser]);

  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname === '/login/user' || pathname === '/signup';
      const isVerifyRoute = pathname === '/verify-phone' || pathname === '/verify-email';
      const isAdminLoginRoute = pathname === '/login/admin';
      const isSelectRoleRoute = pathname === '/select-role' || pathname === '/role-selection';
      const isAdminRoute = pathname.startsWith('/admin');

      const isProtectedRoute = [
        '/dashboard',
        '/influencer',
        '/business',
        '/brand',
        '/products',
        '/settings',
        '/subscription',
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
        '/uni-ai',
        '/website-builder',
        '/analytics',
        '/fashion-ai',
        '/festivals',
      ].some((route) => pathname.startsWith(route));

      // CASE 1: Unauthenticated visitor
      if (!user) {
        if (isAdminRoute) {
          router.replace('/login/admin');
        } else if (isProtectedRoute || isSelectRoleRoute) {
          router.replace('/login/user');
        }
        return;
      }

      // CASE 2: Authenticated user
      const isPhoneVerified = user.phone_verified !== false;
      const role = user.role;

      // 2a: Unverified phone number
      if (!isPhoneVerified) {
        if (!isVerifyRoute) {
          router.replace('/verify-phone');
        }
        return;
      }

      // If user is verified and still on verify-phone page, direct them forward
      if (isVerifyRoute) {
        if (needsRoleSelection(user)) {
          router.replace('/select-role');
        } else {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // 2b: Admin user logic
      if (role === 'admin') {
        if (isAuthRoute || isAdminLoginRoute || isSelectRoleRoute) {
          router.replace('/admin');
        }
        return;
      }

      // 2c: Non-admin trying to access admin route
      if (isAdminRoute && role !== 'admin') {
        console.warn('Admin access rejected: user does not have admin role.');
        if (needsRoleSelection(user)) {
          router.replace('/select-role');
        } else {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // 2d: Regular user who STILL NEEDS role selection
      if (needsRoleSelection(user)) {
        // Must complete role selection before accessing any protected dashboard
        if (isProtectedRoute || isAuthRoute) {
          router.replace('/select-role');
        }
        return;
      }

      // 2e: Regular user who ALREADY HAS a role selected
      const targetDashboard = getDashboardRouteForRole(role);

      // Do not allow returning users with saved role to revisit auth or role-selection screens
      if (isAuthRoute || isSelectRoleRoute) {
        router.replace(targetDashboard);
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData: User) => {
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
    <AuthContext.Provider value={{ user, isLoading, login, updateUser, logout, refreshUser }}>
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
