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
  return { supabase: { from: jest.fn(() => ({ ...chain, insert: jest.fn().mockResolvedValue({ error: null }), select: jest.fn(() => ({ ...chain, eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null }) })) })) } };
});

import {
  requestNotificationPermission,
  registerForPushNotifications,
  scheduleWorkoutReminder,
  scheduleWeeklyPlanReminder,
  scheduleRestDayReminder,
  saveNotificationToDB,
  getUnreadCount,
  clearAllNotifications,
  getScheduledNotifications,
  setupNotificationListeners,
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
      require('react-native').Platform.OS = 'web';
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
      require('react-native').Platform.OS = 'android';
    });

    it('requests permission when not granted', async () => {
      Notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
      Notifications.requestPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });
  });

  describe('registerForPushNotifications', () => {
    it('returns null on web', async () => {
      require('react-native').Platform.OS = 'web';
      const result = await registerForPushNotifications('u1');
      expect(result).toBeNull();
      require('react-native').Platform.OS = 'android';
    });

    it('returns token when permission granted', async () => {
      const result = await registerForPushNotifications('u1');
      expect(result).toBe('ExpoPushToken[abc123]');
    });

    it('returns null when no permission', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
      const result = await registerForPushNotifications('u1');
      expect(result).toBeNull();
    });
  });

  describe('scheduleWorkoutReminder', () => {
    it('cancels existing and schedules new', async () => {
      await scheduleWorkoutReminder(19, 30);
      expect(Notifications.cancelScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({ title: 'Hora de treinar!' }),
          trigger: { hour: 19, minute: 30, repeats: true },
        })
      );
    });
  });

  describe('scheduleWeeklyPlanReminder', () => {
    it('schedules weekly notification', async () => {
      await scheduleWeeklyPlanReminder();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({ title: 'Seu plano da semana esta pronto!' }),
        })
      );
    });
  });

  describe('scheduleRestDayReminder', () => {
    it('schedules rest day notification', async () => {
      await scheduleRestDayReminder();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe('saveNotificationToDB', () => {
    it('does nothing without userId', async () => {
      await saveNotificationToDB(null, 'test', 'Title', 'Body');
    });

    it('inserts notification', async () => {
      const { supabase } = require('../../src/config/supabase');
      await saveNotificationToDB('u1', 'workout', 'Treino', 'Completo');
      expect(supabase.from).toHaveBeenCalledWith('notifications');
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
    it('cancels and dismisses all', async () => {
      await clearAllNotifications();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.dismissAllNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('getScheduledNotifications', () => {
    it('returns scheduled notifications', async () => {
      const result = await getScheduledNotifications();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('setupNotificationListeners', () => {
    it('registers response listener', () => {
      const nav = { navigate: jest.fn() };
      setupNotificationListeners(nav);
      expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
    });
  });
});
