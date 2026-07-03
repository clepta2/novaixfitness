// src/services/hapticService.js
// Servico de feedback haptico - NOVAIX FITNESS

import * as Haptics from 'expo-haptics';
import { tryIf } from '../utils/tryIf';

export async function lightTick() {
  await tryIf(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, { retries: 2, baseDelay: 500 });
}

export async function mediumImpact() {
  await tryIf(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, { retries: 2, baseDelay: 500 });
}

export async function heavyImpact() {
  await tryIf(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, { retries: 2, baseDelay: 500 });
}

export async function notificationSuccess() {
  await tryIf(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, { retries: 2, baseDelay: 500 });
}

export async function notificationWarning() {
  await tryIf(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, { retries: 2, baseDelay: 500 });
}

export async function countdownTick(secondsLeft) {
  if (secondsLeft <= 3 && secondsLeft > 0) {
    await lightTick();
  }
}

export async function phaseChange() {
  await mediumImpact();
}

export async function workoutComplete() {
  await heavyImpact();
  setTimeout(async () => {
    await notificationSuccess();
  }, 200);
}
