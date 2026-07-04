jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    remove: jest.fn(),
    currentTime: 0,
    duration: 1,
  })),
  setAudioModeAsync: jest.fn().mockResolvedValue({}),
}));

import {
  loadSounds,
  playCountdownTick,
  playPhaseEnd,
  playWorkoutComplete,
  unloadSounds,
} from '../../src/services/audioService';

const { createAudioPlayer, setAudioModeAsync } = require('expo-audio');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Audio Service', () => {
  describe('loadSounds', () => {
    it('sets audio mode', async () => {
      await loadSounds();
      expect(setAudioModeAsync).toHaveBeenCalled();
    });

    it('skips loading if already loaded', async () => {
      await loadSounds();
      setAudioModeAsync.mockClear();
      await loadSounds();
      expect(setAudioModeAsync).not.toHaveBeenCalled();
    });
  });

  describe('playCountdownTick', () => {
    it('creates and plays sound', async () => {
      await loadSounds();
      await playCountdownTick();
      expect(createAudioPlayer).toHaveBeenCalled();
    });

    it('does nothing if not loaded', async () => {
      jest.resetModules();
      jest.mock('expo-audio', () => ({
        createAudioPlayer: jest.fn(),
        setAudioModeAsync: jest.fn().mockResolvedValue({}),
      }));
      const { playCountdownTick: freshPlay } = require('../../src/services/audioService');
      await freshPlay();
      expect(require('expo-audio').createAudioPlayer).not.toHaveBeenCalled();
    });
  });

  describe('playPhaseEnd', () => {
    it('creates and plays sound', async () => {
      await loadSounds();
      await playPhaseEnd();
      expect(createAudioPlayer).toHaveBeenCalled();
    });
  });

  describe('playWorkoutComplete', () => {
    it('creates and plays sound', async () => {
      await loadSounds();
      await playWorkoutComplete();
      expect(createAudioPlayer).toHaveBeenCalled();
    });
  });

  describe('unloadSounds', () => {
    it('can be called without error', async () => {
      await unloadSounds();
    });
  });
});
