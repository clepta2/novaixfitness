jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Alert: { alert: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Share Service', () => {
  let shareWorkout, shareProgress;

  beforeEach(async () => {
    jest.resetModules();
    jest.doMock('expo-sharing', () => ({
      isAvailableAsync: jest.fn().mockResolvedValue(true),
      shareAsync: jest.fn().mockResolvedValue({}),
    }));
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
      Alert: { alert: jest.fn() },
    }));
    const mod = require('../../src/services/share');
    shareWorkout = mod.shareWorkout;
    shareProgress = mod.shareProgress;
  });

  describe('shareWorkout', () => {
    it('does nothing when workout is null', async () => {
      await shareWorkout(null);
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('shares workout with correct message', async () => {
      await shareWorkout({ name: 'Treino A', category: 'Musculação', duration: 45, level: 'Intermediário' });
      const Sharing = require('expo-sharing');
      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
      const msg = Sharing.shareAsync.mock.calls[0][0];
      expect(msg).toContain('Treino A');
      expect(msg).toContain('Musculação');
    });

    it('falls back to Alert when sharing unavailable', async () => {
      const Sharing = require('expo-sharing');
      Sharing.isAvailableAsync.mockResolvedValue(false);
      await shareWorkout({ name: 'Treino A' });
      const { Alert } = require('react-native');
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('shareProgress', () => {
    it('does nothing when stats is null', async () => {
      await shareProgress(null);
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('shares progress with stats', async () => {
      await shareProgress({ streak: 5, totalWorkouts: 20, totalMinutes: 600 });
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).toHaveBeenCalled();
      const msg = Sharing.shareAsync.mock.calls[0][0];
      expect(msg).toContain('5');
      expect(msg).toContain('20');
    });
  });
});
