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
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
      } catch (_) {
        return null;
      }
    }
    return null;
  });
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
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
          localStorage.setItem('access_token', urlToken);
        }
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const cached = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
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
          const userPhone = (mergedUser.phone || mergedUser.phone_number || mergedUser.mobile || '').trim();
          const isOAuth = Boolean(
            mergedUser.auth_provider === 'google' ||
            mergedUser.provider === 'google' ||
            mergedUser.auth_provider === 'facebook' ||
            mergedUser.provider === 'facebook' ||
            mergedUser.auth_provider === 'instagram' ||
            mergedUser.provider === 'instagram' ||
            mergedUser.auth_provider === 'linkedin' ||
            mergedUser.provider === 'linkedin' ||
            mergedUser.google_id ||
            mergedUser.googleId ||
            (!userPhone && mergedUser.email)
          );
          if (isOAuth || !userPhone) {
            mergedUser.phone_verified = true;
          }
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
        '/influencers',
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
        '/preview',
        '/support',
      ].some((route) => pathname.startsWith(route));

      // CASE 1: Unauthenticated visitor
      if (!user) {
        if (isAuthRoute) {
          return;
        }
        if (isAdminRoute) {
          router.replace('/login/admin');
        } else if (isProtectedRoute || isSelectRoleRoute) {
          router.replace('/login/user');
        }
        return;
      }

      // CASE 2: Authenticated user
      const role = user.role;
      const userPhone = (user.phone || user.phone_number || (user as any).mobile || '').trim();
      const isOAuth = Boolean(
        user.auth_provider === 'google' ||
        user.provider === 'google' ||
        user.google_id ||
        (user as any).googleId ||
        user.auth_provider === 'facebook' ||
        user.provider === 'facebook' ||
        user.auth_provider === 'instagram' ||
        user.provider === 'instagram' ||
        user.auth_provider === 'linkedin' ||
        user.provider === 'linkedin' ||
        (!userPhone && user.email)
      );

      // Users authenticated via Google/OAuth or users without a phone number do not require phone verification
      const isPhoneVerified = isOAuth || !userPhone || user.phone_verified === true || user.phone_verified !== false;

      // 2a: Unverified phone number (only for accounts that actually registered a phone number and are not OAuth)
      if (!isPhoneVerified && userPhone && !isOAuth) {
        if (!isVerifyRoute) {
          router.replace(`/verify-phone?phone=${encodeURIComponent(userPhone)}`);
        }
        return;
      }

      // If authenticated user is on login or signup route, direct them to role selection or dashboard
      if (isAuthRoute) {
        if (needsRoleSelection(user)) {
          router.replace('/select-role');
        } else {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // If authenticated user is on verify-phone page, direct them forward
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
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    setUser(userData);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData } as User;
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
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

