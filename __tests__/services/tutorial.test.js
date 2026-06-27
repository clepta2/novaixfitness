jest.mock('../../src/config/supabase', () => {
  const mockSingle = jest.fn();
  const mockEq = jest.fn(() => ({ single: mockSingle }));
  const mockOrder = jest.fn(() => ({ eq: mockEq }));
  const mockSelect = jest.fn(() => ({ eq: mockEq, single: mockSingle, order: mockOrder }));
  const mockUpdate = jest.fn(() => ({ eq: jest.fn().mockResolvedValue({}) }));
  const mockFrom = jest.fn(() => ({ select: mockSelect, update: mockUpdate }));
  return { supabase: { from: mockFrom, __mocks: { mockSingle, mockSelect, mockUpdate } } };
});

import {
  hasCompletedTutorial,
  completeTutorial,
  markTutorialSkipped,
  getTutorialSteps,
  getStepForScreen,
} from '../../src/services/tutorial';

const { supabase } = require('../../src/config/supabase');
const { mockSingle, mockUpdate } = supabase.__mocks;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Tutorial Service', () => {
  describe('hasCompletedTutorial', () => {
    it('returns false when no userId', async () => {
      expect(await hasCompletedTutorial(null)).toBe(false);
      expect(await hasCompletedTutorial(undefined)).toBe(false);
    });

    it('returns true when tutorial_completed is true', async () => {
      mockSingle.mockResolvedValue({ data: { tutorial_completed: true } });
      expect(await hasCompletedTutorial('u1')).toBe(true);
    });

    it('returns false when tutorial_completed is false', async () => {
      mockSingle.mockResolvedValue({ data: { tutorial_completed: false } });
      expect(await hasCompletedTutorial('u1')).toBe(false);
    });

    it('returns false when data is null', async () => {
      mockSingle.mockResolvedValue({ data: null });
      expect(await hasCompletedTutorial('u1')).toBe(false);
    });
  });

  describe('completeTutorial', () => {
    it('does nothing when no userId', async () => {
      await completeTutorial(null);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('updates tutorial_completed to true', async () => {
      await completeTutorial('u1');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith({ tutorial_completed: true });
    });
  });

  describe('markTutorialSkipped', () => {
    it('does nothing when no userId', async () => {
      await markTutorialSkipped(null);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('updates tutorial_skipped to true', async () => {
      await markTutorialSkipped('u1');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith({ tutorial_skipped: true });
    });
  });

  describe('getTutorialSteps', () => {
    it('returns array of steps', () => {
      const steps = getTutorialSteps();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBe(6);
    });

    it('each step has required fields', () => {
      const steps = getTutorialSteps();
      steps.forEach(step => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('screen');
      });
    });
  });

  describe('getStepForScreen', () => {
    it('returns steps for specific screen', () => {
      const homeSteps = getStepForScreen('home');
      expect(homeSteps.length).toBeGreaterThan(0);
      homeSteps.forEach(step => expect(step.screen).toBe('home'));
    });

    it('returns empty array for non-existent screen', () => {
      expect(getStepForScreen('nonexistent')).toEqual([]);
    });
  });
});
