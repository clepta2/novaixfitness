// __tests__/services/workoutSaver.test.js

jest.mock('../../src/config/supabase', () => {
  const chain = {};
  chain.from = jest.fn(() => chain);
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.upsert = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data: null, error: null }));
  chain.then = (resolve) => Promise.resolve({ data: null, error: null }).then(resolve);
  chain._setData = (d) => { chain._stateData = d; };
  chain._reset = () => {
    chain.from.mockReturnValue(chain);
    chain.select.mockReturnValue(chain);
    chain.eq.mockReturnValue(chain);
    chain.insert.mockReturnValue(chain);
    chain.update.mockReturnValue(chain);
    chain.upsert.mockReturnValue(chain);
    chain.single.mockImplementation(() => Promise.resolve({ data: null, error: null }));
  };
  chain._reset();
  return { supabase: chain };
});

jest.mock('../../src/services/gamification', () => ({
  addXP: jest.fn().mockResolvedValue(50),
  recordWorkoutCompletion: jest.fn().mockResolvedValue({ xpGained: 50, newAchievements: [], streak: 1 }),
}));

jest.mock('../../src/services/notifications', () => ({
  sendWorkoutCompletedNotification: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/pushNotifications', () => ({
  sendPushToUser: jest.fn().mockResolvedValue({}),
}));

const { supabase: mockSupabase } = require('../../src/config/supabase');
const { recordWorkoutCompletion } = require('../../src/services/gamification');
const { sendPushToUser } = require('../../src/services/pushNotifications');
const { saveCompleteWorkout, savePartialWorkout } = require('../../src/services/workoutSaver');

describe('Workout Saver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase._reset();
  });

  describe('saveCompleteWorkout', () => {
    it('returns null when no userId', async () => {
      const result = await saveCompleteWorkout(null, { id: 'w1' }, [], 30);
      expect(result).toBeNull();
    });

    it('saves completed workout and returns gamification data', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'uw1' }, error: null }));

      const result = await saveCompleteWorkout('u1', { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Treino A' }, [{ exercise: 'Agachamento' }], 45);

      expect(result).not.toBeNull();
      expect(recordWorkoutCompletion).toHaveBeenCalled();
    });
  });

  describe('savePartialWorkout', () => {
    it('returns null when no userId', async () => {
      const result = await savePartialWorkout(null, { id: 'w1' }, [], 15);
      expect(result).toBeNull();
    });

    it('saves partial workout', async () => {
      mockSupabase.single.mockImplementation(() => Promise.resolve({ data: { id: 'pw1' }, error: null }));

      const result = await savePartialWorkout('u1', { id: 'w1' }, [{ exercise: 'Supino' }], 20);
      expect(result).not.toBeNull();
    });
  });
});
