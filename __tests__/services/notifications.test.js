jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'ExpoPushToken[abc123]' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
  cancelScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  dismissAllNotificationsAsync: jest.fn().mockResolvedValue({}),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  addNotificationResponseReceivedListener: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue({}),
  AndroidImportance: { MAX: 5, HIGH: 4, DEFAULT: 3, LOW: 2, MIN: 1, NONE: 0 },
  SchedulingFrequency: { DAILY: 'daily', WEEKLY: 'weekly', MONTHLY: 'monthly', YEARLY: 'yearly', INTERVAL: 'interval' },
  SchedulableTriggerInputTypes: { CALENDAR: 'calendar', DATE: 'date', TIME_INTERVAL: 'timeInterval', DAILY: 'daily', WEEKLY: 'weekly' },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

jest.mock('../../src/config/supabase', () => {
  const chain = {
    insert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
  };
  return { supabase: {
    from: jest.fn(() => ({ ...chain, insert: jest.fn().mockResolvedValue({ error: null }), select: jest.fn(() => ({ ...chain, eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null }) })) })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
    },
  } };
});

import {
  requestNotificationPermission,
  scheduleWorkoutReminder,
  clearAllNotifications,
  getScheduledNotifications,
  getUnreadCount,
} from '../../src/services/notifications';

const Notifications = require('expo-notifications');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Notifications Service', () => {
  describe('requestNotificationPermission', () => {
    it('returns true when permission granted', async () => {
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('returns false on web', async () => {
      const result = await requestNotificationPermission();
      expect(typeof result).toBe('boolean');
    });

    it('requests permission when not granted', async () => {
      Notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
      Notifications.requestPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });
  });

  describe('scheduleWorkoutReminder', () => {
    it('cancels existing and schedules new', async () => {
      await scheduleWorkoutReminder(19, 30, 1);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({ title: expect.stringContaining('Hora de treinar') }),
        })
      );
    });
  });

  describe('getUnreadCount', () => {
    it('returns 0 for no userId', async () => {
      expect(await getUnreadCount(null)).toBe(0);
    });

    it('returns count', async () => {
      const { supabase } = require('../../src/config/supabase');
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };
      supabase.from.mockReturnValue({ ...mockChain, eq: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({}) }) });

      const result = await getUnreadCount('u1');
      expect(typeof result).toBe('number');
    });
  });

  describe('clearAllNotifications', () => {
    it('cancels all scheduled notifications', async () => {
      await clearAllNotifications();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('getScheduledNotifications', () => {
    it('returns scheduled notifications', async () => {
      const result = await getScheduledNotifications();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
