import { APP_CONFIG } from '../../src/config/app';

const { defaultPrefs } = APP_CONFIG.notifications;

jest.mock('../../src/config/supabase', () => {
  let resolvedData = { data: null, error: null };
  const singleMock = jest.fn(() => Promise.resolve(resolvedData));
  const eqMock = jest.fn(() => ({ single: singleMock }));
  const selectMock = jest.fn(() => ({ eq: eqMock }));
  const updateMock = jest.fn(() => ({ eq: jest.fn(() => Promise.resolve({ error: null })) }));
  return {
    supabase: {
      from: jest.fn(() => ({ select: selectMock, update: updateMock })),
      _setResponse: (d) => { resolvedData = d; },
    },
  };
});

const { supabase } = require('../../src/config/supabase');
const { getNotificationPrefs, isNotificationEnabled, getNotificationGroups, getPrefsForSettings } = require('../../src/services/notificationPrefs');

describe('notificationPrefs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    supabase._setResponse({ data: null, error: null });
  });

  describe('getNotificationPrefs', () => {
    it('returns defaults when no userId', async () => {
      const prefs = await getNotificationPrefs(null);
      expect(prefs).toEqual(defaultPrefs);
    });

    it('merges user prefs with defaults', async () => {
      supabase._setResponse({
        data: { notification_prefs: { streak: false, achievement: false } },
      });
      const prefs = await getNotificationPrefs('user1');
      expect(prefs.streak).toBe(false);
      expect(prefs.workout_reminder).toBe(true);
    });
  });

  describe('isNotificationEnabled', () => {
    it('returns true when no userId', async () => {
      expect(await isNotificationEnabled(null, 'streak')).toBe(true);
    });

    it('returns true for enabled type', async () => {
      supabase._setResponse({
        data: { notification_prefs: { streak: true } },
      });
      expect(await isNotificationEnabled('user1', 'streak')).toBe(true);
    });

    it('returns false for disabled type', async () => {
      supabase._setResponse({
        data: { notification_prefs: { streak: false } },
      });
      expect(await isNotificationEnabled('user1', 'streak')).toBe(false);
    });
  });

  describe('getNotificationGroups', () => {
    it('groups types by group field', () => {
      const groups = getNotificationGroups();
      expect(groups.treino).toBeDefined();
      expect(groups.progresso).toBeDefined();
      expect(groups.lembretes).toBeDefined();
    });
  });

  describe('getPrefsForSettings', () => {
    it('returns array of setting groups', () => {
      const result = getPrefsForSettings();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(group => {
        expect(group.title).toBeDefined();
        expect(group.items).toBeDefined();
        group.items.forEach(item => {
          expect(item.key).toBeDefined();
          expect(item.label).toBeDefined();
        });
      });
    });
  });
});
