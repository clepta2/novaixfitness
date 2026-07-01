import {
  formatDateBR,
  formatDateShort,
  formatDateSmart,
  formatDateWithTime,
  formatRelativeDate,
  formatTimeBR,
  formatTimeAgo,
  formatTimestampAgo,
  formatSeconds,
  formatMinutes,
  formatDuration,
  isToday,
  isSameDay,
  getDaysBetween,
} from '../helpers/dates';

describe('dates helpers', () => {
  describe('formatDateBR', () => {
    it('returns empty for null/undefined', () => {
      expect(formatDateBR(null)).toBe('');
      expect(formatDateBR(undefined)).toBe('');
    });

    it('formats valid date in pt-BR', () => {
      const result = formatDateBR('2025-06-15T12:00:00');
      expect(result).toMatch(/15\/06\/2025/);
    });
  });

  describe('formatDateShort', () => {
    it('returns empty for null', () => {
      expect(formatDateShort(null)).toBe('');
    });

    it('formats short date', () => {
      const result = formatDateShort('2025-06-15T12:00:00');
      expect(result).toMatch(/15/);
    });
  });

  describe('formatDateSmart', () => {
    it('returns empty for undefined', () => {
      expect(formatDateSmart(undefined)).toBe('');
    });

    it('returns Hoje for today', () => {
      const now = new Date().toISOString();
      const result = formatDateSmart(now);
      expect(result).toContain('Hoje');
    });
  });

  describe('formatDateWithTime', () => {
    it('returns empty for null', () => {
      expect(formatDateWithTime(null)).toBe('');
    });

    it('includes date and time', () => {
      const result = formatDateWithTime('2025-06-15T14:30:00');
      expect(result).toMatch(/15\/06\/2025/);
      expect(result).toMatch(/14:30/);
    });
  });

  describe('formatRelativeDate', () => {
    it('returns Sem data for null', () => {
      expect(formatRelativeDate(null)).toBe('Sem data');
    });

    it('returns Hoje for today', () => {
      expect(formatRelativeDate(new Date().toISOString())).toBe('Hoje');
    });

    it('returns Ontem for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatRelativeDate(yesterday.toISOString())).toBe('Ontem');
    });

    it('returns N dias atrás for recent', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(formatRelativeDate(threeDaysAgo.toISOString())).toBe('3 dias atrás');
    });
  });

  describe('formatTimeBR', () => {
    it('returns empty for empty string', () => {
      expect(formatTimeBR('')).toBe('');
    });

    it('returns time string for valid date', () => {
      const result = formatTimeBR('2025-06-15T14:30:00');
      expect(result).toMatch(/14/);
    });
  });

  describe('formatTimeAgo', () => {
    it('returns empty for empty string', () => {
      expect(formatTimeAgo('')).toBe('');
    });

    it('returns agora for very recent', () => {
      expect(formatTimeAgo(new Date().toISOString())).toBe('agora');
    });
  });

  describe('formatTimestampAgo', () => {
    it('returns Nunca for falsy', () => {
      expect(formatTimestampAgo(null)).toBe('Nunca');
      expect(formatTimestampAgo(undefined)).toBe('Nunca');
      expect(formatTimestampAgo(0)).toBe('Nunca');
    });

    it('returns Agora for recent timestamp', () => {
      expect(formatTimestampAgo(Date.now())).toBe('Agora');
    });

    it('returns minutes for ~5 min ago', () => {
      const fiveMinAgo = Date.now() - 5 * 60 * 1000;
      expect(formatTimestampAgo(fiveMinAgo)).toBe('5 min');
    });

    it('returns hours for ~2h ago', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
      expect(formatTimestampAgo(twoHoursAgo)).toBe('2 h');
    });

    it('returns days for >1 day ago', () => {
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
      expect(formatTimestampAgo(threeDaysAgo)).toBe('3 dias');
    });
  });

  describe('formatSeconds', () => {
    it('formats 0 seconds', () => {
      expect(formatSeconds(0)).toBe('0:00');
    });

    it('formats 90 seconds', () => {
      expect(formatSeconds(90)).toBe('1:30');
    });

    it('pads single digit seconds', () => {
      expect(formatSeconds(61)).toBe('1:01');
    });
  });

  describe('formatMinutes', () => {
    it('formats minutes only', () => {
      expect(formatMinutes(30)).toBe('30min');
    });

    it('formats hours only', () => {
      expect(formatMinutes(60)).toBe('1h');
    });

    it('formats hours and minutes', () => {
      expect(formatMinutes(90)).toBe('1h30min');
    });
  });

  describe('formatDuration', () => {
    it('formats minutes:seconds', () => {
      expect(formatDuration(90)).toBe('1:30');
    });

    it('formats hours:minutes:seconds', () => {
      expect(formatDuration(3661)).toBe('1:01:01');
    });

    it('formats 0 seconds', () => {
      expect(formatDuration(0)).toBe('0:00');
    });
  });

  describe('isToday', () => {
    it('returns false for null', () => {
      expect(isToday(null)).toBe(false);
    });

    it('returns true for today', () => {
      expect(isToday(new Date().toISOString())).toBe(true);
    });

    it('returns false for other date', () => {
      expect(isToday('2020-01-01')).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('returns false for null inputs', () => {
      expect(isSameDay(null, null)).toBe(false);
      expect(isSameDay('2025-01-01', null)).toBe(false);
      expect(isSameDay(null, '2025-01-01')).toBe(false);
    });

    it('returns true for same date', () => {
      expect(isSameDay('2025-06-15T10:00:00', '2025-06-15T23:59:59')).toBe(true);
    });

    it('returns false for different dates', () => {
      expect(isSameDay('2025-06-15', '2025-06-16')).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    it('returns 0 for same date', () => {
      expect(getDaysBetween('2025-06-15', '2025-06-15')).toBe(0);
    });

    it('returns positive for future', () => {
      expect(getDaysBetween('2025-06-15', '2025-06-18')).toBe(3);
    });

    it('returns negative for past', () => {
      expect(getDaysBetween('2025-06-18', '2025-06-15')).toBe(-3);
    });
  });
});
