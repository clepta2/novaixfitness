jest.mock('expo-notifications', () => ({
  cancelScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([
    { content: { data: { type: 'workout_reminder' } } },
    { content: { data: { type: 'rest_day' } } },
    { content: { data: { type: 'other' } } },
  ]),
}));

jest.mock('../../src/config/supabase', () => {
  const chain = {
    select: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    gte: jest.fn(() => chain),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    limit: jest.fn(() => chain),
  };
  return { supabase: { from: jest.fn(() => chain) } };
});

import {
  setupWorkoutReminders,
  sendStreakProtectionReminder,
  sendPostWorkoutReminder,
  sendWeeklySummaryReminder,
  cancelAllWorkoutReminders,
  getActiveReminders,
} from '../../src/services/workout-reminders';

const Notifications = require('expo-notifications');
const { supabase } = require('../../src/config/supabase');

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Workout Reminders', () => {
  describe('setupWorkoutReminders', () => {
    it('does nothing when reminder not enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { notification_settings: { workout_reminder: false } } });
      await setupWorkoutReminders('u1');
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('schedules reminders for workout days', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({
        data: {
          onboarding: { daysPerWeek: [1, 3, 5] },
          notification_settings: { workout_reminder: true, reminder_time: '19:30' },
        },
      });
      await setupWorkoutReminders('u1');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(3);
    });

    it('schedules rest day reminders when enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({
        data: {
          onboarding: { daysPerWeek: [1, 3, 5] },
          notification_settings: { workout_reminder: true, reminder_time: '19:00', rest_day: true },
        },
      });
      await setupWorkoutReminders('u1');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });

    it('schedules weekly plan when enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({
        data: {
          onboarding: { daysPerWeek: [1, 3] },
          notification_settings: { workout_reminder: true, reminder_time: '19:00', weekly_plan: true },
        },
      });
      await setupWorkoutReminders('u1');
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const weeklyCall = calls.find(c => c[0].content.data.type === 'weekly_plan');
      expect(weeklyCall).toBeDefined();
    });

    it('schedules motivational when enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({
        data: {
          onboarding: { daysPerWeek: [1] },
          notification_settings: { workout_reminder: true, reminder_time: '19:00', motivational: true },
        },
      });
      await setupWorkoutReminders('u1');
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const motivationalCall = calls.find(c => c[0].content.data.type === 'motivational');
      expect(motivationalCall).toBeDefined();
    });
  });

  describe('sendStreakProtectionReminder', () => {
    it('does nothing when streak not enabled', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { notification_settings: { streak: false } } });
      await sendStreakProtectionReminder('u1');
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('sends reminder when no workout today', async () => {
      const chain = supabase.from();
      chain.single.mockResolvedValue({ data: { notification_settings: { streak: true } } });
      chain.limit.mockResolvedValue({ data: [], error: null });
      await sendStreakProtectionReminder('u1');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe('sendPostWorkoutReminder', () => {
    it('sends immediate notification', async () => {
      await sendPostWorkoutReminder('u1', 'Treino A');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe('sendWeeklySummaryReminder', () => {
    it('sends summary with stats', async () => {
      const chain = supabase.from();
      chain.gte.mockResolvedValue({ data: [{ duration: 30 }, { duration: 45 }], error: null });
      await sendWeeklySummaryReminder('u1');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
      const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
      expect(call.content.body).toContain('2');
    });
  });

  describe('cancelAllWorkoutReminders', () => {
    it('cancels all scheduled notifications', async () => {
      await cancelAllWorkoutReminders();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('getActiveReminders', () => {
    it('filters only workout-related notifications', async () => {
      const result = await getActiveReminders();
      expect(result).toHaveLength(2);
      expect(result.every(n => ['workout_reminder', 'rest_day', 'weekly_plan', 'motivational'].includes(n.content.data.type))).toBe(true);
    });
  });
});
