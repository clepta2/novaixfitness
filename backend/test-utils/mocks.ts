// test-utils/mocks.js
// Mocks centralizados para testes - NOVAIX FITNESS

const createChainable = (returnValue = { data: [], error: null, count: 0 }) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
  
  chain.then = function(resolve, reject) {
    return Promise.resolve(returnValue).then(resolve, reject);
  };
  
  return chain;
};

const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@test.com', app_metadata: { role: 'user' } } },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' }, session: null }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' }, session: { access_token: 'token' } }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    admin: {
      createUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      updateUserById: jest.fn().mockResolvedValue({ data: {}, error: null }),
      deleteUser: jest.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
  from: jest.fn(() => createChainable()),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
};

const mockUser = {
  id: 'user-123',
  email: 'test@test.com',
  app_metadata: { role: 'user' },
};

const mockAdminUser = {
  id: 'admin-123',
  email: 'admin@test.com',
  app_metadata: { role: 'admin' },
};

const mockProfile = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@test.com',
  subscription_status: 'active',
  subscription_plan: 'premium',
  current_step: 'home',
  onboarding: { goal: 'muscle_gain', level: 'intermediate', location: 'gym' },
  total_workouts: 50,
  total_minutes: 1200,
  total_xp: 5000,
  streak: 10,
  max_streak: 15,
};

const mockWorkout = {
  id: 'workout-123',
  name: 'Treino A - Peito',
  category: 'Musculação',
  level: 'intermediate',
  duration_minutes: 45,
  is_premium: false,
  exercises: [
    { name: 'Supino Reto', sets: 4, reps: '10-12', rest: 90 }
  ],
  created_at: new Date().toISOString(),
};

const mockPremiumWorkout = {
  ...mockWorkout,
  id: 'premium-workout-123',
  name: 'Treino Premium - Avançado',
  is_premium: true,
};

const mockUserWorkout = {
  id: 'uw-123',
  user_id: 'user-123',
  workout_id: 'workout-123',
  completed: true,
  completed_at: new Date().toISOString(),
  rating: 4,
  notes: 'Bom treino',
  duration_minutes: 45,
  calories_burned: 350,
};

module.exports = {
  createChainable,
  mockSupabase,
  mockUser,
  mockAdminUser,
  mockProfile,
  mockWorkout,
  mockPremiumWorkout,
  mockUserWorkout,
};
