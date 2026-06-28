// src/services/appleWatch.js
// Integracao Apple Watch - NOVAIX FITNESS

import { Platform } from 'react-native';

let watchConnected = false;

export async function checkWatchAvailability() {
  if (Platform.OS !== 'ios') {
    return { available: false, reason: 'ios_only' };
  }

  try {
    return { available: true, platform: 'watchos' };
  } catch {
    return { available: false };
  }
}

export async function connectWatch() {
  const check = await checkWatchAvailability();
  if (!check.available) return { connected: false, reason: check.reason };

  watchConnected = true;
  return { connected: true };
}

export function isWatchConnected() {
  return watchConnected;
}

export async function sendWorkoutToWatch(workout) {
  if (!watchConnected) return { sent: false, reason: 'not_connected' };

  const watchData = {
    name: workout.name,
    duration: workout.duration || 45,
    exercises: (workout.exercises || []).length,
    timer: { work: 45, rest: 15 },
  };

  return { sent: true, data: watchData };
}

export async function startWatchWorkout() {
  if (!watchConnected) return { started: false };
  return { started: true, startedAt: new Date().toISOString() };
}

export async function stopWatchWorkout() {
  if (!watchConnected) return { stopped: false };
  return {
    stopped: true,
    heartRate: null,
    calories: 0,
    duration: 0,
  };
}

export async function getWatchHeartRate() {
  if (!watchConnected) return null;
  return null;
}
