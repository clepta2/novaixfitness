// src/__tests__/utils/platform.test.ts
// Testes para platform - NOVAIX FITNESS

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Platform.OS = 'ios';
  return RN;
});

import { isIOS, isAndroid, isWeb, screenWidth, screenHeight, scale, verticalScale, moderateScale, isSmallScreen, isLargeScreen, isTablet } from '../../utils/platform';

describe('platform', () => {
  describe('plataforma', () => {
    it('should export platform flags', () => {
      expect(typeof isIOS).toBe('boolean');
      expect(typeof isAndroid).toBe('boolean');
      expect(typeof isWeb).toBe('boolean');
    });
  });

  describe('dimensões', () => {
    it('should export screen dimensions', () => {
      expect(typeof screenWidth).toBe('number');
      expect(typeof screenHeight).toBe('number');
      expect(screenWidth).toBeGreaterThan(0);
      expect(screenHeight).toBeGreaterThan(0);
    });
  });

  describe('scale', () => {
    it('should scale proportionally', () => {
      const result = scale(100);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('should return a scaled value', () => {
      const result = scale(100);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });
  });

  describe('verticalScale', () => {
    it('should scale proportionally', () => {
      const result = verticalScale(100);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('moderateScale', () => {
    it('should apply moderate scaling', () => {
      const result = moderateScale(100);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('should use custom factor', () => {
      const result1 = moderateScale(100, 0);
      const result2 = moderateScale(100, 1);
      expect(result1).toBeCloseTo(100, 0);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('screen checks', () => {
    it('should export screen check functions', () => {
      expect(typeof isSmallScreen()).toBe('boolean');
      expect(typeof isLargeScreen()).toBe('boolean');
      expect(typeof isTablet()).toBe('boolean');
    });
  });
});
