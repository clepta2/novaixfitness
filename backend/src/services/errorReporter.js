// src/services/errorReporter.js
// Servicio de reporte de erros - NOVAIX FITNESS
// Pluggable: Sentry, Logtail, ou arquivo local

const fs = require('fs');
const path = require('path');

const SENTRY_DSN = process.env.SENTRY_DSN;
const LOG_DIR = path.join(__dirname, '../../logs');

let sentryInitialized = false;

function initSentry() {
  if (sentryInitialized || !SENTRY_DSN) return;
  try {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV || 'development' });
    sentryInitialized = true;
  } catch {}
}

function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch {}
}

function reportError(err, context = {}) {
  initSentry();

  if (sentryInitialized) {
    try {
      const Sentry = require('@sentry/node');
      Sentry.withScope((scope) => {
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
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      ...context,
    };
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  } catch {}
}

function reportMessage(message, level = 'info', context = {}) {
  initSentry();

  if (sentryInitialized) {
    try {
      const Sentry = require('@sentry/node');
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        Object.entries(context).forEach(([k, v]) => scope.setExtra(k, v));
        Sentry.captureMessage(message, level);
      });
    } catch {}
  }
}

module.exports = { reportError, reportMessage, initSentry };
