jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Dimensions.get = () => ({ width: 375, height: 812 });
  return rn;
});

import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';

describe('Spacing Constants', () => {
  describe('SPACING', () => {
    it('has xs spacing', () => {
      expect(SPACING.xs).toBe(4);
    });

    it('has sm spacing', () => {
      expect(SPACING.sm).toBe(8);
    });

    it('has md spacing', () => {
      expect(SPACING.md).toBe(12);
    });

    it('has lg spacing', () => {
      expect(SPACING.lg).toBe(16);
    });

    it('has xl spacing', () => {
      expect(SPACING.xl).toBe(20);
    });

    it('has xxl spacing', () => {
      expect(SPACING.xxl).toBe(24);
    });

    it('has xxxl spacing', () => {
      expect(SPACING.xxxl).toBe(32);
    });

    it('has huge spacing', () => {
      expect(SPACING.huge).toBe(40);
    });

    it('has massive spacing', () => {
      expect(SPACING.massive).toBe(48);
    });

    it('spacing values increase progressively', () => {
      expect(SPACING.xs).toBeLessThan(SPACING.sm);
      expect(SPACING.sm).toBeLessThan(SPACING.md);
      expect(SPACING.md).toBeLessThan(SPACING.lg);
      expect(SPACING.lg).toBeLessThan(SPACING.xl);
      expect(SPACING.xl).toBeLessThan(SPACING.xxl);
      expect(SPACING.xxl).toBeLessThan(SPACING.xxxl);
      expect(SPACING.xxxl).toBeLessThan(SPACING.huge);
      expect(SPACING.huge).toBeLessThan(SPACING.massive);
    });

    it('all values are numbers', () => {
      Object.values(SPACING).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('all values are positive', () => {
      Object.values(SPACING).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('BORDER_RADIUS', () => {
    it('has sm border radius', () => {
      expect(BORDER_RADIUS.sm).toBe(8);
    });

    it('has md border radius', () => {
      expect(BORDER_RADIUS.md).toBe(12);
    });

    it('has lg border radius', () => {
      expect(BORDER_RADIUS.lg).toBe(16);
    });

    it('has xl border radius', () => {
      expect(BORDER_RADIUS.xl).toBe(20);
    });

    it('has full border radius', () => {
      expect(BORDER_RADIUS.full).toBe(9999);
    });

    it('border radius values increase progressively', () => {
      expect(BORDER_RADIUS.sm).toBeLessThan(BORDER_RADIUS.md);
      expect(BORDER_RADIUS.md).toBeLessThan(BORDER_RADIUS.lg);
      expect(BORDER_RADIUS.lg).toBeLessThan(BORDER_RADIUS.xl);
      expect(BORDER_RADIUS.xl).toBeLessThan(BORDER_RADIUS.full);
    });

    it('all values are numbers', () => {
      Object.values(BORDER_RADIUS).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('all values are positive', () => {
      Object.values(BORDER_RADIUS).forEach(value => {
        expect(value).toBeGreaterThan(0);
      });
    });
  });
});
