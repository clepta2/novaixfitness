import { PLANS, isSubscribed, getPlanById } from '../../src/services/payment';

describe('Payment Service', () => {
  describe('PLANS', () => {
    it('has 3 plans', () => {
      expect(Object.keys(PLANS)).toHaveLength(3);
    });

    it('has basic plan', () => {
      expect(PLANS.basic).toBeDefined();
      expect(PLANS.basic.id).toBe('basic');
      expect(PLANS.basic.name).toBe('Básico');
      expect(PLANS.basic.price).toBe(49.90);
    });

    it('has intermediate plan', () => {
      expect(PLANS.intermediate).toBeDefined();
      expect(PLANS.intermediate.id).toBe('intermediate');
      expect(PLANS.intermediate.popular).toBe(true);
      expect(PLANS.intermediate.price).toBe(79.90);
    });

    it('has premium plan', () => {
      expect(PLANS.premium).toBeDefined();
      expect(PLANS.premium.id).toBe('premium');
      expect(PLANS.premium.price).toBe(119.90);
    });

    it('prices increase from basic to premium', () => {
      expect(PLANS.basic.price).toBeLessThan(PLANS.intermediate.price);
      expect(PLANS.intermediate.price).toBeLessThan(PLANS.premium.price);
    });

    it('each plan has features array', () => {
      Object.values(PLANS).forEach(plan => {
        expect(plan.features).toBeDefined();
        expect(Array.isArray(plan.features)).toBe(true);
        expect(plan.features.length).toBeGreaterThan(0);
      });
    });

    it('intermediate and premium include Coach IA', () => {
      const coachIA = (plan) => plan.features.some(f => f.text.includes('Coach IA'));
      expect(coachIA(PLANS.intermediate)).toBe(true);
      expect(coachIA(PLANS.premium)).toBe(true);
    });
  });

  describe('isSubscribed', () => {
    it('returns true for active subscription', () => {
      expect(isSubscribed({ subscription_status: 'active' })).toBe(true);
    });

    it('returns false for inactive subscription', () => {
      expect(isSubscribed({ subscription_status: 'inactive' })).toBe(false);
    });

    it('returns false for trial subscription', () => {
      expect(isSubscribed({ subscription_status: 'trial' })).toBe(false);
    });

    it('returns false for null/undefined', () => {
      expect(isSubscribed(null)).toBe(false);
      expect(isSubscribed(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(isSubscribed({})).toBe(false);
    });
  });

  describe('getPlanById', () => {
    it('returns basic plan', () => {
      expect(getPlanById('basic')).toBe(PLANS.basic);
    });

    it('returns intermediate plan', () => {
      expect(getPlanById('intermediate')).toBe(PLANS.intermediate);
    });

    it('returns premium plan', () => {
      expect(getPlanById('premium')).toBe(PLANS.premium);
    });

    it('returns intermediate as default for unknown id', () => {
      expect(getPlanById('unknown')).toBe(PLANS.intermediate);
    });

    it('returns intermediate for null', () => {
      expect(getPlanById(null)).toBe(PLANS.intermediate);
    });
  });
});
