// src/services/audioService.js
// Servico de audio - NOVAIX FITNESS

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

let isLoaded = false;

export async function loadSounds() {
  if (isLoaded) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    isLoaded = true;
  } catch (err) {
    console.error('Erro ao carregar sons:', err);
  }
}

function playSound(source: any) {
  if (!isLoaded) return;
  try {
    const player = createAudioPlayer(source);
    player.play();
    let attempts = 0;
    const maxAttempts = 25;
    const checkFinish = () => {
      attempts++;
      if (attempts >= maxAttempts) {
        player.remove();
        return;
      }
      if (player.currentTime >= player.duration && player.duration > 0) {
        player.remove();
      } else {
        setTimeout(checkFinish, 200);
      }
    };
    setTimeout(checkFinish, 200);
  } catch (err) {
    if (__DEV__) console.error('Erro ao tocar som:', err);
  }
}

export async function playCountdownTick() {
  playSound('countdown-tick');
}

export async function playPhaseEnd() {
  playSound('phase-end');
}

export async function playWorkoutComplete() {
  playSound('workout-complete');
}

export async function unloadSounds() {
  isLoaded = false;
}
