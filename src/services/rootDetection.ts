// src/services/rootDetection.js
// Deteccao de root/jailbreak em dispositivos

import { Platform } from 'react-native';

const IOS_JAILBREAK_PATHS = [
  '/Applications/Cydia.app',
  '/Library/MobileSubstrate/MobileSubstrate.dylib',
  '/bin/bash',
  '/usr/sbin/sshd',
  '/etc/apt',
  '/private/var/lib/apt/',
];

const ANDROID_ROOT_PATHS = [
  '/system/app/Superuser.apk',
  '/system/xbin/su',
  '/system/bin/su',
  '/sbin/su',
  '/data/local/xbin/su',
  '/data/local/bin/su',
];

interface RootCheckResult {
  rooted: boolean;
  indicators?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  error?: string;
}

export async function isDeviceRooted(): Promise<RootCheckResult> {
  try {
    const indicators = await checkRootIndicators();
    return {
      rooted: indicators.length > 0,
      indicators,
      riskLevel: indicators.length > 2 ? 'high' : indicators.length > 0 ? 'medium' : 'low',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { rooted: false, error: message };
  }
}

async function checkRootIndicators(): Promise<string[]> {
  const indicators: string[] = [];
  if (__DEV__) console.warn('Root detection: verificacao de arquivos nao implementada');
  return indicators;
}

export function getSecurityRecommendations(rooted: boolean): string[] {
  if (!rooted) return [];
  return [
    'Seu dispositivo pode estar comprometido',
    'Evite fazer pagamentos neste dispositivo',
    'Considere usar um dispositivo nao-rooted',
    'Notifique o suporte se suspeitar atividade suspeita',
  ];
}
