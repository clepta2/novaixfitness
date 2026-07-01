// src/security/accountTakeover.js
// Prevencao contra account takeover

import { supabase } from '../config/supabase';
import { calculateRiskLevel } from './anomalyDetection';

export async function checkAccountTakeover(userId, loginData) {
  const risks = [];

  const { data: knownDevices } = await supabase.from('user_devices')
    .select('device_id').eq('user_id', userId);
  if (!knownDevices?.some(d => d.device_id === loginData.deviceId)) {
    risks.push({ type: 'new_device', severity: 'medium' });
  }

  const { data: knownLocations } = await supabase.from('login_locations')
    .select('country, city').eq('user_id', userId);
  if (!knownLocations?.some(l => l.country === loginData.country && l.city === loginData.city)) {
    risks.push({ type: 'new_location', severity: 'medium' });
  }

  const { data: recentPwChange } = await supabase.from('audit_log')
    .select('created_at').eq('user_id', userId).eq('action', 'password_change')
    .order('created_at', { ascending: false }).limit(1).single();
  if (recentPwChange) {
    const hoursSince = (Date.now() - new Date(recentPwChange.created_at).getTime()) / 3600000;
    if (hoursSince < 24) risks.push({ type: 'recent_password_change', severity: 'high' });
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: similarLogins } = await supabase.from('login_attempts')
    .select('email').eq('ip', loginData.ip).eq('is_successful', true).gte('created_at', since24h);
  const uniqueEmails = [...new Set((similarLogins || []).map(l => l.email))];
  if (uniqueEmails.length > 3) risks.push({ type: 'credential_stuffing_suspected', severity: 'critical' });

  return {
    risks,
    shouldBlock: risks.some(r => r.severity === 'critical'),
    shouldRequireMFA: risks.some(r => r.severity === 'high' || r.severity === 'medium'),
    riskLevel: calculateRiskLevel(risks),
  };
}
