'use client';

import { useEffect, useRef } from 'react';

/**
 * LivenessKeeper
 * 1. Keeps the server awake by sending periodic keep-alive pings (prevents cold server shutdown)
 * 2. Emits human presence signals based on real touch/scroll events
 * 3. Detects automated headless browser drivers
 */
export function LivenessKeeper() {
  const hasInteracted = useRef(false);

  useEffect(() => {
    // 1. Check for automated webdriver
    const isAutomated =
      typeof navigator !== 'undefined' &&
      (Boolean((navigator as any).webdriver) ||
        Boolean((window as any).__nightmare) ||
        Boolean((window as any)._phantom));

    if (isAutomated) {
      // It is a bot; do not keep connection alive
      return;
    }

    // 2. Mark human interaction on real touch or scroll
    const onHumanActivity = () => {
      hasInteracted.current = true;
    };

    window.addEventListener('touchstart', onHumanActivity, { passive: true });
    window.addEventListener('scroll', onHumanActivity, { passive: true });
    window.addEventListener('mousemove', onHumanActivity, { passive: true });

    // 3. Keep-alive heartbeat every 4 minutes
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch('/api/health', { method: 'GET', keepalive: true }).catch(() => {});
      }
    }, 4 * 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('touchstart', onHumanActivity);
      window.removeEventListener('scroll', onHumanActivity);
      window.removeEventListener('mousemove', onHumanActivity);
    };
  }, []);

  return null;
}
