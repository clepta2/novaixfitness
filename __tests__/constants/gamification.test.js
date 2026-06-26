import {
  getLevelForXP,
  getNextLevel,
  getXPProgress,
  getUnlockedAchievements,
  checkNewAchievements,
  LEVELS,
  ACHIEVEMENTS,
  XP_VALUES,
} from '../../src/constants/gamification';

describe('Gamification Constants', () => {
  describe('XP_VALUES', () => {
    it('has all required XP values', () => {
      expect(XP_VALUES.WORKOUT_COMPLETED).toBe(50);
      expect(XP_VALUES.WORKOUT_RATED).toBe(10);
      expect(XP_VALUES.STREAK_BONUS_PER_DAY).toBe(5);
      expect(XP_VALUES.POST_CREATED).toBe(15);
      expect(XP_VALUES.ONBOARDING_COMPLETED).toBe(100);
      expect(XP_VALUES.FIRST_WORKOUT).toBe(200);
    });
  });

  describe('LEVELS', () => {
    it('has 10 levels', () => {
      expect(LEVELS).toHaveLength(10);
    });

    it('levels are ordered by xpRequired', () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
      }
    });

    it('first level starts at 0 XP', () => {
      expect(LEVELS[0].xpRequired).toBe(0);
    });

    it('last level is 15000 XP', () => {
      expect(LEVELS[9].xpRequired).toBe(15000);
    });
  });

  describe('ACHIEVEMENTS', () => {
    it('has achievements in all categories', () => {
      const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))];
      expect(categories).toContain('streak');
      expect(categories).toContain('workout');
      expect(categories).toContain('time');
      expect(categories).toContain('social');
      expect(categories).toContain('level');
    });

    it('each achievement has required fields', () => {
      ACHIEVEMENTS.forEach(a => {
        expect(a).toHaveProperty('id');
        expect(a).toHaveProperty('name');
        expect(a).toHaveProperty('category');
        expect(a).toHaveProperty('requirement');
        expect(a).toHaveProperty('xpReward');
      });
    });
  });

  describe('getLevelForXP', () => {
    it('returns level 1 for 0 XP', () => {
      const level = getLevelForXP(0);
      expect(level.level).toBe(1);
      expect(level.name).toBe('Iniciante');
    });

    it('returns level 1 for 100 XP', () => {
      const level = getLevelForXP(100);
      expect(level.level).toBe(1);
    });

    it('returns level 2 for 200 XP', () => {
      const level = getLevelForXP(200);
      expect(level.level).toBe(2);
      expect(level.name).toBe('Aquecendo');
    });

    it('returns level 3 for 500 XP', () => {
      const level = getLevelForXP(500);
      expect(level.level).toBe(3);
    });

    it('returns level 5 for 2000 XP', () => {
      const level = getLevelForXP(2000);
      expect(level.level).toBe(5);
    });

    it('returns max level for 15000+ XP', () => {
      const level = getLevelForXP(15000);
      expect(level.level).toBe(10);
      expect(level.name).toBe('NOVAIX');
    });

    it('returns max level for 99999 XP', () => {
      const level = getLevelForXP(99999);
      expect(level.level).toBe(10);
    });
  });

  describe('getNextLevel', () => {
    it('returns level 2 when current is level 1', () => {
      const next = getNextLevel(LEVELS[0]);
      expect(next.level).toBe(2);
    });

    it('returns null at max level', () => {
      const next = getNextLevel(LEVELS[9]);
      expect(next).toBeNull();
    });

    it('returns correct next level for level 5', () => {
      const next = getNextLevel(LEVELS[4]);
      expect(next.level).toBe(6);
    });
  });

  describe('getXPProgress', () => {
    it('returns 100% progress at max level', () => {
      const result = getXPProgress(15000);
      expect(result.progress).toBe(1);
      expect(result.next).toBeNull();
    });

    it('returns 0% progress at level start', () => {
      const result = getXPProgress(0);
      expect(result.progress).toBe(0);
      expect(result.xpInLevel).toBe(0);
    });

    it('calculates correct progress between levels', () => {
      const result = getXPProgress(100);
      expect(result.progress).toBe(0.5);
      expect(result.xpInLevel).toBe(100);
      expect(result.xpNeeded).toBe(200);
    });

    it('caps progress at 1', () => {
      const result = getXPProgress(350);
      expect(result.progress).toBeLessThanOrEqual(1);
    });

    it('returns current and next level objects', () => {
      const result = getXPProgress(100);
      expect(result.current).toHaveProperty('level');
      expect(result.current).toHaveProperty('name');
      expect(result.next).toHaveProperty('level');
      expect(result.next).toHaveProperty('name');
    });
  });

  describe('getUnlockedAchievements', () => {
    it('returns empty array for new user', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 0,
        totalWorkouts: 0,
        totalMinutes: 0,
        level: 1,
      });
      expect(unlocked).toEqual([]);
    });

    it('unlocks workout_1 achievement with 1 workout', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 0,
        totalWorkouts: 1,
        totalMinutes: 0,
        level: 1,
      });
      expect(unlocked.some(a => a.id === 'workout_1')).toBe(true);
    });

    it('unlocks streak_3 with 3 day streak', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 3,
        totalWorkouts: 0,
        totalMinutes: 0,
        level: 1,
      });
      expect(unlocked.some(a => a.id === 'streak_3')).toBe(true);
    });

    it('unlocks time_60 with 60 minutes', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 0,
        totalWorkouts: 0,
        totalMinutes: 60,
        level: 1,
      });
      expect(unlocked.some(a => a.id === 'time_60')).toBe(true);
    });

    it('unlocks level_3 with level 3', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 0,
        totalWorkouts: 0,
        totalMinutes: 0,
        level: 3,
      });
      expect(unlocked.some(a => a.id === 'level_3')).toBe(true);
    });

    it('unlocks multiple achievements', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 7,
        totalWorkouts: 10,
        totalMinutes: 300,
        level: 5,
      });
      expect(unlocked.length).toBeGreaterThan(5);
    });

    it('does not unlock achievements user has not reached', () => {
      const unlocked = getUnlockedAchievements({
        maxStreak: 2,
        totalWorkouts: 0,
        totalMinutes: 0,
        level: 1,
      });
      expect(unlocked.some(a => a.id === 'streak_3')).toBe(false);
    });
  });

  describe('checkNewAchievements', () => {
    it('returns all unlocked when none were previously unlocked', () => {
      const newOnes = checkNewAchievements(
        { maxStreak: 3, totalWorkouts: 1, totalMinutes: 0, level: 1 },
        []
      );
      expect(newOnes.length).toBeGreaterThan(0);
    });

    it('returns only newly unlocked achievements', () => {
      const previouslyUnlocked = [
        { id: 'workout_1' },
        { id: 'streak_3' },
      ];
      const newOnes = checkNewAchievements(
        { maxStreak: 7, totalWorkouts: 5, totalMinutes: 0, level: 1 },
        previouslyUnlocked
      );
      expect(newOnes.some(a => a.id === 'workout_1')).toBe(false);
      expect(newOnes.some(a => a.id === 'streak_3')).toBe(false);
      expect(newOnes.some(a => a.id === 'workout_5')).toBe(true);
      expect(newOnes.some(a => a.id === 'streak_7')).toBe(true);
    });

    it('returns empty when no new achievements', () => {
      const previouslyUnlocked = ACHIEVEMENTS.slice(0, 5);
      const newOnes = checkNewAchievements(
        { maxStreak: 0, totalWorkouts: 0, totalMinutes: 0, level: 1 },
        previouslyUnlocked
      );
      expect(newOnes.length).toBe(0);
    });
  });
});
