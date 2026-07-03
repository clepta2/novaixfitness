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
  const player = createAudioPlayer(source);
  player.play();
  const checkFinish = () => {
    if (player.currentTime >= player.duration && player.duration > 0) {
      player.release();
    } else {
      setTimeout(checkFinish, 200);
    }
  };
  setTimeout(checkFinish, 200);
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
