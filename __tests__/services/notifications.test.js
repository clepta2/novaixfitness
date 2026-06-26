import {
  requestNotificationPermission,
  registerForPushNotifications,
  scheduleWorkoutReminder,
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
  saveNotificationToDB,
  getUnreadCount,
  clearAllNotifications,
  getScheduledNotifications,
  setupNotificationListeners,
} from '../../src/services/notifications';
import * as Notifications from 'expo-notifications';
import { supabase } from '../../src/config/supabase';

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Notifications Service', () => {
  describe('requestNotificationPermission', () => {
    it('returns true when permission granted', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
    });

    it('requests permission when not granted', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('returns false when permission denied', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });
  });

  describe('registerForPushNotifications', () => {
    it('returns null when no permission', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
      const result = await registerForPushNotifications('user-1');
      expect(result).toBeNull();
    });

    it('returns push token when permission granted', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'ExpoPushToken[xxx]' });
      supabase.from.mockReturnValue(mockChain());
      const result = await registerForPushNotifications('user-1');
      expect(result).toBe('ExpoPushToken[xxx]');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('updates profile with push token', async () => {
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'ExpoPushToken[xxx]' });
      supabase.from.mockReturnValue(mockChain());
      await registerForPushNotifications('user-1');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });

  describe('scheduleWorkoutReminder', () => {
    it('cancels existing notifications and schedules new one', async () => {
      Notifications.cancelScheduledNotificationsAsync.mockResolvedValue();
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await scheduleWorkoutReminder(19, 0);
      expect(Notifications.cancelScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Hora de treinar!',
          }),
          trigger: { hour: 19, minute: 0, repeats: true },
        })
      );
    });
  });

  describe('sendWorkoutCompletedNotification', () => {
    it('sends notification with workout name and XP', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendWorkoutCompletedNotification('Treino A', 50);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Treino concluido!',
            body: 'Treino A finalizado. +50 XP ganho!',
          }),
          trigger: null,
        })
      );
    });
  });

  describe('sendStreakNotification', () => {
    it('sends streak notification for 3 days', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendStreakNotification(3);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Streak de 3 dias!',
            body: 'Voce esta pegando fogo! 3 dias seguidos!',
          }),
        })
      );
    });

    it('sends streak notification for 7 days', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendStreakNotification(7);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Streak de 7 dias!',
            body: 'Uma semana completa! Voce e incrivel!',
          }),
        })
      );
    });

    it('sends default message for unknown streak', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendStreakNotification(5);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: 'Continue assim! Voce esta indo muito bem.',
          }),
        })
      );
    });
  });

  describe('sendAchievementNotification', () => {
    it('sends achievement notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendAchievementNotification('Primeiro Treino', 100);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Conquista desbloqueada!',
            body: 'Primeiro Treino +100 XP',
          }),
        })
      );
    });
  });

  describe('sendLevelUpNotification', () => {
    it('sends level up notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendLevelUpNotification(' bronze', 2);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Nivel 2!',
            body: 'Parabens! Voce alcancou o nivel  bronze!',
          }),
        })
      );
    });
  });

  describe('sendNewWorkoutNotification', () => {
    it('sends new workout notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendNewWorkoutNotification('HIIT Advanced');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Novo treino disponivel!',
            body: 'HIIT Advanced acabou de chegar. Confira agora!',
          }),
        })
      );
    });
  });

  describe('sendWeeklySummaryNotification', () => {
    it('sends weekly summary notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendWeeklySummaryNotification(5, 150);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Resumo da semana',
            body: '5 treinos, 150 minutos. Continue firme!',
          }),
        })
      );
    });
  });

  describe('sendRestReminder', () => {
    it('sends rest reminder notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendRestReminder();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Tempo de descanso!',
          }),
        })
      );
    });
  });

  describe('sendMotivationalNotification', () => {
    it('sends motivational notification', async () => {
      Notifications.scheduleNotificationAsync.mockResolvedValue();
      await sendMotivationalNotification();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Motivacao do dia',
          }),
        })
      );
    });
  });

  describe('saveNotificationToDB', () => {
    it('does nothing for null userId', async () => {
      await saveNotificationToDB(null, 'type', 'title', 'body');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('saves notification to database', async () => {
      supabase.from.mockReturnValue(mockChain());
      await saveNotificationToDB('user-1', 'workout', 'Title', 'Body', { id: '1' });
      expect(supabase.from).toHaveBeenCalledWith('notifications');
    });
  });

  describe('getUnreadCount', () => {
    it('returns 0 for null userId', async () => {
      const result = await getUnreadCount(null);
      expect(result).toBe(0);
    });

    it('returns unread count', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ count: 5, error: null })),
      };
      supabase.from.mockReturnValue(chain);
      const result = await getUnreadCount('user-1');
      expect(result).toBe(5);
    });

    it('returns 0 on error', async () => {
      const errorChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: (resolve) => resolve({ count: null, error: new Error('DB error') }),
      };
      supabase.from.mockReturnValue(errorChain);
      const result = await getUnreadCount('user-1');
      expect(result).toBe(0);
    });
  });

  describe('clearAllNotifications', () => {
    it('cancels and dismisses all notifications', async () => {
      Notifications.cancelAllScheduledNotificationsAsync.mockResolvedValue();
      Notifications.dismissAllNotificationsAsync.mockResolvedValue();
      await clearAllNotifications();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.dismissAllNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('getScheduledNotifications', () => {
    it('returns scheduled notifications', async () => {
      Notifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
      const result = await getScheduledNotifications();
      expect(result).toEqual([]);
    });
  });

  describe('setupNotificationListeners', () => {
    it('adds notification response listener', () => {
      const mockNavigate = jest.fn();
      setupNotificationListeners({ navigate: mockNavigate });
      expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();
    });
  });
});
