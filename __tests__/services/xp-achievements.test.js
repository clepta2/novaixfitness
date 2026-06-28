// __tests__/services/xp-achievements.test.js
// Testes de conquistas baseadas em XP - NOVAIX FITNESS

import { getUnlockedAchievements, checkNewAchievements, ACHIEVEMENTS } from '../../src/constants/gamification';

describe('XP Achievements', () => {
  const xpAchievements = ACHIEVEMENTS.filter(a => a.category === 'xp');

  it('should have 6 XP achievements', () => {
    expect(xpAchievements.length).toBe(6);
  });

  it('should unlock xp_100 at 100 XP', () => {
    const stats = { totalXP: 100, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_100')).toBeTruthy();
  });

  it('should NOT unlock xp_100 at 99 XP', () => {
    const stats = { totalXP: 99, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_100')).toBeFalsy();
  });

  it('should unlock xp_500 at 500 XP', () => {
    const stats = { totalXP: 500, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 2 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_500')).toBeTruthy();
  });

  it('should unlock xp_1000 at 1000 XP', () => {
    const stats = { totalXP: 1000, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_1000')).toBeTruthy();
  });

  it('should unlock xp_2500 at 2500 XP', () => {
    const stats = { totalXP: 2500, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 5 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_2500')).toBeTruthy();
  });

  it('should unlock xp_5000 at 5000 XP', () => {
    const stats = { totalXP: 5000, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 7 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_5000')).toBeTruthy();
  });

  it('should unlock xp_10000 at 10000 XP', () => {
    const stats = { totalXP: 10000, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 9 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'xp_10000')).toBeTruthy();
  });

  it('should unlock multiple XP achievements at once', () => {
    const stats = { totalXP: 1000, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    const xpUnlocked = unlocked.filter(a => a.category === 'xp');
    expect(xpUnlocked.length).toBe(3); // xp_100, xp_500, xp_1000
  });

  it('should detect new XP achievements', () => {
    const stats = { totalXP: 500, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 2 };
    const previous = [{ id: 'xp_100' }];
    const newAchievements = checkNewAchievements(stats, previous);
    const newXP = newAchievements.filter(a => a.category === 'xp');
    expect(newXP.length).toBe(1);
    expect(newXP[0].id).toBe('xp_500');
  });

  it('should return empty when no new XP achievements', () => {
    const stats = { totalXP: 500, maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 2 };
    const previous = [{ id: 'xp_100' }, { id: 'xp_500' }];
    const newAchievements = checkNewAchievements(stats, previous);
    const newXP = newAchievements.filter(a => a.category === 'xp');
    expect(newXP.length).toBe(0);
  });

  it('should have correct XP rewards', () => {
    expect(xpAchievements.find(a => a.id === 'xp_100').xpReward).toBe(25);
    expect(xpAchievements.find(a => a.id === 'xp_500').xpReward).toBe(50);
    expect(xpAchievements.find(a => a.id === 'xp_1000').xpReward).toBe(100);
    expect(xpAchievements.find(a => a.id === 'xp_2500').xpReward).toBe(200);
    expect(xpAchievements.find(a => a.id === 'xp_5000').xpReward).toBe(500);
    expect(xpAchievements.find(a => a.id === 'xp_10000').xpReward).toBe(1000);
  });

  it('should have correct icons and colors', () => {
    const a100 = xpAchievements.find(a => a.id === 'xp_100');
    expect(a100.icon).toBe('flash');
    expect(a100.color).toBe('#94A3B8');

    const a10000 = xpAchievements.find(a => a.id === 'xp_10000');
    expect(a10000.icon).toBe('star');
    expect(a10000.color).toBe('#CCFF00');
  });
});
