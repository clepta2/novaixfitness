// src/security/antiTamperReporting.ts
// Report e resposta a ameacas

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import type { TamperCheck } from './antiTamperChecks';

export async function reportTamperAttempt(data: { type: string; severity?: string; [key: string]: unknown }) {
  try {
    const { supabase } = await import('../config/supabase');
    await supabase.from('security_events').insert({
      event_type: 'tamper_attempt',
      severity: data.severity || 'high',
      details: data,
      platform: Platform.OS,
      app_version: Application.nativeApplicationVersion,
      device_info: { brand: Device.brand, model: Device.modelName, os: Platform.OS, version: Platform.Version },
    });
  } catch (err) {
    if (__DEV__) console.error('Erro ao reportar tentativa de adulteracao:', err);
  }
}

export async function handleThreatResponse(threats: TamperCheck[]) {
  const critical = threats.filter(t => t.severity === 'critical');
  const high = threats.filter(t => t.severity === 'high');

  if (critical.length > 0) {
    return { action: 'limit', message: 'Atividade suspeita detectada. Algumas funcionalidades foram limitadas.', showWarning: true, disableFeatures: ['payment', 'chat', 'live'] };
  }
  if (high.length > 0) {
    return { action: 'monitor', message: null, showWarning: false, increasedMonitoring: true };
  }
  return { action: 'none' };
}
