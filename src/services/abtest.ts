// src/services/abtest.ts
// Re-export shim → featureFlags.ts (canonical A/B testing)
// Mantido para backward compatibility

export { getVariant, trackConversion } from './featureFlags';

import { trackConversion as track } from './featureFlags';

export async function trackPaywallView(userId: string) {
  await track('paywall', userId, 'view');
}

export async function trackPaywallClick(userId: string, planType: string) {
  await track('paywall', userId, 'click_subscribe');
}

export async function trackPaywallConversion(userId: string, planType: string, revenue: number) {
  await track('paywall', userId, 'convert');
}

export async function trackPaywallSkip(userId: string) {
  await track('paywall', userId, 'skip');
}
