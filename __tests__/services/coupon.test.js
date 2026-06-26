import { applyCoupon } from '../../src/services/coupon';

describe('Coupon Service', () => {
  describe('applyCoupon', () => {
    describe('percent discount', () => {
      it('applies 10% discount correctly', () => {
        const result = applyCoupon(100, { valid: true, type: 'percent', discount: 10 });
        expect(result).toBe(90);
      });

      it('applies 50% discount correctly', () => {
        const result = applyCoupon(100, { valid: true, type: 'percent', discount: 50 });
        expect(result).toBe(50);
      });

      it('applies 20% discount on different price', () => {
        const result = applyCoupon(79.90, { valid: true, type: 'percent', discount: 20 });
        expect(result).toBe(63.92);
      });

      it('handles 100% discount (free)', () => {
        const result = applyCoupon(100, { valid: true, type: 'percent', discount: 100 });
        expect(result).toBe(0);
      });
    });

    describe('fixed discount', () => {
      it('subtracts fixed amount', () => {
        const result = applyCoupon(100, { valid: true, type: 'fixed', discount: 20 });
        expect(result).toBe(80);
      });

      it('does not go below 0', () => {
        const result = applyCoupon(10, { valid: true, type: 'fixed', discount: 50 });
        expect(result).toBe(0);
      });

      it('handles exact price match', () => {
        const result = applyCoupon(50, { valid: true, type: 'fixed', discount: 50 });
        expect(result).toBe(0);
      });
    });

    describe('days discount', () => {
      it('returns 0 for days type (free trial)', () => {
        const result = applyCoupon(100, { valid: true, type: 'days', discount: 7 });
        expect(result).toBe(0);
      });
    });

    describe('invalid coupon', () => {
      it('returns original price for null coupon', () => {
        expect(applyCoupon(100, null)).toBe(100);
      });

      it('returns original price for undefined coupon', () => {
        expect(applyCoupon(100, undefined)).toBe(100);
      });

      it('returns original price for invalid coupon', () => {
        expect(applyCoupon(100, { valid: false })).toBe(100);
      });

      it('returns original price for coupon without valid field', () => {
        expect(applyCoupon(100, { type: 'percent', discount: 10 })).toBe(100);
      });
    });

    describe('rounding', () => {
      it('rounds to 2 decimal places', () => {
        const result = applyCoupon(99.99, { valid: true, type: 'percent', discount: 33 });
        expect(result).toBe(66.99);
      });

      it('handles small amounts', () => {
        const result = applyCoupon(1.50, { valid: true, type: 'percent', discount: 10 });
        expect(result).toBe(1.35);
      });
    });
  });
});
