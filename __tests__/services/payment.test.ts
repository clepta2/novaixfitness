import { PLANS, isSubscribed, getPlanById } from '../../src/services/payment';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
describe('Payment Service', () => {
  describe('PLANS', () => {
    it('has all plan tiers', () => {
      expect(PLANS).toHaveProperty('basic');
      expect(PLANS).toHaveProperty('intermediate');
      expect(PLANS).toHaveProperty('premium');
      expect(PLANS).toHaveProperty('ultra');
    });

    it('each plan has required fields', () => {
      Object.values(PLANS).forEach(plan => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('name');
        expect(plan).toHaveProperty('price');
        expect(plan).toHaveProperty('features');
        expect(Array.isArray(plan.features)).toBe(true);
      });
    });

    it('plans are ordered by price', () => {
      expect(PLANS.basic.price).toBeLessThan(PLANS.intermediate.price);
      expect(PLANS.intermediate.price).toBeLessThan(PLANS.premium.price);
      expect(PLANS.premium.price).toBeLessThan(PLANS.ultra.price);
    });

    it('intermediate is marked popular', () => {
      expect(PLANS.intermediate.popular).toBe(true);
    });
  });

  describe('isSubscribed', () => {
    it('returns true when active', () => {
      expect(isSubscribed({ subscription_status: 'active' })).toBe(true);
    });

    it('returns false when inactive', () => {
      expect(isSubscribed({ subscription_status: 'inactive' })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isSubscribed(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isSubscribed(undefined)).toBe(false);
    });
  });

  describe('getPlanById', () => {
    it('returns correct plan', () => {
      expect(getPlanById('basic')).toBe(PLANS.basic);
      expect(getPlanById('premium')).toBe(PLANS.premium);
    });

    it('returns intermediate as fallback', () => {
      expect(getPlanById('nonexistent')).toBe(PLANS.intermediate);
      expect(getPlanById(null)).toBe(PLANS.intermediate);
    });
  });
});
