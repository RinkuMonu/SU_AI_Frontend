/**
 * Image resolution and fallback utility for SevenUnique AI.
 * Handles ngrok interstitial bypass, relative paths, null/None values, and AI image fallbacks.
 */

export const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080&q=80";

export function getAiFallbackImage(prompt?: string, seed?: number): string {
  const cleanPrompt = (
    prompt ||
    "ultra-realistic luxury commercial product photography, 8k resolution, studio lighting, advertising style"
  ).trim();
  const s = seed ?? Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1080&height=1080&seed=${s}`;
}

export function resolveImageUrl(
  url?: string | null,
  fallbackPrompt?: string
): string {
  if (!url || typeof url !== "string") {
    return getAiFallbackImage(fallbackPrompt);
  }

  const trimmed = url.trim();

  // Python None or null string checks
  if (
    trimmed === "" ||
    trimmed.toLowerCase() === "none" ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return getAiFallbackImage(fallbackPrompt);
  }

  // Handle data URIs and blob URLs directly
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Handle ngrok tunnels - ngrok free tier returns an HTML warning interstitial page
  // unless ngrok-skip-browser-warning=true is appended as a query param.
  if (trimmed.includes("ngrok-free.dev") || trimmed.includes("ngrok.io")) {
    const separator = trimmed.includes("?") ? "&" : "?";
    if (!trimmed.includes("ngrok-skip-browser-warning")) {
      return `${trimmed}${separator}ngrok-skip-browser-warning=true`;
    }
    return trimmed;
  }

  // Handle relative uploads
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackPrompt?: string
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Level 1: try Pollinations AI
  const aiFallback = getAiFallbackImage(fallbackPrompt);
  if (!currentSrc.includes("pollinations.ai")) {
    target.src = aiFallback;
    return;
  }

  // Level 2: if Pollinations also fails, fallback to trusted Unsplash
  if (!currentSrc.includes("images.unsplash.com")) {
    target.src = DEFAULT_FALLBACK_IMAGE;
  }
}
