jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue({}),
}));

jest.mock('expo-file-system', () => ({
  cacheDirectory: '/tmp/',
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Alert: { alert: jest.fn() },
}));

jest.mock('../../src/utils/tryIf', () => ({
  tryIf: jest.fn(async (fn) => {
    try {
      const data = await fn();
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error };
    }
  }),
}));

jest.mock('../../src/config/app', () => ({
  APP_CONFIG: { links: { website: 'https://novaix.fitness' } },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Share Service', () => {
  let shareWorkout, shareProgress, shareAchievement;

  beforeEach(async () => {
    jest.resetModules();
    jest.doMock('expo-sharing', () => ({
      isAvailableAsync: jest.fn().mockResolvedValue(true),
      shareAsync: jest.fn().mockResolvedValue({}),
    }));
    jest.doMock('expo-file-system', () => ({
      cacheDirectory: '/tmp/',
      writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
    }));
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
      Alert: { alert: jest.fn() },
    }));
    jest.doMock('../../src/utils/tryIf', () => ({
      tryIf: jest.fn(async (fn) => {
        try {
          const data = await fn();
          return { ok: true, data };
        } catch (error) {
          return { ok: false, error };
        }
      }),
    }));
    jest.doMock('../../src/config/app', () => ({
      APP_CONFIG: { links: { website: 'https://novaix.fitness' } },
    }));
    const mod = require('../../src/services/share');
    shareWorkout = mod.shareWorkout;
    shareProgress = mod.shareProgress;
    shareAchievement = mod.shareAchievement;
  });

  describe('shareWorkout', () => {
    it('does nothing when workout is null', async () => {
      await shareWorkout(null);
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('shares workout with file', async () => {
      await shareWorkout({ name: 'Treino A', category: 'Musculação', duration: 45, level: 'Intermediário' });
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });
  });

  describe('shareAchievement', () => {
    it('does nothing when achievement is null', async () => {
      await shareAchievement(null);
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });

    it('shares achievement with file', async () => {
      await shareAchievement({ name: 'Centenario', description: 'Complete 100 treinos', icon: '💯' });
      const Sharing = require('expo-sharing');
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });
  });
});
