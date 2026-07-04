import { DETAILED_EXERCISES } from '../../src/data/exercises';

describe('Exercises Data', () => {
  it('has exercises', () => {
    expect(Object.keys(DETAILED_EXERCISES).length).toBeGreaterThan(0);
  });

  it('each exercise has steps, tips, and mistakes', () => {
    Object.entries(DETAILED_EXERCISES).forEach(([key, exercise]) => {
      expect(exercise).toHaveProperty('steps');
      expect(exercise).toHaveProperty('tips');
      expect(exercise).toHaveProperty('mistakes');
      expect(Array.isArray(exercise.steps)).toBe(true);
      expect(exercise.steps.length).toBeGreaterThan(0);
      expect(Array.isArray(exercise.tips)).toBe(true);
      expect(Array.isArray(exercise.mistakes)).toBe(true);
    });
  });

  it('each step has step number, title, text, and image', () => {
    Object.values(DETAILED_EXERCISES).forEach(exercise => {
      exercise.steps.forEach(step => {
        expect(step).toHaveProperty('step');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('text');
        expect(step).toHaveProperty('image');
      });
    });
  });

  it('includes common exercises', () => {
    expect(DETAILED_EXERCISES).toHaveProperty('push_up');
    expect(DETAILED_EXERCISES).toHaveProperty('squat');
  });
});
