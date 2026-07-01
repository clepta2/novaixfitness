jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'ExponentPushToken[test]' }),
  cancelScheduledNotificationsAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  addNotificationResponseReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addNotificationReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
}));

jest.mock('../../src/config/app', () => ({
  APP_CONFIG: {
    notifications: {
      workoutReminder: { hour: 19, minute: 0 },
      weeklyPlan: { weekday: 1, hour: 9, minute: 0 },
      restDay: { weekday: 0, hour: 10, minute: 0 },
      defaultPrefs: {},
      streakMessages: { 7: 'Uma semana completa!' },
      motivationalTips: ['Beba agua!', 'Descanse bem!'],
      types: {},
    },
    apis: { geminiBaseUrl: '' },
  },
}));

jest.mock('../../src/config/supabase', () => {
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = jest.fn(() => Promise.resolve({ data: null, error: null }));
  chain.update = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: { notification_prefs: {} }, error: null }));
  return { supabase: chain };
});

import {
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
} from '../../src/services/notifications';

const Notifications = require('expo-notifications');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Notifications Sender', () => {
  it('sendWorkoutCompletedNotification schedules with correct content', async () => {
    await sendWorkoutCompletedNotification('Treino A', 50);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Treino concluido!',
          body: expect.stringContaining('Treino A'),
        }),
      })
    );
  });

  it('sendStreakNotification uses custom message for milestone days', async () => {
    await sendStreakNotification(7);
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('semana');
  });

  it('sendStreakNotification uses default message for non-milestone days', async () => {
    await sendStreakNotification(5);
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('Continue assim');
  });

  it('sendAchievementNotification includes achievement name', async () => {
    await sendAchievementNotification('Primeiro Treino', 100);
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('Primeiro Treino');
  });

  it('sendLevelUpNotification includes level', async () => {
    await sendLevelUpNotification('Avancado', 5);
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('Avancado');
  });

  it('sendNewWorkoutNotification includes workout name', async () => {
    await sendNewWorkoutNotification('HIIT Express');
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('HIIT Express');
  });

  it('sendWeeklySummaryNotification includes stats', async () => {
    await sendWeeklySummaryNotification(5, 300);
    const call = Notifications.scheduleNotificationAsync.mock.calls[0][0];
    expect(call.content.body).toContain('5');
    expect(call.content.body).toContain('300');
  });

  it('sendRestReminder schedules notification', async () => {
    await sendRestReminder();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('sendMotivationalNotification sends a tip', async () => {
    await sendMotivationalNotification();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });
});
