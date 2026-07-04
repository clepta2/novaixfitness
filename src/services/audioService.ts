// src/services/audioService.ts
// Servico de audio - NOVAIX FITNESS

import { Audio } from 'expo-av';

let isLoaded = false;

export async function loadSounds() {
  if (isLoaded) return;
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    isLoaded = true;
  } catch (err) {
    // Silent fail — audio is non-critical
  }
}

async function playSound(source: ReturnType<typeof require> | null) {
  if (!isLoaded || !source) return;
  try {
    const { sound } = await Audio.Sound.createAsync(source);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (err) {
    // Silent fail — audio is non-critical
  }
}

export async function playCountdownTick() {
  // Sound assets not yet added — no-op until assets/sounds/ is populated
}

export async function playPhaseEnd() {
  // Sound assets not yet added — no-op until assets/sounds/ are populated
}

export async function playWorkoutComplete() {
  // Sound assets not yet added — no-op until assets/sounds/ are populated
}

export async function unloadSounds() {
  isLoaded = false;
}
