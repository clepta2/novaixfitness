import { calcStreak } from '../helpers/streaks';

describe('calcStreak', () => {
  function dateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  }

  it('returns 0 for empty array', () => {
    expect(calcStreak([])).toBe(0);
  });

  it('returns 0 when no workouts are completed', () => {
    expect(calcStreak([
      { completed: false, completed_at: dateStr(0) },
      { completed: true, completed_at: undefined },
    ])).toBe(0);
  });

  it('returns 1 for single completed workout', () => {
    expect(calcStreak([{ completed: true, completed_at: dateStr(0) }])).toBe(1);
  });

  it('counts consecutive days', () => {
    const workouts = [
      { completed: true, completed_at: dateStr(0) },
      { completed: true, completed_at: dateStr(1) },
      { completed: true, completed_at: dateStr(2) },
    ];
    expect(calcStreak(workouts)).toBe(3);
  });

  it('stops counting at gap', () => {
    const workouts = [
      { completed: true, completed_at: dateStr(0) },
      { completed: true, completed_at: dateStr(1) },
      { completed: true, completed_at: dateStr(3) }, // gap
    ];
    expect(calcStreak(workouts)).toBe(2);
  });

  it('deduplicates same-day workouts', () => {
    const workouts = [
      { completed: true, completed_at: dateStr(0) },
      { completed: true, completed_at: dateStr(0) },
      { completed: true, completed_at: dateStr(1) },
    ];
    expect(calcStreak(workouts)).toBe(2);
  });

  it('handles workouts not sorted by date', () => {
    const workouts = [
      { completed: true, completed_at: dateStr(2) },
      { completed: true, completed_at: dateStr(0) },
      { completed: true, completed_at: dateStr(1) },
    ];
    expect(calcStreak(workouts)).toBe(3);
  });

  it('ignores incomplete workouts in streak calc', () => {
    const workouts = [
      { completed: true, completed_at: dateStr(0) },
      { completed: false, completed_at: dateStr(1) },
      { completed: true, completed_at: dateStr(2) },
    ];
    expect(calcStreak(workouts)).toBe(1);
  });
});
