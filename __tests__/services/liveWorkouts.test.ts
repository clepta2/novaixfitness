// __tests__/services/liveWorkouts.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve) => Promise.resolve({ data: state.data, error: state.error }).then(resolve);
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._reset = () => {
    state.data = null; state.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
    chain.maybeSingle.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  chain.rpc = jest.fn().mockResolvedValue({ data: null, error: null });
  return { supabase: chain };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { createLive, joinLive, sendMessage, updateWorkoutState } = require('../../src/services/liveWorkouts');

describe('Live Workouts Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('createLive', () => {
    it('should create a live workout', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({
        data: { id: 'live-1', title: 'Morning HIIT', host_id: 'host-1', status: 'scheduled' }, error: null
      }));

      const result = await createLive('host-1', { title: 'Morning HIIT', workoutType: 'hiit' });

      expect(mockSupabase.from).toHaveBeenCalledWith('live_workouts');
      expect(result.id).toBe('live-1');
    });
  });

  describe('joinLive', () => {
    it('should add participant to live', async () => {
      mockSupabase.single
        .mockImplementationOnce(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))
        .mockImplementationOnce(() => Promise.resolve({ data: { id: 'p-new', role: 'participant' }, error: null }));

      const result = await joinLive('live-1', 'user-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('live_participants');
      expect(result).toBeTruthy();
    });

    it('should return existing participant if already joined', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'p1' }, error: null }));

      const result = await joinLive('live-1', 'user-1');

      expect(result.id).toBe('p1');
    });
  });

  describe('sendMessage', () => {
    it('should send a message to live chat', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({
        data: { id: 'msg-1', message: 'Hello!', type: 'chat' }, error: null
      }));

      const result = await sendMessage('live-1', 'user-1', 'Hello!');

      expect(mockSupabase.from).toHaveBeenCalledWith('live_messages');
      expect(result.message).toBe('Hello!');
    });
  });

  describe('updateWorkoutState', () => {
    it('should update timer state', async () => {
      await updateWorkoutState('live-1', { timer_seconds: 120, is_resting: false });

      expect(mockSupabase.from).toHaveBeenCalledWith('live_workout_state');
      expect(mockSupabase.update).toHaveBeenCalled();
    });
  });
});
