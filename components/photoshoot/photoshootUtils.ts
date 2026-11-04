/**
 * Resilient image URL resolver & error handler for AI Photoshoot Studio.
 * Handles Next.js rewrites, direct FastAPI backend URLs, blob invalidations, and fallback states.
 */

export const PHOTOSHOOT_FALLBACK_PRODUCT =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080&q=80";

export const PHOTOSHOOT_FALLBACK_ENHANCED =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1080&q=80";

export function resolvePhotoshootUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();
  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return "";
  }

  // Handle inline data URIs and blob URLs directly
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // If already relative /uploads or /media, prefer relative path so Next.js proxies cleanly
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("/media/")) {
    return trimmed;
  }

  // Already an absolute HTTP/HTTPS URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Relative upload paths
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return cleanPath;
}

/**
 * Robust image error handler with multi-stage retry:
 * 1. Try same-origin relative path /uploads/...
 * 2. Try direct 127.0.0.1:8000
 * 3. Try localhost:8000
 * 4. Graceful fallback image
 */
export function handlePhotoshootImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = PHOTOSHOOT_FALLBACK_PRODUCT
) {
  const target = event.currentTarget;
  const currentSrc = target.src || "";
  const retryCount = Number(target.dataset.retryCount || "0");

  if (currentSrc.startsWith("blob:")) {
    // Revoked or invalid blob URL from previous session — immediately fallback
    target.onerror = null;
    target.src = fallbackUrl;
    return;
  }

  if (retryCount === 0) {
    target.dataset.retryCount = "1";
    // Stage 1: Try direct relative path via Next.js proxy
    if (currentSrc.includes("/uploads/")) {
      const uploadPath = currentSrc.substring(currentSrc.indexOf("/uploads/"));
      target.src = uploadPath;
      return;
    }
  } else if (retryCount === 1) {
    target.dataset.retryCount = "2";
    // Stage 2: Try direct backend IP
    if (currentSrc.includes("/uploads/")) {
      const uploadPath = currentSrc.substring(currentSrc.indexOf("/uploads/"));
      target.src = `http://127.0.0.1:8000${uploadPath}`;
      return;
    }
  } else if (retryCount === 2) {
    target.dataset.retryCount = "3";
    // Stage 3: Try localhost
    if (currentSrc.includes("/uploads/")) {
      const uploadPath = currentSrc.substring(currentSrc.indexOf("/uploads/"));
      target.src = `http://localhost:8000${uploadPath}`;
      return;
    }
  }

  // Final fallback to prevent broken image icon
  target.onerror = null;
  target.src = fallbackUrl;
}
