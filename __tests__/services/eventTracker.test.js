jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn(() => ({ insert: jest.fn().mockResolvedValue({}) })) },
}));

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

const { setTrackerUser, trackEvent, trackScreen, trackWorkoutStart, trackWorkoutComplete, Events } = require('../../src/services/eventTracker');

beforeEach(() => jest.clearAllMocks());

describe('eventTracker', () => {
  it('does nothing when user not set', async () => {
    await trackEvent('test_event');
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('tracks event after user set', async () => {
    setTrackerUser('user-123');
    await trackEvent('custom_event', { key: 'value' });
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalledWith('analytics_events');
  });

  it('trackScreen sends screen_view event', async () => {
    setTrackerUser('user-123');
    await trackScreen('home');
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalledWith('analytics_events');
  });

  it('trackWorkoutStart sends workout_start', async () => {
    setTrackerUser('user-123');
    await trackWorkoutStart('w-1', 'Treino A');
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalled();
  });

  it('trackWorkoutComplete sends workout_complete', async () => {
    setTrackerUser('user-123');
    await trackWorkoutComplete('w-1', 45);
    const { supabase } = require('../../src/config/supabase');
    expect(supabase.from).toHaveBeenCalled();
  });

  it('Events object has all event names', () => {
    expect(Events.SCREEN_VIEW).toBe('screen_view');
    expect(Events.WORKOUT_START).toBe('workout_start');
    expect(Events.WORKOUT_COMPLETE).toBe('workout_complete');
    expect(Events.PAYWALL_VIEW).toBe('paywall_view');
  });
});
