// src/services/crashReport.js
// Servico de crash reporting - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { Platform } from 'react-native';

let currentUser = null;
let breadcrumbs = [];

export function setCrashUser(user) {
  currentUser = user;
}

export function addBreadcrumb(category, message, data) {
  breadcrumbs.push({
    timestamp: new Date().toISOString(),
    category,
    message,
    data,
  });
  if (breadcrumbs.length > 50) breadcrumbs = breadcrumbs.slice(-50);
}

export async function reportCrash(error, extra = {}) {
  if (!error) return;

  const crashData = {
    message: error.message || String(error),
    stack: error.stack || null,
    name: error.name || 'Error',
    platform: Platform.OS,
    version: Platform.Version,
    user_id: currentUser?.id || null,
    breadcrumbs: JSON.stringify(breadcrumbs.slice(-10)),
    extra: JSON.stringify(extra),
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('crash_reports').insert(crashData);
  } catch {
    console.error('Falha ao reportar crash');
  }
}

export async function reportHandledError(error, context = '') {
  if (!error) return;

  const errorData = {
    message: error.message || String(error),
    stack: error.stack || null,
    context,
    platform: Platform.OS,
    user_id: currentUser?.id || null,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('handled_errors').insert(errorData);
  } catch {}
}

export function setupCrashHandler() {
  const originalHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    if (isFatal) {
      reportCrash(error, { fatal: true });
    } else {
      reportHandledError(error, 'global_handler');
    }

    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}
