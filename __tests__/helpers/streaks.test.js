import { calcStreak } from '../../src/helpers/streaks';

describe('calcStreak', () => {
  const makeWorkout = (daysAgo, completed = true) => ({
    completed,
    completed_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  });

  it('returns 0 for empty workouts', () => {
    expect(calcStreak([])).toBe(0);
  });

  it('returns 0 when no workouts are completed', () => {
    const workouts = [makeWorkout(0, false), makeWorkout(1, false)];
    expect(calcStreak(workouts)).toBe(0);
  });

  it('returns 1 for single completed workout today', () => {
    expect(calcStreak([makeWorkout(0)])).toBe(1);
  });

  it('returns 2 for consecutive days', () => {
    const workouts = [makeWorkout(0), makeWorkout(1)];
    expect(calcStreak(workouts)).toBe(2);
  });

  it('returns 3 for three consecutive days', () => {
    const workouts = [makeWorkout(0), makeWorkout(1), makeWorkout(2)];
    expect(calcStreak(workouts)).toBe(3);
  });

  it('breaks streak on gap day', () => {
    const workouts = [makeWorkout(0), makeWorkout(1), makeWorkout(3)];
    expect(calcStreak(workouts)).toBe(2);
  });

  it('handles unsorted workouts', () => {
    const workouts = [makeWorkout(2), makeWorkout(0), makeWorkout(1)];
    expect(calcStreak(workouts)).toBe(3);
  });

  it('deduplicates same-day workouts', () => {
    const workouts = [makeWorkout(0), makeWorkout(0), makeWorkout(1)];
    expect(calcStreak(workouts)).toBe(2);
  });
});
