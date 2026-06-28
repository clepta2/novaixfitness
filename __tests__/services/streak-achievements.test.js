// __tests__/services/streak-achievements.test.js
// Testes de conquistas de sequencia (streak) - NOVAIX FITNESS

import { getUnlockedAchievements, checkNewAchievements, ACHIEVEMENTS } from '../../src/constants/gamification';

describe('Streak Achievements', () => {
  const streakAchievements = ACHIEVEMENTS.filter(a => a.category === 'streak');

  it('should have 6 streak achievements', () => {
    expect(streakAchievements.length).toBe(6);
  });

  it('should unlock streak_3 at 3 days', () => {
    const stats = { totalXP: 0, maxStreak: 3, totalWorkouts: 0, totalMinutes: 0, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_3')).toBeTruthy();
  });

  it('should NOT unlock streak_3 at 2 days', () => {
    const stats = { totalXP: 0, maxStreak: 2, totalWorkouts: 0, totalMinutes: 0, level: 1 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_3')).toBeFalsy();
  });

  it('should unlock streak_7 at 7 days', () => {
    const stats = { totalXP: 0, maxStreak: 7, totalWorkouts: 0, totalMinutes: 0, level: 2 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_7')).toBeTruthy();
  });

  it('should unlock streak_14 at 14 days', () => {
    const stats = { totalXP: 0, maxStreak: 14, totalWorkouts: 0, totalMinutes: 0, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_14')).toBeTruthy();
  });

  it('should unlock streak_30 at 30 days', () => {
    const stats = { totalXP: 0, maxStreak: 30, totalWorkouts: 0, totalMinutes: 0, level: 4 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_30')).toBeTruthy();
  });

  it('should unlock streak_60 at 60 days', () => {
    const stats = { totalXP: 0, maxStreak: 60, totalWorkouts: 0, totalMinutes: 0, level: 6 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_60')).toBeTruthy();
  });

  it('should unlock streak_100 at 100 days', () => {
    const stats = { totalXP: 0, maxStreak: 100, totalWorkouts: 0, totalMinutes: 0, level: 8 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_100')).toBeTruthy();
  });

  it('should unlock multiple streak achievements at once', () => {
    const stats = { totalXP: 0, maxStreak: 14, totalWorkouts: 0, totalMinutes: 0, level: 3 };
    const unlocked = getUnlockedAchievements(stats);
    const streakUnlocked = unlocked.filter(a => a.category === 'streak');
    expect(streakUnlocked.length).toBe(3);
    expect(streakUnlocked.map(a => a.id)).toContain('streak_3');
    expect(streakUnlocked.map(a => a.id)).toContain('streak_7');
    expect(streakUnlocked.map(a => a.id)).toContain('streak_14');
  });

  it('should detect new streak achievements', () => {
    const stats = { totalXP: 0, maxStreak: 7, totalWorkouts: 0, totalMinutes: 0, level: 2 };
    const previous = [{ id: 'streak_3' }];
    const newAchievements = checkNewAchievements(stats, previous);
    const newStreak = newAchievements.filter(a => a.category === 'streak');
    expect(newStreak.length).toBe(1);
    expect(newStreak[0].id).toBe('streak_7');
  });

  it('should have correct XP rewards', () => {
    expect(streakAchievements.find(a => a.id === 'streak_3').xpReward).toBe(50);
    expect(streakAchievements.find(a => a.id === 'streak_7').xpReward).toBe(150);
    expect(streakAchievements.find(a => a.id === 'streak_14').xpReward).toBe(300);
    expect(streakAchievements.find(a => a.id === 'streak_30').xpReward).toBe(500);
    expect(streakAchievements.find(a => a.id === 'streak_60').xpReward).toBe(1000);
    expect(streakAchievements.find(a => a.id === 'streak_100').xpReward).toBe(2000);
  });

  it('should have correct colors (progressive)', () => {
    expect(streakAchievements.find(a => a.id === 'streak_3').color).toBe('#FF6B35');
    expect(streakAchievements.find(a => a.id === 'streak_7').color).toBe('#FF6B35');
    expect(streakAchievements.find(a => a.id === 'streak_14').color).toBe('#FFD600');
    expect(streakAchievements.find(a => a.id === 'streak_30').color).toBe('#CCFF00');
    expect(streakAchievements.find(a => a.id === 'streak_60').color).toBe('#CCFF00');
    expect(streakAchievements.find(a => a.id === 'streak_100').color).toBe('#CCFF00');
  });

  it('should use maxStreak for comparison', () => {
    const stats = { totalXP: 0, maxStreak: 5, totalWorkouts: 20, totalMinutes: 500, level: 2 };
    const unlocked = getUnlockedAchievements(stats);
    expect(unlocked.find(a => a.id === 'streak_3')).toBeTruthy();
    expect(unlocked.find(a => a.id === 'streak_7')).toBeFalsy();
  });
});
