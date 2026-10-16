'use client';

import { useEffect } from 'react';

export function DevIndicatorRemover() {
  useEffect(() => {
    // 1. Inform Next.js DevTools backend to disable the indicator
    try {
      fetch('/__nextjs_devtools_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disableDevIndicator: true }),
      }).catch(() => {});
    } catch {
      // Ignore in production or offline
    }

    // 2. Hide or remove the DOM elements immediately
    const cleanNodes = () => {
      const portals = document.querySelectorAll('nextjs-portal');
      portals.forEach((portal) => {
        const el = portal as HTMLElement;
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        if (el.shadowRoot) {
          const indicator = el.shadowRoot.querySelector(
            '#data-devtools-indicator, [data-nextjs-dev-tools-button], button[data-indicator-status]'
          );
          if (indicator) {
            (indicator as HTMLElement).style.setProperty('display', 'none', 'important');
          }
        }
      });
    };

    cleanNodes();

    const observer = new MutationObserver(cleanNodes);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
