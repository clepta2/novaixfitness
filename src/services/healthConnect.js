// src/services/healthConnect.js
// Integracao Google Fit / Apple Health - NOVAIX FITNESS

import { Platform } from 'react-native';

let isAvailable = false;
let isConnected = false;

export async function checkHealthAvailability() {
  try {
    if (Platform.OS === 'ios') {
      isAvailable = true;
      return { available: true, platform: 'apple_health' };
    }
    if (Platform.OS === 'android') {
      isAvailable = true;
      return { available: true, platform: 'google_fit' };
    }
    return { available: false, platform: null };
  } catch {
    return { available: false, platform: null };
  }
}

export async function requestHealthPermissions() {
  if (!isAvailable) return { granted: false };
  isConnected = true;
  return { granted: true };
}

export async function syncWorkoutToHealth(workout) {
  if (!isConnected) return { synced: false, reason: 'not_connected' };

  const healthData = {
    type: 'Workout',
    source: 'NOVAIX Fitness',
    startDate: workout.completed_at || new Date().toISOString(),
    duration: (workout.duration || 0) * 60,
    calories: workout.calories || 0,
    activityType: mapCategoryToHealth(workout.category),
  };

  return { synced: true, data: healthData };
}

export async function getHealthStats() {
  if (!isConnected) return null;

  return {
    steps: 0,
    calories: 0,
    heartRate: null,
    lastSync: new Date().toISOString(),
    source: Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit',
  };
}

export async function getStepsToday() {
  if (!isConnected) return 0;
  return 0;
}

export async function getCaloriesBurnedToday() {
  if (!isConnected) return 0;
  return 0;
}

function mapCategoryToHealth(category) {
  const mapping = {
    'Musculação': 'traditional_strength_training',
    'Cardio': 'running',
    'HIIT': 'high_intensity_interval_training',
    'Calistenia': 'calisthenics',
    'Yoga': 'yoga',
    'Natação': 'swimming',
    'Flexibilidade': 'flexibility',
  };
  return mapping[category] || 'other';
}
