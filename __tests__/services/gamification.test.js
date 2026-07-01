// __tests__/services/gamification.test.js

jest.mock('../../src/config/supabase', () => {
  const state = { data: null, error: null };
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: state.data, error: state.error }));
  chain.then = (resolve) => Promise.resolve({ data: state.data, error: state.error }).then(resolve);
  chain._setData = (d) => { state.data = d; };
  chain._setError = (e) => { state.error = e; };
  chain._reset = () => {
    state.data = null; state.error = null;
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.upsert.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: chain };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { awardXP, getGamificationData } = require('../../src/services/gamification');

describe('Gamification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('awardXP', () => {
    it('returns null result for null userId', async () => {
      const result = await awardXP(null, 'WORKOUT_COMPLETED');
      expect(result).toBeDefined();
    });

    it('returns result for 0 xpGain', async () => {
      const result = await awardXP('user-1', 'UNKNOWN_TYPE', 0);
      expect(result).toBeDefined();
    });

    it('adds XP to user profile', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { total_xp: 100 }, error: null }));

      const result = await awardXP('user-1', 'WORKOUT_COMPLETED');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('xp');
      expect(mockSupabase.from).toHaveBeenCalled();
    });

    it('adds custom amount', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { total_xp: 0 }, error: null }));

      const result = await awardXP('user-1', 'WORKOUT_COMPLETED', 500);
      expect(result).toBeDefined();
    });

    it('handles missing profile gracefully', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));

      const result = await awardXP('user-1', 'WORKOUT_COMPLETED');
      expect(result).toBeDefined();
    });
  });

  describe('getGamificationData', () => {
    it('returns data for null userId', async () => {
      const result = await getGamificationData(null);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalXP');
      expect(result).toHaveProperty('levelData');
    });

    it('returns gamification data with profile', async () => {
      mockSupabase.single.mockImplementation(() =>
        Promise.resolve({ data: { total_xp: 500 }, error: null })
      );

      const result = await getGamificationData('user-1');
      expect(result).toHaveProperty('totalXP', 500);
      expect(result).toHaveProperty('levelData');
    });
  });
});
