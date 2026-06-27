jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
}));

import {
  sendWorkoutCompletedNotification,
  sendStreakNotification,
  sendAchievementNotification,
  sendLevelUpNotification,
  sendNewWorkoutNotification,
  sendWeeklySummaryNotification,
  sendRestReminder,
  sendMotivationalNotification,
} from '../../src/services/notifications-sender';

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
