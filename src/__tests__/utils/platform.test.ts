// src/__tests__/utils/platform.test.ts
// Testes para platform - NOVAIX FITNESS

import { Platform, Dimensions, PixelRatio } from 'react-native';
import {
  isIOS,
  isAndroid,
  isWeb,
  screenWidth,
  screenHeight,
  scale,
  verticalScale,
  moderateScale,
  isSmallScreen,
  isLargeScreen,
  isTablet,
} from '../../utils/platform';

// Mock do Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
}));

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

    it('should return same value on base width', () => {
      // No base width (390), scale should return the same value
      const result = scale(100);
      expect(result).toBeCloseTo(100, 0);
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
      
      // With factor 0, should return base size
      expect(result1).toBeCloseTo(100, 0);
      
      // With factor 1, should apply full scale
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('screen checks', () => {
    it('should export screen check functions', () => {
      expect(typeof isSmallScreen()).toBe('boolean');
      expect(typeof isLargeScreen()).toBe('boolean');
      expect(typeof isTablet()).toBe('boolean');
    });

    it('should have consistent screen checks', () => {
      // A device cannot be both small and large
      if (isSmallScreen()) {
        expect(isLargeScreen()).toBe(false);
      }
    });
  });
});
