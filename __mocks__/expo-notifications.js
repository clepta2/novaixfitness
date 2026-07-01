// __mocks__/expo-notifications.js

module.exports = {
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'test-token' }),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id'),
  cancelScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue({}),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([
    { content: { data: { type: 'workout_reminder' } } },
    { content: { data: { type: 'rest_day' } } },
    { content: { data: { type: 'other' } } },
  ]),
  setNotificationChannelAsync: jest.fn().mockResolvedValue({}),
  AndroidImportance: { MAX: 4, HIGH: 3, DEFAULT: 2, LOW: 1, MIN: 0 },
  SchedulableTriggerInputTypes: {
    CALENDAR: 'calendar',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    TIME_INTERVAL: 'timeInterval',
  },
};
