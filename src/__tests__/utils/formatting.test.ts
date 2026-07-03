// src/__tests__/utils/formatting.test.ts
// Testes para formatting - NOVAIX FITNESS

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatWeight,
  formatHeight,
  formatTimer,
  formatDurationText,
  truncate,
  capitalize,
  getInitials,
  formatRelativeTime,
} from '../../utils/formatting';

describe('formatting', () => {
  describe('formatNumber', () => {
    it('should format integer', () => {
      const result = formatNumber(1234567);
      expect(result).toMatch(/1.234.567|1,234,567/);
    });

    it('should format decimal', () => {
      const result = formatNumber(1234.567, 2);
      expect(result).toMatch(/1.234,57|1,234\.57/);
    });

    it('should format zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should format negative numbers', () => {
      const result = formatNumber(-1234);
      expect(result).toMatch(/-1.234|-1,234/);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1');
      expect(result).toContain('234');
    });

    it('should format zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      const result = formatPercentage(75.5);
      expect(result).toMatch(/75[,.]5%/);
    });

    it('should format with custom decimals', () => {
      const result = formatPercentage(75.567, 2);
      expect(result).toMatch(/75[,.]5[67]%/);
    });

    it('should format zero', () => {
      const result = formatPercentage(0);
      expect(result).toMatch(/0[,.]0%/);
    });
  });

  describe('formatWeight', () => {
    it('should format weight in kg', () => {
      const result = formatWeight(75.5);
      expect(result).toMatch(/75[,.]5 kg/);
    });

    it('should format weight in lbs', () => {
      const result = formatWeight(165.5, 'lbs');
      expect(result).toMatch(/165[,.]5 lbs/);
    });
  });

  describe('formatHeight', () => {
    it('should format height', () => {
      const result = formatHeight(175);
      expect(result).toMatch(/1[,.]75m/);
    });

    it('should format height with zero cm', () => {
      const result = formatHeight(180);
      expect(result).toMatch(/1[,.]80m/);
    });

    it('should format short height', () => {
      const result = formatHeight(150);
      expect(result).toMatch(/1[,.]50m/);
    });
  });

  describe('formatTimer', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTimer(90)).toBe('01:30');
    });

    it('should format hours to HH:MM:SS', () => {
      expect(formatTimer(3661)).toBe('1:01:01');
    });

    it('should format zero', () => {
      expect(formatTimer(0)).toBe('00:00');
    });

    it('should format single digit seconds', () => {
      expect(formatTimer(5)).toBe('00:05');
    });
  });

  describe('formatDurationText', () => {
    it('should format minutes', () => {
      expect(formatDurationText(45)).toBe('45min');
    });

    it('should format hours', () => {
      expect(formatDurationText(60)).toBe('1h');
    });

    it('should format hours and minutes', () => {
      expect(formatDurationText(90)).toBe('1h30min');
    });

    it('should format zero', () => {
      expect(formatDurationText(0)).toBe('0min');
    });
  });

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle all caps', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle multiple names', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle lowercase', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "agora" for recent time', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('agora');
    });

    it('should return minutes', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60000);
      expect(formatRelativeTime(fiveMinAgo)).toBe('5min');
    });

    it('should return hours', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 3600000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h');
    });

    it('should return days', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
      expect(formatRelativeTime(threeDaysAgo)).toBe('3d');
    });

    it('should handle string date', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      expect(formatRelativeTime(yesterday)).toBe('1d');
    });
  });
});
