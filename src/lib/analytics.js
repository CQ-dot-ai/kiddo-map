import { track } from '@vercel/analytics/react';

export function trackEvent(name, properties = {}) {
  if (typeof window === 'undefined') return;

  try {
    track(name, properties);
  } catch {
    // Analytics must never block the product flow.
  }
}
