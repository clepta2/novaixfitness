// __tests__/services/eventTracker.test.js

jest.mock('../../src/config/supabase', () => {
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.insert = jest.fn(() => Promise.resolve({ data: null, error: null }));
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  return { supabase: chain };
});

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

const tracker = require('../../src/services/eventTracker');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('eventTracker', () => {
  it('trackEvent is a function', () => {
    expect(typeof tracker.trackEvent).toBe('function');
  });

  it('trackScreenView is a function', () => {
    expect(typeof tracker.trackScreenView).toBe('function');
  });

  it('trackWorkoutStarted is a function', () => {
    expect(typeof tracker.trackWorkoutStarted).toBe('function');
  });

  it('trackWorkoutCompleted is a function', () => {
    expect(typeof tracker.trackWorkoutCompleted).toBe('function');
  });

  it('EVENT_TYPES object has event names', () => {
    expect(tracker.EVENT_TYPES).toBeDefined();
    expect(typeof tracker.EVENT_TYPES).toBe('object');
  });
});
