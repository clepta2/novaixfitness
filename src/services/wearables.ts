// src/services/wearables.js
// Wearables - re-exportacao

import { Platform } from 'react-native';
export { getHeartRate, getHeartRateHistory, logHeartRate } from './wearablesHeartRate';
export { getCaloriesBurned, getSteps, logSteps, getSleepData, logSleep, getDailySummary, syncDeviceData } from './wearablesActivity';

export function getPlatform() { return Platform.OS; }
export function isIOS() { return Platform.OS === 'ios'; }
export function isAndroid() { return Platform.OS === 'android'; }

export async function checkAppleWatch() {
  if (!isIOS()) return { available: false, platform: 'android' };
  return { available: true, platform: 'ios' };
}

export async function connectAppleWatch() {
  const check = await checkAppleWatch();
  if (!check.available) return { connected: false, reason: 'not_available' };
  return { connected: true, platform: 'apple_watch' };
}

export async function checkGoogleFit() {
  if (!isAndroid()) return { available: false, platform: 'ios' };
  return { available: true, platform: 'android' };
}

export async function connectGoogleFit() {
  const check = await checkGoogleFit();
  if (!check.available) return { connected: false, reason: 'not_available' };
  return { connected: true, platform: 'google_fit' };
}
