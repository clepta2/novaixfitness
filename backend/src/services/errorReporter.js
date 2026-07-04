// src/services/errorReporter.ts
// Servicio de reporte de erros - NOVAIX FITNESS
// Pluggable: Sentry, Logtail, ou arquivo local

import fs from 'fs';
import path from 'path';

const SENTRY_DSN = process.env.SENTRY_DSN;
const LOG_DIR = path.join(__dirname, '../../logs');

let sentryInitialized = false;

function initSentry(): void {
  if (sentryInitialized || !SENTRY_DSN) return;
  try {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV || 'development' });
    sentryInitialized = true;
  } catch {}
}

function ensureLogDir(): void {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch {}
}

function reportError(err: Error | any, context: Record<string, any> = {}): void {
  initSentry();

  if (sentryInitialized) {
    try {
      const Sentry = require('@sentry/node');
      Sentry.withScope((scope: any) => {
        Object.entries(context).forEach(([k, v]) => scope.setExtra(k, v));
        Sentry.captureException(err);
      });
    } catch {}
  }

  try {
    ensureLogDir();
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOG_DIR, `errors-${date}.jsonl`);
    const entry = {
      timestamp: new Date().toISOString(),
      message: err.message || String(err),
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      ...context,
    };
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  } catch {}
}

function reportMessage(message: string, level = 'info', context: Record<string, any> = {}): void {
  initSentry();

  if (sentryInitialized) {
    try {
      const Sentry = require('@sentry/node');
      Sentry.withScope((scope: any) => {
        scope.setLevel(level);
        Object.entries(context).forEach(([k, v]) => scope.setExtra(k, v));
        Sentry.captureMessage(message, level);
      });
    } catch {}
  }
}

export { reportError, reportMessage, initSentry };
