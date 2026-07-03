// src/services/tutorial.js
// Serviço de tutorial interativo - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { TUTORIALS, TUTORIAL_STORAGE_KEY } from '../data/tutorials';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryIf } from '../utils/tryIf';

export async function hasCompletedTutorial(userId, screenId = 'home') {
  if (!userId) return false;

  const result = await tryIf(async () => {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (stored) {
      const completed = JSON.parse(stored);
      return completed[screenId] === true;
    }

    const { data } = await supabase
      .from('profiles')
      .select('tutorial_completed')
      .eq('id', userId)
      .single();

    return data?.tutorial_completed === true;
  }, { retries: 1, baseDelay: 500 });

  return result.ok ? result.data! : false;
}

export async function completeTutorial(userId, screenId = 'home') {
  if (!userId) return;

  await tryIf(async () => {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    const completed = stored ? JSON.parse(stored) : {};
    completed[screenId] = true;
    await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(completed));

    if (screenId === 'home') {
      await supabase
        .from('profiles')
        .update({ tutorial_completed: true, current_step: 'home' })
        .eq('id', userId);
    }
  }, { retries: 2, baseDelay: 500 });
}

export async function markTutorialSkipped(userId, screenId = 'home') {
  if (!userId) return;

  await tryIf(async () => {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    const completed = stored ? JSON.parse(stored) : {};
    completed[screenId] = true;
    await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(completed));

    if (screenId === 'home') {
      await supabase
        .from('profiles')
        .update({ tutorial_skipped: true, current_step: 'home' })
        .eq('id', userId);
    }
  }, { retries: 2, baseDelay: 500 });
}

export function getTutorialSteps(screenId = 'home') {
  const tutorial = TUTORIALS[screenId];
  return tutorial ? tutorial.steps : [];
}

export function getAllTutorials() {
  return TUTORIALS;
}

export function getStepForScreen(screenName) {
  const steps = [];
  Object.values(TUTORIALS).forEach(tutorial => {
    const screenSteps = tutorial.steps.filter(step => step.screen === screenName);
    steps.push(...screenSteps);
  });
  return steps;
}

export async function hasCompletedAnyTutorial(userId) {
  const result = await tryIf(async () => {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (stored) {
      const completed = JSON.parse(stored);
      return Object.values(completed).some(v => v === true);
    }
    return false;
  }, { retries: 1, baseDelay: 500 });

  if (result.ok && result.data) return result.data;

  const supaResult = await tryIf(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('tutorial_completed')
      .eq('id', userId)
      .single();
    return data?.tutorial_completed === true;
  }, { retries: 1, baseDelay: 500 });

  return supaResult.ok ? supaResult.data! : false;
}

export async function resetAllTutorials(userId) {
  await tryIf(async () => {
    await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
    if (userId) {
      await supabase
        .from('profiles')
        .update({ tutorial_completed: false, tutorial_skipped: false })
        .eq('id', userId);
    }
  }, { retries: 2, baseDelay: 500 });
}

export async function resetTutorialForScreen(userId, screenId) {
  await tryIf(async () => {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    const completed = stored ? JSON.parse(stored) : {};
    delete completed[screenId];
    await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(completed));

    if (screenId === 'home' && userId) {
      await supabase
        .from('profiles')
        .update({ tutorial_completed: false, tutorial_skipped: false })
        .eq('id', userId);
    }
  }, { retries: 2, baseDelay: 500 });
}
