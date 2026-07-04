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

  it('trackScreen is a function', () => {
    expect(typeof tracker.trackScreen).toBe('function');
  });

  it('trackWorkoutStart is a function', () => {
    expect(typeof tracker.trackWorkoutStart).toBe('function');
  });

  it('trackWorkoutComplete is a function', () => {
    expect(typeof tracker.trackWorkoutComplete).toBe('function');
  });

  it('Events object has event names', () => {
    expect(tracker.Events).toBeDefined();
    expect(typeof tracker.Events).toBe('object');
  });
});
