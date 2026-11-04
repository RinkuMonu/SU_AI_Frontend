"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { getDashboardRouteForRole } from '@/lib/role-routing';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userDataOrToken: string | User, maybeUserData?: User) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => Promise<void>;
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
      if (typeof window !== 'undefined' && freshUser) {
        localStorage.setItem('user', JSON.stringify(freshUser));
      }
      return freshUser;
    } catch {
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
      try {
        await refreshUser();
      } catch (_) {}
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
      const isOnboardingRoute = pathname === '/onboarding';
      const isCreatorOnboardingRoute = pathname === '/onboarding/influencer';
      const isPublicRoute =
        pathname === '/' ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/careers') ||
        pathname.startsWith('/blog') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/help') ||
        pathname.startsWith('/download') ||
        pathname.startsWith('/features') ||
        pathname.startsWith('/privacy') ||
        pathname.startsWith('/terms') ||
        pathname.startsWith('/refund') ||
        pathname.startsWith('/vision') ||
        pathname.startsWith('/mission') ||
        pathname.startsWith('/pricing') ||
        pathname.startsWith('/social-platforms') ||
        pathname.startsWith('/cancellation-and-refund-policy') ||
        pathname.startsWith('/privacy-policy') ||
        pathname.startsWith('/terms-and-conditions') ||
        pathname.startsWith('/legal');
      const isAdminRoute = pathname?.startsWith('/admin');

      // 1. Unauthenticated users handling
      if (!user) {
        if (
          !isPublicRoute &&
          !isAuthRoute &&
          !isVerifyRoute &&
          !isAdminLoginRoute &&
          !isSelectRoleRoute &&
          !isOnboardingRoute &&
          !isCreatorOnboardingRoute
        ) {
          try {
            sessionStorage.setItem('auth_redirect_after', pathname);
          } catch (_) {}
          router.replace(isAdminRoute ? '/login/admin' : '/login/user');
        }
        return;
      }

      // 2. Authenticated users handling
      const role = user.role;
      const isOnboardingComplete = Boolean(user.onboardingCompleted || (user as any).onboarding_completed);

      // 2a: OAuth phone verification requirement
      const userPhone = (user.phone || (user as any).phone_number || (user as any).mobile || '').trim();
      const isOAuthUser = Boolean(
        user.auth_provider === 'google' ||
        (user as any).provider === 'google' ||
        user.auth_provider === 'facebook' ||
        (user as any).provider === 'facebook' ||
        user.auth_provider === 'instagram' ||
        (user as any).provider === 'instagram' ||
        user.auth_provider === 'linkedin' ||
        (user as any).provider === 'linkedin' ||
        user.google_id ||
        (user as any).googleId ||
        (!userPhone && user.email)
      );

      if (!isOAuthUser && !userPhone && !user.phone_verified && !isVerifyRoute) {
        router.replace('/verify-phone');
        return;
      }

      // If already on onboarding, let them stay unless complete
      if (isOnboardingRoute || isCreatorOnboardingRoute) {
        if (isOnboardingComplete && role !== 'admin') {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // If user is selecting role, let them stay if incomplete
      if (isSelectRoleRoute) {
        if (isOnboardingComplete && role !== 'admin') {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // Handle users with no selected role
      if (!role) {
        if (!isSelectRoleRoute && !isAuthRoute && !isVerifyRoute && !isPublicRoute) {
          router.replace('/select-role');
        }
        return;
      }

      // If authenticated user with role lands on login or signup
      if (isAuthRoute) {
        if (!isOnboardingComplete && role !== 'admin') {
          if (role === 'influencer') {
            router.replace('/onboarding/influencer');
          } else {
            router.replace('/select-role');
          }
        } else {
          router.replace(getDashboardRouteForRole(role));
        }
        return;
      }

      // If authenticated user is on verify-phone page, direct them forward
      if (isVerifyRoute) {
        if (!isOnboardingComplete && role !== 'admin') {
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
        router.replace(getDashboardRouteForRole(role));
        return;
      }

      // 2e: Regular user who ALREADY HAS a role selected
      const targetDashboard = getDashboardRouteForRole(role);

      // Do not allow returning users with saved role to revisit auth screens
      if (isAuthRoute) {
        if (!isOnboardingComplete && role !== 'admin') {
          router.replace('/select-role');
        } else {
          router.replace(targetDashboard);
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userDataOrToken: string | User, maybeUserData?: User) => {
    let finalUser: User;
    if (typeof userDataOrToken === 'string') {
      const token = userDataOrToken;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
      }
      if (typeof document !== 'undefined') {
        document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
      }
      finalUser = maybeUserData || ({} as User);
    } else {
      finalUser = userDataOrToken;
    }

    if (finalUser && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(finalUser));
    }
    setUser(finalUser);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData } as User;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = async () => {
    const wasAdmin = user?.role === 'admin';
    const keysToClear = [
      'business_selected_services',
      'selected_services',
      'business_online_presence',
      'business_website_url',
      'business_details_data',
      'brand_preferences_data',
      'website_selected_photos',
      'google_maps_place_data',
      'google_maps_website_url',
      'google_maps_category',
      'google_maps_logo',
      'google_maps_selected_photos',
      'marketplace_platforms_data',
      'wholesale_b2b_platforms_data',
      'selected_role',
      'onboarding_step',
      'show_onboarding_plan',
      'onboarding_initial_restored',
      'user_active_modal',
    ];
    keysToClear.forEach((k) => {
      try {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      } catch (_) {}
    });
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
    try {
      await authService.logout();
    } catch (_) {}
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
