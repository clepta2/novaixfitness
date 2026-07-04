// __tests__/services/liveWorkouts.test.ts
// Mock with both maybeSingle terminal and .then for non-terminal chains

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  let rpcResult = { data: null, error: null };

  const resetChain = () => {
    chain.from = jest.fn(() => chain);
    chain.select = jest.fn(() => chain);
    chain.eq = jest.fn(() => chain);
    chain.insert = jest.fn(() => chain);
    chain.update = jest.fn(() => chain);
    chain.delete = jest.fn(() => chain);
    chain.upsert = jest.fn(() => chain);
    chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
    chain.in = jest.fn(() => chain);
    chain.is = jest.fn(() => chain);
    chain.order = jest.fn(() => chain);
    chain.limit = jest.fn(() => chain);
    chain.channel = jest.fn(() => ({ on: jest.fn().mockReturnThis(), subscribe: jest.fn() }));
    chain.removeChannel = jest.fn();
    // .then for chains without terminal method (update, insert without select)
    chain.then = (resolve, reject) => Promise.resolve({ data: state.data, error: state.error }).then(resolve, reject);
    chain.rpc = jest.fn().mockImplementation(() => Promise.resolve(rpcResult));
  };

  resetChain();

  return {
    supabase: Object.defineProperties(chain, {
      _setData: { value: (d) => { state.data = d; }, writable: true },
      _setError: { value: (e) => { state.error = e; }, writable: true },
      _setRpc: { value: (r) => { rpcResult = r; }, writable: true },
      _reset: { value: () => { state.data = null; state.error = null; rpcResult = { data: null, error: null }; resetChain(); }, writable: true },
    }),
  };
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
      mockSupabase.maybeSingle.mockImplementation(() => Promise.resolve({
        data: { id: 'live-1', title: 'Morning HIIT', host_id: 'host-1', status: 'scheduled' }, error: null
      }));

      const result = await createLive('host-1', { title: 'Morning HIIT', workoutType: 'hiit' });

      expect(mockSupabase.from).toHaveBeenCalledWith('live_workouts');
      expect(result.id).toBe('live-1');
    });
  });

  describe('joinLive', () => {
    it('should add participant to live', async () => {
      mockSupabase.maybeSingle
        .mockImplementationOnce(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }))
        .mockImplementationOnce(() => Promise.resolve({ data: { id: 'p-new', role: 'participant' }, error: null }));

      const result = await joinLive('live-1', 'user-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('live_participants');
      expect(result).toBeTruthy();
    });

    it('should return existing participant if already joined', async () => {
      mockSupabase.maybeSingle.mockImplementation(() => Promise.resolve({ data: { id: 'p1' }, error: null }));

      const result = await joinLive('live-1', 'user-1');

      expect(result.id).toBe('p1');
    });
  });

  describe('sendMessage', () => {
    it('should send a message to live chat', async () => {
      mockSupabase.maybeSingle.mockImplementation(() => Promise.resolve({
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
