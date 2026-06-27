jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
  impactAsync: jest.fn().mockResolvedValue({}),
  notificationAsync: jest.fn().mockResolvedValue({}),
}));

import {
  lightTick,
  mediumImpact,
  heavyImpact,
  notificationSuccess,
  notificationWarning,
  countdownTick,
  phaseChange,
  workoutComplete,
} from '../../src/services/hapticService';

const Haptics = require('expo-haptics');

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Haptic Service', () => {
  it('lightTick calls impact with Light', async () => {
    await lightTick();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('mediumImpact calls impact with Medium', async () => {
    await mediumImpact();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('heavyImpact calls impact with Heavy', async () => {
    await heavyImpact();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('heavy');
  });

  it('notificationSuccess calls notificationAsync with Success', async () => {
    await notificationSuccess();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('notificationWarning calls notificationAsync with Warning', async () => {
    await notificationWarning();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
  });

  it('countdownTick triggers on seconds <= 3', async () => {
    await countdownTick(3);
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  it('countdownTick does not trigger on seconds > 3', async () => {
    await countdownTick(5);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('countdownTick does not trigger on 0', async () => {
    await countdownTick(0);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('phaseChange calls mediumImpact', async () => {
    await phaseChange();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('workoutComplete calls heavyImpact then notificationSuccess after delay', async () => {
    await workoutComplete();
    expect(Haptics.impactAsync).toHaveBeenCalledWith('heavy');
    jest.advanceTimersByTime(200);
    await Promise.resolve();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });
});
