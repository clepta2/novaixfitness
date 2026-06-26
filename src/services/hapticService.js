// src/services/hapticService.js
// Servico de feedback haptico - NOVAIX FITNESS

import * as Haptics from 'expo-haptics';

export async function lightTick() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export async function mediumImpact() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

export async function heavyImpact() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {}
}

export async function notificationSuccess() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}

export async function notificationWarning() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {}
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
