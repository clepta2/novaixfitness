// src/config/sentry.js
// Configuracao do Sentry para monitoramento - NOVAIX FITNESS

import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { APP_CONFIG } from './app';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export function initSentry() {
  if (!SENTRY_DSN) {
    if (__DEV__) console.warn('[Sentry] DSN nao configurado. Configure EXPO_PUBLIC_SENTRY_DSN');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    release: `${(APP_CONFIG as any).version || '1.0.0'}@${Platform.OS}`,
    dist: (APP_CONFIG as any).buildNumber || '1',

    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    enableNativeCrashHandling: true,

    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    profilesSampleRate: __DEV__ ? 1.0 : 0.1,

    beforeSend(event) {
      if (__DEV__) {
        console.info('[Sentry] Event:', event.event_id);
        return null;
      }

      if (event.exception?.values?.[0]?.type === 'Invariant Violation') {
        return null;
      }

      return event;
    },

    beforeSendTransaction(event) {
      if (__DEV__) return null;
      return event;
    },

    integrations: [
      new (Sentry as any).BrowserTracing(),
      new (Sentry as any).Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    maxBreadcrumbs: 50,
    attachStacktrace: true,
    sendDefaultPii: false,
  } as any);
}

export function captureError(error: Error, context: Record<string, unknown> = {}) {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
    Sentry.captureException(error);
  });
}

export function captureMessage(message: string, level: string = 'info', context: Record<string, unknown> = {}) {
  Sentry.withScope((scope) => {
    scope.setLevel(level as any);
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
    Sentry.captureMessage(message);
  });
}

export function setUser(user: { id?: string; email?: string; name?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });
  } else {
    Sentry.setUser(null);
  }
}

export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export function addBreadcrumb(category: string, message: string, data: Record<string, unknown> = {}) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
    timestamp: Date.now() / 1000,
  });
}

export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op });
}

export function withScope(callback: (scope: Sentry.Scope) => void) {
  Sentry.withScope(callback);
}

export function flush(timeout = 2000) {
  return (Sentry.flush as any)(timeout);
}

export function close(timeout = 2000) {
  return (Sentry.close as any)(timeout);
}

export { Sentry };
