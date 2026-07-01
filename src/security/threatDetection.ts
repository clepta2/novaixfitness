// src/security/threatDetection.js
// Deteccao de ameacas - re-exportacao e funcoes de resumo

import { supabase } from '../config/supabase';
export { detectAnomalies, calculateRiskLevel } from './anomalyDetection';
export { checkBruteForce } from './bruteForce';
export { checkAccountTakeover } from './accountTakeover';

export async function getSecurityEvents(userId, limit = 50) {
  const { data } = await supabase.from('security_events')
    .select('*').eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export async function getThreatSummary() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [bruteForce, anomalies, tamper] = await Promise.all([
    supabase.from('security_events').select('id', { count: 'exact', head: true })
      .eq('event_type', 'brute_force_attempt').gte('created_at', since),
    supabase.from('security_events').select('id', { count: 'exact', head: true })
      .eq('event_type', 'anomaly_detected').gte('created_at', since),
    supabase.from('security_events').select('id', { count: 'exact', head: true })
      .eq('event_type', 'tamper_attempt').gte('created_at', since),
  ]);
  return {
    bruteForceAttempts: bruteForce.count || 0,
    anomaliesDetected: anomalies.count || 0,
    tamperAttempts: tamper.count || 0,
    period: '24h',
  };
}
