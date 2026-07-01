// src/services/monitoring.ts
// Monitoramento - re-exportacao via sentry.ts

export { initSentry, captureError, captureMessage, setUser, addBreadcrumb } from '../config/sentry';
export { trackEvent, EVENTS, cleanup } from './analyticsTracking';

interface PerformanceMark {
  start: number;
  end?: number;
  duration?: number;
}

interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: number;
}

const performanceMarks: Record<string, PerformanceMark> = {};

export function markStart(name: string): void {
  performanceMarks[name] = { start: Date.now() };
}

export function markEnd(name: string): void {
  if (performanceMarks[name]) {
    performanceMarks[name].end = Date.now();
    performanceMarks[name].duration = performanceMarks[name].end! - performanceMarks[name].start;
  }
}

export function getPerformanceReport(): PerformanceEntry[] {
  return Object.entries(performanceMarks)
    .filter(([, v]) => v.duration)
    .sort((a, b) => b[1].duration! - a[1].duration!)
    .slice(0, 20)
    .map(([name, data]) => ({ name, duration: data.duration!, timestamp: data.start }));
}
