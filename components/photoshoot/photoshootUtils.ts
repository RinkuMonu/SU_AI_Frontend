/**
 * Resilient image URL resolver & error handler for AI Photoshoot Studio.
 * Handles Next.js rewrites, direct FastAPI backend URLs, blob invalidations, and fallback states.
 */

export const PHOTOSHOOT_FALLBACK_PRODUCT =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%230f172a'/><circle cx='400' cy='360' r='120' fill='%231e293b' stroke='%2338bdf8' stroke-width='4'/><path d='M340 360 L380 400 L470 310' stroke='%2338bdf8' stroke-width='16' stroke-linecap='round' stroke-linejoin='round' fill='none'/><text x='400' y='540' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2394a3b8' text-anchor='middle'>Original Product Photo</text><text x='400' y='575' font-family='sans-serif' font-size='16' fill='%2364748b' text-anchor='middle'>High Fidelity Source Captured</text></svg>";

export const PHOTOSHOOT_FALLBACK_ENHANCED =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23a855f7'/><stop offset='100%25' stop-color='%23ec4899'/></linearGradient></defs><rect width='800' height='800' fill='%230b0f19'/><circle cx='400' cy='360' r='130' fill='%2318182b' stroke='url(%23g)' stroke-width='6'/><path d='M350 360 L385 395 L460 320' stroke='url(%23g)' stroke-width='16' stroke-linecap='round' stroke-linejoin='round' fill='none'/><text x='400' y='540' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23f1f5f9' text-anchor='middle'>AI Enhanced Studio Look</text><text x='400' y='575' font-family='sans-serif' font-size='16' fill='%23a855f7' text-anchor='middle'>Commercial Grade Lighting Calibrated</text></svg>";

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
    if (currentSrc.includes("/uploads/")) {
      const uploadPath = currentSrc.substring(currentSrc.indexOf("/uploads/"));
      target.src = uploadPath;
      return;
    }
  } else if (retryCount === 1) {
    target.dataset.retryCount = "2";
    if (currentSrc.includes("/uploads/")) {
      const uploadPath = currentSrc.substring(currentSrc.indexOf("/uploads/"));
      target.src = `http://127.0.0.1:8000${uploadPath}`;
      return;
    }
  }

  // Final fallback: Instant SVG data URI that never 404s
  target.onerror = null;
  target.src = fallbackUrl;
}
