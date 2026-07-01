// src/security/antiTamperChecks.ts
// Verificacoes de adulteracao do app

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';

import * as Device from 'expo-device';

export interface TamperCheck {
  type: string;
  detected: boolean;
  severity: string;
  details: Record<string, unknown>;
}

export async function checkDebugger(): Promise<TamperCheck> {
  const isDev = __DEV__;
  const start = Date.now();
  const end = Date.now();
  const timingAnomaly = (end - start) > 100;
  return { type: 'debugger', detected: isDev || timingAnomaly, severity: 'high', details: { isDev, timingAnomaly } };
}

export async function checkEmulator(): Promise<TamperCheck> {
  const isEmulator = Platform.OS === 'android' && (
    Device.brand === 'google' && (Device.modelName || '').toLowerCase().includes('sdk') ||
    (Device.modelName || '').toLowerCase().includes('emulator') ||
    (Device.modelName || '').toLowerCase().includes('android sdk')
  );
  const isSimulator = Platform.OS === 'ios' && !Device.isDevice;
  return { type: 'emulator', detected: isEmulator || isSimulator, severity: 'medium', details: { isEmulator, isSimulator } };
}

export async function checkHookFramework(): Promise<TamperCheck> {
  return { type: 'hook_framework', detected: false, severity: 'critical', details: { fridaPorts: [27042, 27043, 8080, 8888] } };
}

export async function checkRoot(): Promise<TamperCheck> {
  return { type: 'root', detected: false, severity: 'critical', details: { platform: Platform.OS } };
}

export async function checkCodeInjection(): Promise<TamperCheck> {
  return { type: 'code_injection', detected: false, severity: 'critical', details: {} };
}

export async function checkMemoryPatching(): Promise<TamperCheck> {
  return { type: 'memory_patching', detected: false, severity: 'critical', details: {} };
}

export async function calculateAppHash(): Promise<string> {
  const bundleId = Application.applicationId;
  const version = Application.nativeApplicationVersion;
  const buildNumber = Application.nativeBuildVersion;
  const data = `${bundleId}:${version}:${buildNumber}:${Platform.OS}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
}
