// src/services/strava.js
// Integracao Strava / Corrida - NOVAIX FITNESS

import { Linking } from 'react-native';
import { tryIf } from '../utils/tryIf';

let stravaConnected = false;
let stravaToken = null;

export async function checkStravaAvailability() {
  const result = await tryIf(async () => {
    const canOpen = await Linking.canOpenURL('strava://');
    return { available: canOpen };
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : { available: false };
}

export async function connectStrava() {
  const result = await tryIf(async () => {
    const clientId = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID;
    if (!clientId) return { started: false, error: 'Strava não configurado' };
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&scope=read,activity:read_all&redirect_uri=novaix://strava-callback`;
    await Linking.openURL(authUrl);
    return { started: true };
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : { started: false };
}

export function isStravaConnected() {
  return stravaConnected;
}

export async function syncRunningActivities() {
  if (!stravaConnected) return { synced: false, reason: 'not_connected' };

  return {
    synced: true,
    activities: [],
    lastSync: new Date().toISOString(),
  };
}

export async function getRunningStats() {
  if (!stravaConnected) return null;

  return {
    totalRuns: 0,
    totalDistance: 0,
    totalDuration: 0,
    avgPace: '0:00',
    lastActivity: null,
  };
}

export async function disconnectStrava() {
  stravaConnected = false;
  stravaToken = null;
  return { disconnected: true };
}
