// __tests__/services/time-achievements.test.js
// Testes de conquistas de tempo - NOVAIX FITNESS

import { getUnlockedAchievements, checkNewAchievements, ACHIEVEMENTS } from '../../src/constants/gamification';

describe('Time Achievements', () => {
  const timeAchievements = ACHIEVEMENTS.filter(a => a.category === 'time');

  it('should have 4 time achievements', () => {
    expect(timeAchievements.length).toBe(4);
  });

  it('should unlock time_60 at 60 minutes', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 60, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'time_60')).toBeTruthy();
  });

  it('should NOT unlock time_60 at 59 minutes', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 59, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'time_60')).toBeFalsy();
  });

  it('should unlock time_300 at 300 minutes', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 300, level: 2 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'time_300')).toBeTruthy();
  });

  it('should unlock time_1000 at 1000 minutes', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 1000, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'time_1000')).toBeTruthy();
  });

  it('should unlock time_5000 at 5000 minutes', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 5000, level: 5 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'time_5000')).toBeTruthy();
  });

  it('should unlock multiple time achievements at once', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 300, level: 2 };
    const unlocked = getUnlockedAchievements(stats);
    const timeUnlocked = unlocked.filter(a => a.category === 'time');
    expect(timeUnlocked.length).toBe(2);
    expect(timeUnlocked.map(a => a.id)).toContain('time_60');
    expect(timeUnlocked.map(a => a.id)).toContain('time_300');
  });

  it('should detect new time achievements', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 300, level: 2 };
    const previous = [{ id: 'time_60' }];
    const newAchievements = checkNewAchievements(stats, previous);
    const newTime = newAchievements.filter(a => a.category === 'time');
    expect(newTime.length).toBe(1);
    expect(newTime[0].id).toBe('time_300');
  });

  it('should have correct XP rewards', () => {
    expect(timeAchievements.find(a => a.id === 'time_60').xpReward).toBe(50);
    expect(timeAchievements.find(a => a.id === 'time_300').xpReward).toBe(150);
    expect(timeAchievements.find(a => a.id === 'time_1000').xpReward).toBe(400);
    expect(timeAchievements.find(a => a.id === 'time_5000').xpReward).toBe(1000);
  });

  it('should have correct descriptions', () => {
    expect(timeAchievements.find(a => a.id === 'time_60').description).toBe('Acumule 60 minutos');
    expect(timeAchievements.find(a => a.id === 'time_300').description).toBe('Acumule 5 horas de treino');
    expect(timeAchievements.find(a => a.id === 'time_1000').description).toBe('Acumule 1000 minutos (~16h)');
    expect(timeAchievements.find(a => a.id === 'time_5000').description).toBe('Acumule 5000 minutos (~83h)');
  });

  it('should handle edge case at exact boundary', () => {
    const stats = { totalXP: 0, maxStreak: 0, totalWorkouts: 0, totalMinutes: 1000, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    const timeUnlocked = unlocked.filter(a => a.category === 'time');
    expect(timeUnlocked.length).toBe(3);
  });
});
