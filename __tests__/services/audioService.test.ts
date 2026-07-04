jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn().mockResolvedValue({}),
          setOnPlaybackStatusUpdate: jest.fn(),
          unloadAsync: jest.fn().mockResolvedValue({}),
        },
      }),
    },
  },
}));

jest.mock('../../assets/sounds/countdown-tick.mp3', () => 'tick', { virtual: true });
jest.mock('../../assets/sounds/phase-end.mp3', () => 'phase', { virtual: true });
jest.mock('../../assets/sounds/workout-complete.mp3', () => 'complete', { virtual: true });

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
    it('creates and plays sound', async () => {
      await loadSounds();
      await playCountdownTick();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });

    it('does nothing if not loaded', async () => {
      jest.resetModules();
      jest.mock('expo-av', () => ({
        Audio: {
          setAudioModeAsync: jest.fn().mockResolvedValue({}),
          Sound: { createAsync: jest.fn() },
        },
      }));
      const { playCountdownTick: freshPlay } = require('../../src/services/audioService');
      await freshPlay();
      expect(require('expo-av').Audio.Sound.createAsync).not.toHaveBeenCalled();
    });
  });

  describe('playPhaseEnd', () => {
    it('creates and plays sound', async () => {
      await loadSounds();
      await playPhaseEnd();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });
  });

  describe('playWorkoutComplete', () => {
    it('creates and plays sound', async () => {
      await loadSounds();
      await playWorkoutComplete();
      expect(Audio.Sound.createAsync).toHaveBeenCalled();
    });
  });

  describe('unloadSounds', () => {
    it('can be called without error', async () => {
      await unloadSounds();
    });
  });
});
