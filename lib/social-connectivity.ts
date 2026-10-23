import React from "react";
import { normalizeRole } from "./role-routing";
import { isBrandKitComplete } from "./brand-kit";
import { BrandKit } from "@/types/brand";
import { Business } from "@/types";

export type SocialPlatformKey = "instagram" | "facebook" | "linkedin";

export interface PlatformConfig {
  key: SocialPlatformKey;
  name: string;
  description: string;
  officialSignupUrl: string;
  connectEndpoint: string;
  disconnectEndpoint: string;
}

export const PLATFORM_CONFIGS: Record<SocialPlatformKey, PlatformConfig> = {
  instagram: {
    key: "instagram",
    name: "Instagram",
    description: "Connect your Instagram Business account to auto-publish Posts and Reels.",
    officialSignupUrl: "https://www.instagram.com/accounts/emailsignup/",
    connectEndpoint: "/api/instagram/connect",
    disconnectEndpoint: "/api/v1/social/disconnect/instagram",
  },
  facebook: {
    key: "facebook",
    name: "Facebook",
    description: "Connect your Facebook Page to automate publishing and track engagement.",
    officialSignupUrl: "https://www.facebook.com/r.php",
    connectEndpoint: "/api/facebook/connect",
    disconnectEndpoint: "/api/v1/social/disconnect/facebook",
  },
  linkedin: {
    key: "linkedin",
    name: "LinkedIn",
    description: "Connect your LinkedIn Profile or Company Page to automate professional publishing.",
    officialSignupUrl: "https://www.linkedin.com/signup",
    connectEndpoint: "/api/linkedin/connect",
    disconnectEndpoint: "/api/v1/social/disconnect/linkedin",
  },
};

export interface PlatformConnectionState {
  instagram: boolean;
  facebook: boolean;
  linkedin: boolean;
  connectedCount: number;
  hasAtLeastOne: boolean;
  details?: {
    instagram?: { id?: string | null; name?: string | null };
    facebook?: { id?: string | null; name?: string | null };
    linkedin?: { id?: string | null; name?: string | null };
  };
}

/**
 * Evaluates whether social platforms are connected based on authoritative backend business data
 * or onboarding status payload.
 */
export function evaluatePlatformConnections(
  business?: any,
  socialStatusPayload?: any
): PlatformConnectionState {
  let instagram = false;
  let facebook = false;
  let linkedin = false;

  // 1. Check authoritative socialStatusPayload from /api/v1/social/onboarding-status if present
  if (socialStatusPayload?.platforms) {
    const p = socialStatusPayload.platforms;
    instagram = Boolean(p.instagram?.connected);
    facebook = Boolean(p.facebook?.connected);
    linkedin = Boolean(p.linkedin?.connected);
  }

  // 2. Check business record fields
  if (business) {
    if (business.ig_access_token || business.ig_account_id) {
      instagram = true;
    }
    if (business.fb_access_token || business.fb_page_id) {
      facebook = true;
    }
    if (business.linkedin_access_token || business.linkedin_author_id) {
      linkedin = true;
    }
  }

  // 3. Check connected_platforms list if provided
  if (Array.isArray(socialStatusPayload?.connected_platforms)) {
    const list: string[] = socialStatusPayload.connected_platforms.map((s: string) => s.toLowerCase());
    if (list.includes("instagram")) instagram = true;
    if (list.includes("facebook")) facebook = true;
    if (list.includes("linkedin")) linkedin = true;
  }

  const count = (instagram ? 1 : 0) + (facebook ? 1 : 0) + (linkedin ? 1 : 0);

  return {
    instagram,
    facebook,
    linkedin,
    connectedCount: count,
    hasAtLeastOne: count > 0,
    details: {
      instagram: {
        id: socialStatusPayload?.platforms?.instagram?.account_id || business?.ig_account_id || null,
        name: socialStatusPayload?.platforms?.instagram?.account_name || null,
      },
      facebook: {
        id: socialStatusPayload?.platforms?.facebook?.account_id || business?.fb_page_id || null,
        name: socialStatusPayload?.platforms?.facebook?.account_name || business?.fb_page_name || null,
      },
      linkedin: {
        id: socialStatusPayload?.platforms?.linkedin?.account_id || business?.linkedin_author_id || null,
        name: socialStatusPayload?.platforms?.linkedin?.account_name || business?.linkedin_account_name || null,
      },
    },
  };
}

/**
 * Pure evaluator for whether the automatic onboarding popup should open.
 * Strictly adheres to backend rules:
 * - Role must be Businessman.
 * - Brand Kit must be completely filled.
 * - Social connection count must be 0.
 * - Must not be dismissed in current session.
 * - Must not be on dedicated management screens.
 */
export function shouldDisplaySocialModal(params: {
  userRole?: string | null;
  brandKit?: BrandKit | null;
  business?: Business | null;
  connectionState: PlatformConnectionState;
  sessionDismissed: boolean;
  pathname?: string;
}): boolean {
  const { userRole, brandKit, business, connectionState, sessionDismissed, pathname } = params;

  // 1. Role must be Businessman
  const normalized = normalizeRole(userRole);
  if (normalized !== "businessman") {
    return false;
  }

  // 2. Cannot display if user dismissed it in this mounted session
  if (sessionDismissed) {
    return false;
  }

  // 3. Do not auto-popup over the dedicated /social-platforms or /brand or /subscription pages
  if (
    pathname?.startsWith("/social-platforms") ||
    pathname === "/brand" ||
    pathname === "/subscription"
  ) {
    return false;
  }

  // 4. Brand Kit must be completed first (prerequisite)
  const isBrandKitDone = isBrandKitComplete(brandKit ?? null, business ?? null);
  if (!isBrandKitDone) {
    return false;
  }

  // 5. If at least 1 account is connected, DO NOT display
  if (connectionState.hasAtLeastOne) {
    return false;
  }

  // All criteria met: Businessman, Brand Kit complete, 0 social connections
  return true;
}
