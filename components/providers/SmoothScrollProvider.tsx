'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Eliminate CSS smooth-scroll conflict so Lenis RAF runs at pure 60-120fps
    document.documentElement.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global capture-phase click listener: smooth scroll to ANY anchor link across the entire website
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const currentPath = window.location.pathname;
      let targetId: string | null = null;

      if (href.startsWith('#') && href.length > 1) {
        targetId = href.slice(1);
      } else if (href.startsWith('/#') && (currentPath === '/' || currentPath === '')) {
        targetId = href.slice(2);
      } else if (href.includes('#') && (href.startsWith('/') || href.startsWith(window.location.origin))) {
        const parts = href.split('#');
        const targetPath = parts[0].replace(window.location.origin, '');
        if (targetPath === '' || targetPath === '/' || targetPath === currentPath) {
          targetId = parts[1];
        }
      }

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          e.stopPropagation();

          lenis.scrollTo(el, {
            offset: -85,
            duration: 1.3,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              try {
                window.history.pushState(null, '', `/#${targetId}`);
              } catch (_) {}
            },
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    // Handle initial hash in URL (e.g. direct load at /#pricing or /#blog or /#contact)
    if (window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const el = document.getElementById(hashId);
      if (el) {
        setTimeout(() => {
          lenis.scrollTo(el, {
            offset: -85,
            duration: 1.3,
          });
        }, 150);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as any).lenis;
        delete (window as any).__lenis;
      }
    };
  }, []);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
