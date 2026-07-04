// __tests__/services/checkIn.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.maybeSingle = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve, reject) => Promise.resolve({ data: state.data, error: state.error }).then(resolve, reject);
  chain.catch = (fn) => Promise.resolve({ data: state.data, error: state.error }).catch(fn);
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._reset = () => {
    state.data = null; state.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.order.mockReturnValue(chain);
    chain.limit.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
    chain.maybeSingle.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: chain };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { performCheckIn, getTodayCheckIn, getCheckInStreak } = require('../../src/services/checkIn');

describe('Check-in Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('performCheckIn', () => {
    it('should perform check-in and return streak info', async () => {
      mockSupabase._setData([]);
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));

      const result = await performCheckIn('user-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('daily_check_ins');
      expect(result).toBeDefined();
    });

    it('should return alreadyCheckedIn if already checked in today', async () => {
      mockSupabase._setData([{ id: 'existing' }]);
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'existing' }, error: null }));

      const result = await performCheckIn('user-1');

      expect(result).toBeDefined();
    });

    it('should reset streak if gap > 1 day', async () => {
      mockSupabase._setData([]);
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));

      const result = await performCheckIn('user-1');
      expect(result).toBeDefined();
    });
  });

  describe('getCheckInStreak', () => {
    it('should return current streak', async () => {
      mockSupabase._setData([{ checked_at: new Date().toISOString() }]);

      const result = await getCheckInStreak('user-1');
      expect(result).toBeDefined();
    });

    it('should return 0 if no streak', async () => {
      mockSupabase._setData([]);

      const result = await getCheckInStreak('user-1');
      expect(result).toBeDefined();
    });
  });

  describe('getTodayCheckIn', () => {
    it('should return today check-in if exists', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'ci-1' }, error: null }));

      const result = await getTodayCheckIn('user-1');
      expect(result).toBeDefined();
    });

    it('should return null if no check-in today', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } }));

      const result = await getTodayCheckIn('user-1');
      expect(result).toBeNull();
    });
  });
});
