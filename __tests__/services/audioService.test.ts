// __tests__/services/audioService.test.ts
// Tests for audioService — sounds are no-ops until assets/sounds/ is populated

jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: { playAsync: jest.fn().mockResolvedValue({}), unloadAsync: jest.fn().mockResolvedValue({}), setOnPlaybackStatusUpdate: jest.fn() },
        status: { isLoaded: true },
      }),
    },
  },
}));

import {
  loadSounds,
  playCountdownTick,
  playPhaseEnd,
  playWorkoutComplete,
  unloadSounds,
} from '../../src/services/audioService';

const { Audio } = require('expo-av');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Audio Service', () => {
  describe('loadSounds', () => {
    it('sets audio mode', async () => {
      await loadSounds();
      expect(Audio.setAudioModeAsync).toHaveBeenCalled();
    });

    it('skips loading if already loaded', async () => {
      await loadSounds();
      Audio.setAudioModeAsync.mockClear();
      await loadSounds();
      expect(Audio.setAudioModeAsync).not.toHaveBeenCalled();
    });
  });

  describe('playCountdownTick', () => {
    it('does nothing when no sound assets', async () => {
      await loadSounds();
      await playCountdownTick();
      // No-ops until assets/sounds/ is populated
      expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
    });
  });

  describe('playPhaseEnd', () => {
    it('does nothing when no sound assets', async () => {
      await loadSounds();
      await playPhaseEnd();
      expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
    });
  });

  describe('playWorkoutComplete', () => {
    it('does nothing when no sound assets', async () => {
      await loadSounds();
      await playWorkoutComplete();
      expect(Audio.Sound.createAsync).not.toHaveBeenCalled();
    });
  });

  describe('unloadSounds', () => {
    it('can be called without error', async () => {
      await unloadSounds();
    });
  });
});
