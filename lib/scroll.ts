/**
 * Smoothly scrolls the window to a target element with exponential deceleration easing.
 * Coordinates with Lenis smooth scroll engine when active, or falls back to custom rAF.
 */
export function smoothScrollTo(targetId: string, duration = 1200, offset = 85) {
  if (typeof window === 'undefined') return;

  const el = document.getElementById(targetId);
  if (!el) return;

  // If Lenis is active on window, let Lenis handle the butter-smooth scroll
  const lenis = (window as any).__lenis || (window as any).lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, {
      offset: -offset,
      duration: duration / 1000,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: () => {
        try {
          window.history.pushState(null, '', `/#${targetId}`);
        } catch (_) {}
      },
    });
    return;
  }

  // Fallback if Lenis is not yet mounted
  const startY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const rect = el.getBoundingClientRect();
  const targetY = Math.max(0, rect.top + startY - offset);
  const distance = targetY - startY;

  if (Math.abs(distance) < 5) return;

  let startTime: number | null = null;
  const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

  const step = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeOutExpo(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY);
      try {
        window.history.pushState(null, '', `/#${targetId}`);
      } catch (_) {}
    }
  };

  window.requestAnimationFrame(step);
}
