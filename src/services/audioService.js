// src/services/audioService.js
// Servico de audio - NOVAIX FITNESS

import { Audio } from 'expo-av';

let countdownSound = null;
let phaseEndSound = null;
let workoutCompleteSound = null;
let isLoaded = false;

export async function loadSounds() {
  if (isLoaded) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    isLoaded = true;
  } catch (err) {
    console.error('Erro ao carregar sons:', err);
  }
}

export async function playCountdownTick() {
  if (!isLoaded) return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/countdown-tick.mp3'),
      { volume: 0.5 }
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch {}
}

export async function playPhaseEnd() {
  if (!isLoaded) return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/phase-end.mp3'),
      { volume: 0.7 }
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch {}
}

export async function playWorkoutComplete() {
  if (!isLoaded) return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/workout-complete.mp3'),
      { volume: 0.8 }
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch {}
}

export async function unloadSounds() {
  try {
    if (countdownSound) await countdownSound.unloadAsync();
    if (phaseEndSound) await phaseEndSound.unloadAsync();
    if (workoutCompleteSound) await workoutCompleteSound.unloadAsync();
    isLoaded = false;
  } catch {}
}
