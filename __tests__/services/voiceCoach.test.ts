import { setVoiceCoachEnabled, isVoiceCoachEnabled, speakWelcome, speakNextExercise, speakRestStart, speakHalfway, speakWorkoutComplete, stopSpeaking } from '../../src/services/voiceCoach';

import * as Speech from 'expo-speech';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
}));

const flush = () => new Promise(r => setTimeout(r, 50));

describe('voiceCoach', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setVoiceCoachEnabled(true);
  });

  describe('toggle', () => {
    it('starts enabled', () => {
      expect(isVoiceCoachEnabled()).toBe(true);
    });

    it('disables voice coach', () => {
      setVoiceCoachEnabled(false);
      expect(isVoiceCoachEnabled()).toBe(false);
    });

    it('re-enables voice coach', () => {
      setVoiceCoachEnabled(false);
      setVoiceCoachEnabled(true);
      expect(isVoiceCoachEnabled()).toBe(true);
    });
  });

  describe('speech functions', () => {
    it('speakWelcome calls Speech.speak', async () => {
      speakWelcome('Treino Peito');
      await flush();
      expect(Speech.speak).toHaveBeenCalledTimes(1);
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('Treino Peito'),
        expect.objectContaining({ language: 'pt-BR' })
      );
    });

    it('speakWelcome uses default name when none provided', async () => {
      speakWelcome();
      await flush();
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('Nix Inteligente'),
        expect.any(Object)
      );
    });

    it('speakNextExercise includes exercise details', async () => {
      speakNextExercise('Supino', 12, 80, 1, 3);
      await flush();
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('Supino'),
        expect.any(Object)
      );
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('12 repetições'),
        expect.any(Object)
      );
    });

    it('speakRestStart announces rest time', async () => {
      speakRestStart(90);
      await flush();
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('90 segundos'),
        expect.any(Object)
      );
    });

    it('speakHalfway motivates user', async () => {
      speakHalfway();
      await flush();
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('Metade'),
        expect.any(Object)
      );
    });

    it('speakWorkoutComplete congratulates', async () => {
      speakWorkoutComplete('HIIT');
      await flush();
      expect(Speech.speak).toHaveBeenCalledWith(
        expect.stringContaining('HIIT'),
        expect.any(Object)
      );
    });
  });

  describe('disabled state', () => {
    it('does not speak when disabled', async () => {
      setVoiceCoachEnabled(false);
      speakWelcome('Test');
      await flush();
      expect(Speech.speak).not.toHaveBeenCalled();
    });

    it('does not speak next exercise when disabled', async () => {
      setVoiceCoachEnabled(false);
      speakNextExercise('Test', 10, 50);
      await flush();
      expect(Speech.speak).not.toHaveBeenCalled();
    });
  });

  describe('stopSpeaking', () => {
    it('calls Speech.stop', async () => {
      await stopSpeaking();
      expect(Speech.stop).toHaveBeenCalled();
    });
  });
});
