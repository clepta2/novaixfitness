import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/styles', () => ({
  typography: {
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    brand: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24 },
  },
  layout: {
    screen: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    onboarding: { goal: 'muscle_gain', weight: 75, level: 'intermediate' },
    updateProfile: jest.fn(),
  }),
}));

jest.mock('../../src/config/supabase', () => {
  const mockChain = {
    select: jest.fn(() => mockChain),
    eq: jest.fn(() => mockChain),
    gte: jest.fn(() => mockChain),
    lte: jest.fn(() => mockChain),
    order: jest.fn(() => mockChain),
    limit: jest.fn(() => Promise.resolve({ data: null, error: null })),
    single: jest.fn(() => Promise.resolve({ data: null })),
    upsert: jest.fn(() => Promise.resolve({ error: null })),
    insert: jest.fn(() => Promise.resolve({ error: null })),
  };
  return {
    supabase: {
      from: jest.fn(() => mockChain),
    },
  };
});

jest.mock('../../src/services/voiceCoach', () => ({
  speakWelcome: jest.fn(),
}));

jest.mock('../../src/services/tutorial', () => ({
  getTutorialSteps: jest.fn().mockReturnValue([]),
  completeTutorial: jest.fn(),
}));

jest.mock('../../src/services/planGenerator', () => ({
  generateWorkoutPlan: jest.fn().mockResolvedValue({ week: [] }),
  saveWorkoutPlan: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../src/helpers/navigation', () => ({
  ROUTES: { PAYWALL: '/paywall', HOME: '/(tabs)/home' },
}));

import WarmupScreen from '../../app/warmup';
import RecoveryScreen from '../../app/recovery';

describe('WarmupScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<WarmupScreen />);
    expect(toJSON()).toBeTruthy();
  });
});

describe('RecoveryScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RecoveryScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
