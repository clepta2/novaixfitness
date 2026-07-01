// src/security/anomalyDetection.js
// Deteccao de anomalias: login, API, exportacao, dispositivo, localizacao

import { supabase } from '../config/supabase';

const BASELINE = {
  loginFrequency: { maxPerHour: 10, maxPerDay: 50 },
  apiCalls: { maxPerMinute: 60, maxPerHour: 500 },
  dataExport: { maxPerDay: 3 },
  deviceChanges: { maxPerWeek: 3 },
};

async function checkCount(userId: string, action: string, timeWindow: number) {
  const since = new Date(Date.now() - timeWindow).toISOString();
  const { count } = await supabase.from('audit_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId).eq('action', action).gte('created_at', since);
  return count || 0;
}

export async function detectAnomalies(userId) {
  const anomalies = [];

  const loginCount = await checkCount(userId, 'login', 60 * 60 * 1000);
  if (loginCount > BASELINE.loginFrequency.maxPerHour) {
    anomalies.push({ type: 'login_frequency', detected: true, severity: 'high', current: loginCount, limit: BASELINE.loginFrequency.maxPerHour });
  }

  const apiCount = await checkCount(userId, 'api_call', 60 * 1000);
  if (apiCount > BASELINE.apiCalls.maxPerMinute) {
    anomalies.push({ type: 'api_frequency', detected: true, severity: 'medium', current: apiCount, limit: BASELINE.apiCalls.maxPerMinute });
  }

  const exportCount = await checkCount(userId, 'data_export', 24 * 60 * 60 * 1000);
  if (exportCount > BASELINE.dataExport.maxPerDay) {
    anomalies.push({ type: 'data_export', detected: true, severity: 'high', current: exportCount, limit: BASELINE.dataExport.maxPerDay });
  }

  const deviceCount = await checkCount(userId, 'device_change', 7 * 24 * 60 * 60 * 1000);
  if (deviceCount > BASELINE.deviceChanges.maxPerWeek) {
    anomalies.push({ type: 'device_change', detected: true, severity: 'medium', current: deviceCount, limit: BASELINE.deviceChanges.maxPerWeek });
  }

  const locationAnomaly = await checkLocationAnomaly(userId);
  if (locationAnomaly.detected) anomalies.push(locationAnomaly);

  if (anomalies.length > 0) {
    await supabase.from('security_events').insert({
      user_id: userId, event_type: 'anomaly_detected',
      severity: calculateRiskLevel(anomalies), details: { anomalies },
    });
  }

  return { hasAnomalies: anomalies.length > 0, anomalies, riskLevel: calculateRiskLevel(anomalies) };
}

async function checkLocationAnomaly(userId) {
  const { data: recentLogins } = await supabase.from('audit_log')
    .select('details, created_at').eq('user_id', userId).eq('action', 'login')
    .order('created_at', { ascending: false }).limit(5);

  if (!recentLogins || recentLogins.length < 2) return { type: 'location', detected: false, severity: 'none' };

  const locations = recentLogins.map(l => l.details?.location?.country).filter(Boolean);
  const uniqueLocations = [...new Set(locations)];
  const hasAnomaly = uniqueLocations.length > 2;
  return { type: 'location_anomaly', detected: hasAnomaly, severity: hasAnomaly ? 'high' : 'none', locations: uniqueLocations };
}

export function calculateRiskLevel(items) {
  const severities = items.map(i => i.severity || i.riskLevel);
  if (severities.includes('critical')) return 'critical';
  if (severities.includes('high')) return 'high';
  if (severities.includes('medium')) return 'medium';
  return 'low';
}
