import {
  calculateBMI,
  getBMICategory,
  calculateProgress,
  MEASUREMENT_TYPES,
} from '../../src/services/body-measurements';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
describe('Body Measurements Service', () => {
  describe('calculateBMI', () => {
    it('returns null for missing inputs', () => {
      expect(calculateBMI(null, 170)).toBeNull();
      expect(calculateBMI(80, null)).toBeNull();
      expect(calculateBMI(null, null)).toBeNull();
    });

    it('calculates BMI correctly', () => {
      expect(calculateBMI(80, 180)).toBe('24.7');
      expect(calculateBMI(60, 170)).toBe('20.8');
      expect(calculateBMI(100, 165)).toBe('36.7');
    });
  });

  describe('getBMICategory', () => {
    it('returns N/D for null', () => {
      expect(getBMICategory(null).label).toBe('N/D');
    });

    it('Abaixo do peso < 18.5', () => {
      expect(getBMICategory('17.0').label).toBe('Abaixo do peso');
    });

    it('Peso normal 18.5-24.9', () => {
      expect(getBMICategory('22.0').label).toBe('Peso normal');
    });

    it('Sobrepeso 25-29.9', () => {
      expect(getBMICategory('27.0').label).toBe('Sobrepeso');
    });

    it('Obesidade >= 30', () => {
      expect(getBMICategory('35.0').label).toBe('Obesidade');
    });
  });

  describe('calculateProgress', () => {
    it('returns null for missing inputs', () => {
      expect(calculateProgress(null, 80, 'weight')).toBeNull();
      expect(calculateProgress(80, null, 'weight')).toBeNull();
    });

    it('calculates weight improvement (decreased)', () => {
      const result = calculateProgress(100, 90, 'weight');
      expect(result.improved).toBe(true);
      expect(parseFloat(result.difference)).toBe(-10);
    });

    it('calculates weight regression (increased)', () => {
      const result = calculateProgress(80, 90, 'weight');
      expect(result.improved).toBe(false);
    });

    it('calculates strength improvement (increased)', () => {
      const result = calculateProgress(10, 15, 'chest');
      expect(result.improved).toBe(true);
      expect(parseFloat(result.difference)).toBe(5);
    });

    it('calculates percentage', () => {
      const result = calculateProgress(100, 80, 'weight');
      expect(result.percentage).toBe(-20);
    });
  });

  describe('MEASUREMENT_TYPES', () => {
    it('has all types', () => {
      expect(MEASUREMENT_TYPES.length).toBe(7);
      expect(MEASUREMENT_TYPES.map(t => t.key)).toContain('weight');
      expect(MEASUREMENT_TYPES.map(t => t.key)).toContain('body_fat');
    });
  });
});
