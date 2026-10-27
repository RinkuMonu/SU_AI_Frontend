import { User } from '@/types';

export type UserRole = 'businessman' | 'influencer' | 'admin';

/**
 * Normalizes input role string to canonical role type
 */
export function normalizeRole(role?: string | null): UserRole | null {
  if (!role) return null;
  const clean = role.trim().toLowerCase();
  if (['businessman', 'business', 'merchant'].includes(clean)) {
    return 'businessman';
  }
  if (['influencer', 'creator'].includes(clean)) {
    return 'influencer';
  }
  if (clean === 'admin') {
    return 'admin';
  }
  return null;
}

/**
 * Determines if an authenticated user must complete the role selection step.
 * Disabled post-login as role selection is already integrated into 'Use on Web'.
 */
export function needsRoleSelection(user?: User | null): boolean {
  return false;
}

/**
 * Resolves the authoritative frontend dashboard route for a given user or role.
 */
export function getDashboardRouteForRole(role?: string | null): string {
  const normalized = normalizeRole(role);
  switch (normalized) {
    case 'businessman':
      return '/dashboard';
    case 'influencer':
      return '/influencer';
    case 'admin':
      return '/admin';
    default:
      return '/dashboard';
  }
}

/**
 * Maps backend returned dashboard route to frontend route if needed.
 */
export function mapBackendDashboardRoute(backendRoute?: string | null, fallbackRole?: string | null): string {
  if (!backendRoute) {
    return getDashboardRouteForRole(fallbackRole);
  }
  const clean = backendRoute.trim().toLowerCase();
  if (clean === '/dashboard/business') {
    return '/dashboard';
  }
  if (clean === '/dashboard/creator') {
    return '/influencer';
  }
  if (clean.startsWith('/admin')) {
    return '/admin';
  }
  return backendRoute;
}
