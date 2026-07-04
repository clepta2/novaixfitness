// __tests__/services/levels.test.js
// Testes de sistema de niveis - NOVAIX FITNESS

import { LEVELS, getLevelForXP, getNextLevel, getXPProgress } from '../../src/constants/gamification';

describe('Level System', () => {
  it('should have 5 levels', () => {
    expect(LEVELS.length).toBe(5);
  });

  it('should return level 1 at 0 XP', () => {
    const level = getLevelForXP(0);
    expect(level.level).toBe(1);
    expect(level.name).toBe('Iniciante');
  });

  it('should return level 2 at 500 XP', () => {
    const level = getLevelForXP(500);
    expect(level.level).toBe(2);
    expect(level.name).toBe('Dedicado');
  });

  it('should return level 3 at 2000 XP', () => {
    const level = getLevelForXP(2000);
    expect(level.level).toBe(3);
    expect(level.name).toBe('Atleta');
  });

  it('should return level 4 at 5000 XP', () => {
    const level = getLevelForXP(5000);
    expect(level.level).toBe(4);
    expect(level.name).toBe('Mestre');
  });

  it('should return level 5 at 10000 XP', () => {
    const level = getLevelForXP(10000);
    expect(level.level).toBe(5);
    expect(level.name).toBe('NOVAIX');
  });

  it('should stay at same level between thresholds', () => {
    const level = getLevelForXP(1000);
    expect(level.level).toBe(2);
  });

  it('should get next level correctly', () => {
    const current = LEVELS[0];
    const next = getNextLevel(current);
    expect(next.level).toBe(2);
  });

  it('should return null for max level', () => {
    const current = LEVELS[4];
    const next = getNextLevel(current);
    expect(next).toBeNull();
  });

  it('should calculate XP progress correctly', () => {
    const progress = getXPProgress(1000);
    expect(progress.current.level).toBe(2);
    expect(progress.next.level).toBe(3);
    expect(progress.progress).toBeGreaterThan(0);
    expect(progress.progress).toBeLessThan(1);
  });

  it('should show progress at level threshold', () => {
    const progress = getXPProgress(499);
    expect(progress.current.level).toBe(1);
    expect(progress.progress).toBeGreaterThan(0.9);
  });

  it('should show 0% progress at level start', () => {
    const progress = getXPProgress(0);
    expect(progress.progress).toBe(0);
  });

  it('should have all required level properties', () => {
    LEVELS.forEach(level => {
      expect(level).toHaveProperty('level');
      expect(level).toHaveProperty('name');
      expect(level).toHaveProperty('xpRequired');
      expect(level).toHaveProperty('color');
      expect(level).toHaveProperty('icon');
      expect(level).toHaveProperty('rewards');
    });
  });

  it('should have progressive XP requirements', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
    }
  });
});
