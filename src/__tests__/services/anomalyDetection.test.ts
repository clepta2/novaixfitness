// src/__tests__/services/anomalyDetection.test.ts

import {
  trackAction, detectBurst, detectRepetition,
  getActivityStats, calculateRiskScore, clearEventLog,
} from '../../services/security/anomalyDetection';

describe('anomalyDetection', () => {
  beforeEach(() => clearEventLog());

  describe('detectBurst', () => {
    it('nao detecta burst com poucos eventos', () => {
      trackAction('api_call');
      const r = detectBurst('api_call', 60000, 10);
      expect(r.burst).toBe(false);
    });

    it('detecta burst com muitos eventos', () => {
      for (let i = 0; i < 25; i++) trackAction('api_call');
      const r = detectBurst('api_call', 60000, 20);
      expect(r.burst).toBe(true);
      expect(r.count).toBe(25);
    });
  });

  describe('detectRepetition', () => {
    it('nao detecta repeticao normal', () => {
      trackAction('login');
      expect(detectRepetition('login', 5, 10000)).toBe(false);
    });

    it('detecta repeticao suspeita', () => {
      for (let i = 0; i < 6; i++) trackAction('login');
      expect(detectRepetition('login', 5, 60000)).toBe(true);
    });
  });

  describe('getActivityStats', () => {
    it('retorna stats corretas', () => {
      trackAction('login');
      trackAction('login');
      trackAction('view');
      const stats = getActivityStats(60000);
      expect(stats.totalActions).toBe(3);
      expect(stats.uniqueActions).toBe(2);
      expect(stats.topActions[0].action).toBe('login');
      expect(stats.topActions[0].count).toBe(2);
    });
  });

  describe('calculateRiskScore', () => {
    it('risco baixo sem atividade', () => {
      const r = calculateRiskScore();
      expect(r.level).toBe('low');
      expect(r.score).toBeLessThan(30);
    });

    it('risco alto com muitos erros', () => {
      for (let i = 0; i < 5; i++) trackAction('auth_failure');
      const r = calculateRiskScore();
      expect(r.score).toBeGreaterThan(0);
    });
  });
});
