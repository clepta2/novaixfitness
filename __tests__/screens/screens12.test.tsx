import React from 'react';
import { Text } from 'react-native';
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
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useLocalSearchParams: () => ({ id: 'test-workout' }),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/constants/shadows', () => ({
  SHADOWS: { sm: {}, md: {}, lg: {} },
}));

jest.mock('../../src/styles', () => ({
  typography: {
    label: { fontFamily: 'Montserrat_700Bold', fontSize: 11 },
    h2: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 18 },
    h3: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    h4: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerBtn: { width: 40, height: 40 },
    section: { marginBottom: 24 },
    footer: { padding: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com', user_metadata: { name: 'Atleta' } },
    signOut: jest.fn(),
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      count: jest.fn().mockReturnThis(),
      head: jest.fn().mockResolvedValue({ count: 0, error: null }),
    })),
  },
}));

jest.mock('../../src/hooks', () => ({
  useSupabaseData: () => ({ data: [], refetch: jest.fn() }),
}));

jest.mock('../../src/services/offline', () => ({
  cacheWorkoutDetail: jest.fn(),
  getCachedWorkoutDetail: jest.fn().mockResolvedValue(null),
  isWorkoutCached: jest.fn().mockResolvedValue(false),
}));

jest.mock('../../src/services/share', () => ({
  shareWorkout: jest.fn(),
}));

jest.mock('../../src/services/gamification', () => ({
  getGamificationData: jest.fn().mockResolvedValue({ totalXP: 100, achievements: [] }),
}));

jest.mock('../../src/constants/gamification', () => ({
  ACHIEVEMENTS: [],
}));

jest.mock('../../src/data/workouts', () => ({
  fallbackWorkout: { id: 'fallback', name: 'Treino Fallback', exercises: [], equipment: [] },
}));

jest.mock('../../src/styles/workoutDetailStyles', () => ({
  styles: {},
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    Badge: (props) => React.createElement(View, null, React.createElement(Text, null, props.value)),
    ProgressBar: (props) => React.createElement(View, null),
    ExerciseAccordion: (props) => React.createElement(View, null, React.createElement(Text, null, props.exercise?.name || 'Exercise')),
    WorkoutInfo: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutInfo')),
    VideoPreview: (props) => React.createElement(View, null),
    MoreOptionsModal: (props) => React.createElement(View, null),
    RatingModal: (props) => React.createElement(View, null),
    PostCard: (props) => React.createElement(View, null),
    CreatePostModal: (props) => React.createElement(View, null),
    NotificationModal: (props) => React.createElement(View, null),
    ProfileHero: (props) => React.createElement(View, null, React.createElement(Text, null, 'ProfileHero')),
    AchievementsCarousel: (props) => React.createElement(View, null),
    QuickActionsGrid: (props) => React.createElement(View, null),
    ProfileMenuGroup: (props) => React.createElement(View, null),
    RankingCard: (props) => React.createElement(View, null),
    WeeklyChallenges: (props) => React.createElement(View, null),
    WeightLogger: (props) => React.createElement(View, null),
    EditNameModal: (props) => React.createElement(View, null),
    GamificationBar: (props) => React.createElement(View, null),
    TutorialOverlay: (props) => React.createElement(View, null),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/hooks/useTutorial', () => ({
  useTutorial: () => ({
    visible: false,
    steps: [],
    handleComplete: jest.fn(),
    handleSkip: jest.fn(),
  }),
}));

import WorkoutDetailScreen from '../../app/workout-detail';
import ProfileScreen from '../../app/(tabs)/perfil/index';

describe('Screens - Round 12', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WorkoutDetailScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<WorkoutDetailScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('ProfileScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ProfileScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
