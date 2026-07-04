import {
  formatDateBR,
  formatDateShort,
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
} from '../../src/helpers/dates';

describe('formatDateBR', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatDateBR(null)).toBe('');
    expect(formatDateBR(undefined)).toBe('');
  });

  it('formats date in pt-BR', () => {
    const result = formatDateBR('2025-01-15T12:00:00');
    expect(result).toContain('2025');
  });
});

describe('formatRelativeDate', () => {
  it('returns "Sem data" for null', () => {
    expect(formatRelativeDate(null)).toBe('Sem data');
  });

  it('returns "Hoje" for today', () => {
    expect(formatRelativeDate(new Date().toISOString())).toBe('Hoje');
  });

  it('returns "Ontem" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    expect(formatRelativeDate(yesterday)).toBe('Ontem');
  });
});

describe('formatSeconds', () => {
  it('formats 0 as 0:00', () => {
    expect(formatSeconds(0)).toBe('0:00');
  });

  it('formats 65 as 1:05', () => {
    expect(formatSeconds(65)).toBe('1:05');
  });

  it('formats 3661 as 61:01', () => {
    expect(formatSeconds(3661)).toBe('61:01');
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
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2:05');
  });

  it('formats hours, minutes, seconds', () => {
    expect(formatDuration(3665)).toBe('1:01:05');
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date().toISOString())).toBe(true);
  });

  it('returns false for null', () => {
    expect(isToday(null)).toBe(false);
  });
});

describe('isSameDay', () => {
  it('returns true for same day', () => {
    const date = '2025-01-15T10:00:00';
    expect(isSameDay(date, '2025-01-15T15:00:00')).toBe(true);
  });

  it('returns false for different days', () => {
    expect(isSameDay('2025-01-15', '2025-01-16')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isSameDay(null, '2025-01-15')).toBe(false);
  });
});

describe('getDaysBetween', () => {
  it('calculates days between dates', () => {
    expect(getDaysBetween('2025-01-10', '2025-01-15')).toBe(5);
  });

  it('returns 0 for same day', () => {
    expect(getDaysBetween('2025-01-15', '2025-01-15')).toBe(0);
  });
});
