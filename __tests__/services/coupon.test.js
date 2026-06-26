import {
  validateCoupon,
  applyCoupon,
  recordCouponUse,
  listCoupons,
} from '../../src/services/coupon';

jest.mock('../../src/config/supabase', () => {
  const chain = {
    select: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn(() => chain),
    insert: jest.fn().mockResolvedValue({ error: null }),
    order: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
  const mockFrom = jest.fn(() => chain);
  return { supabase: { from: mockFrom, rpc: jest.fn().mockResolvedValue(1), __chain: chain } };
});

const { supabase } = require('../../src/config/supabase');
const chain = supabase.__chain;

beforeEach(() => {
  jest.clearAllMocks();
  chain.single.mockResolvedValue({ data: null, error: null });
  chain.order.mockResolvedValue({ data: null, error: null });
});

describe('Coupon Service', () => {
  describe('validateCoupon', () => {
    it('returns invalid for null code', async () => {
      const result = await validateCoupon(null);
      expect(result.valid).toBe(false);
    });

    it('returns invalid for short code', async () => {
      const result = await validateCoupon('AB');
      expect(result.valid).toBe(false);
    });

    it('validates demo coupon NOVAIX10', async () => {
      const result = await validateCoupon('novaix10');
      expect(result.valid).toBe(true);
      expect(result.code).toBe('NOVAIX10');
      expect(result.discount).toBe(10);
      expect(result.type).toBe('percent');
    });

    it('validates demo coupon BEMVINDO20', async () => {
      const result = await validateCoupon('BEMVINDO20');
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(20);
    });

    it('validates demo coupon TREINO30', async () => {
      const result = await validateCoupon('TREINO30');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('fixed');
    });

    it('validates demo coupon GRATIS7', async () => {
      const result = await validateCoupon('GRATIS7');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('days');
    });

    it('returns invalid for unknown coupon not in DB', async () => {
      const result = await validateCoupon('INVALIDCODE');
      expect(result.valid).toBe(false);
    });

    it('checks DB when not a demo coupon', async () => {
      chain.single.mockResolvedValue({
        data: { code: 'CUSTOM', discount: 15, type: 'percent', valid_until: '2030-12-31', active: true },
        error: null,
      });
      const result = await validateCoupon('CUSTOM');
      expect(result.valid).toBe(true);
      expect(result.discount).toBe(15);
    });

    it('returns invalid for expired DB coupon', async () => {
      chain.single.mockResolvedValue({
        data: { code: 'EXPIRED', discount: 10, type: 'percent', valid_until: '2020-01-01', active: true },
        error: null,
      });
      const result = await validateCoupon('EXPIRED');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('expirado');
    });

    it('returns invalid when max uses reached', async () => {
      chain.single.mockResolvedValue({
        data: { code: 'FULL', discount: 10, type: 'percent', valid_until: '2030-12-31', active: true, max_uses: 10, current_uses: 10 },
        error: null,
      });
      const result = await validateCoupon('FULL');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('limite');
    });
  });

  describe('applyCoupon', () => {
    it('returns original price for null coupon', () => {
      expect(applyCoupon(100, null)).toBe(100);
    });

    it('returns original price for invalid coupon', () => {
      expect(applyCoupon(100, { valid: false })).toBe(100);
    });

    it('applies percent discount', () => {
      expect(applyCoupon(100, { valid: true, type: 'percent', discount: 20 })).toBe(80);
    });

    it('applies fixed discount', () => {
      expect(applyCoupon(100, { valid: true, type: 'fixed', discount: 30 })).toBe(70);
    });

    it('does not go below zero with fixed discount', () => {
      expect(applyCoupon(10, { valid: true, type: 'fixed', discount: 30 })).toBe(0);
    });

    it('applies days type (free)', () => {
      expect(applyCoupon(100, { valid: true, type: 'days', discount: 7 })).toBe(0);
    });

    it('rounds to 2 decimals', () => {
      expect(applyCoupon(99.99, { valid: true, type: 'percent', discount: 33 })).toBe(66.99);
    });
  });

  describe('recordCouponUse', () => {
    it('does nothing without code', async () => {
      await recordCouponUse(null, 'u1');
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('does nothing without userId', async () => {
      await recordCouponUse('CODE', null);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('updates coupon uses and inserts history', async () => {
      await recordCouponUse('NOVAIX10', 'u1');
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  describe('listCoupons', () => {
    it('returns coupons from DB', async () => {
      chain.order.mockResolvedValue({ data: [{ code: 'TEST' }], error: null });
      const result = await listCoupons();
      expect(result).toHaveLength(1);
    });

    it('returns demo coupons on error', async () => {
      chain.order.mockResolvedValue({ data: null, error: { message: 'fail' } });
      const result = await listCoupons();
      expect(result.length).toBe(4);
    });
  });
});
