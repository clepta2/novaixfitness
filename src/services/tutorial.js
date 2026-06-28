// src/services/tutorial.js
// Serviço de tutorial interativo - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import { TUTORIALS, TUTORIAL_STORAGE_KEY } from '../data/tutorials';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function hasCompletedTutorial(userId, screenId = 'home') {
  if (!userId) return false;

  try {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (stored) {
      const completed = JSON.parse(stored);
      return completed[screenId] === true;
    }
  } catch (err) {
    if (__DEV__) console.error('Erro ao ler tutoriais do storage:', err);
  }

  const { data } = await supabase
    .from('profiles')
    .select('tutorial_completed')
    .eq('id', userId)
    .single();

  return data?.tutorial_completed === true;
}

export async function completeTutorial(userId, screenId = 'home') {
  if (!userId) return;

  try {
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
  } catch (err) {
    console.error('Erro ao completar tutorial:', err);
  }
}

export async function markTutorialSkipped(userId, screenId = 'home') {
  if (!userId) return;

  try {
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
  } catch (err) {
    console.error('Erro ao marcar tutorial como pulado:', err);
  }
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
  try {
    const stored = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (stored) {
      const completed = JSON.parse(stored);
      return Object.values(completed).some(v => v === true);
    }
  } catch (err) {
    if (__DEV__) console.error('Erro ao verificar tutoriais:', err);
  }

  const { data } = await supabase
    .from('profiles')
    .select('tutorial_completed')
    .eq('id', userId)
    .single();

  return data?.tutorial_completed === true;
}

export async function resetAllTutorials(userId) {
  try {
    await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
    if (userId) {
      await supabase
        .from('profiles')
        .update({ tutorial_completed: false, tutorial_skipped: false })
        .eq('id', userId);
    }
  } catch (err) {
    console.error('Erro ao resetar tutoriais:', err);
  }
}

export async function resetTutorialForScreen(userId, screenId) {
  try {
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
  } catch (err) {
    console.error('Erro ao resetar tutorial:', err);
  }
}
