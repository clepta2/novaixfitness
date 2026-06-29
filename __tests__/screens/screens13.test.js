import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('expo-font', () => ({ useFonts: () => [true] }));
jest.mock('@expo/vector-icons', () => {
  const R = require('react');
  return { Ionicons: (p) => R.createElement('Ionicons', p) };
});
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
}));
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 't@t.com' }, profile: {}, onboarding: {}, signOut: jest.fn() }),
}));
jest.mock('../../src/config/supabase', () => {
  const { createMockSupabase } = require('../__mocks__/supabase');
  return { supabase: createMockSupabase() };
});
jest.mock('../../src/styles', () => ({
  typography: { h2: {}, h3: {}, h4: {}, h5: {}, bodyMuted: {}, caption: {}, label: {} },
  layout: { screen: { flex: 1 }, scroll: { padding: 24 }, header: {}, section: {} },
}));
jest.mock('../../src/constants/shadows', () => ({ SHADOWS: { sm: {}, md: {}, lg: {} } }));
jest.mock('../../src/utils/responsive', () => ({ scale: (n) => n }));
jest.mock('../../src/components', () => {
  const R = require('react');
  const { View, Text } = require('react-native');
  const Stub = (n) => (p) => R.createElement(View, null, R.createElement(Text, null, n));
  return new Proxy({}, { get: (_, k) => Stub(k) });
});
jest.mock('../../src/components/marketplace', () => {
  const R = require('react');
  const { View, Text } = require('react-native');
  const Stub = (n) => (p) => R.createElement(View, null, R.createElement(Text, null, n));
  return new Proxy({}, { get: (_, k) => Stub(k) });
});
jest.mock('../../src/hooks/useDebounce', () => ({ useDebounce: (v) => v }));
jest.mock('../../src/hooks/useTutorial', () => ({ useTutorial: () => ({ showTutorial: false, completeTutorial: jest.fn(), shouldShowTutorial: false }) }));
jest.mock('../../src/hooks/useNetworkStatus', () => ({ __esModule: true, default: () => ({ isOffline: false }), useNetworkStatus: () => ({ isOffline: false }) }));
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn().mockResolvedValue(null), setItem: jest.fn(), removeItem: jest.fn() }));
jest.mock('../../src/context/ThemeContext', () => ({ useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }) }));

jest.mock('../../src/services/marketplace', () => ({
  getProducts: jest.fn().mockResolvedValue([]),
  getFeaturedProducts: jest.fn().mockResolvedValue([]),
  getFavoriteIds: jest.fn().mockResolvedValue(new Set()),
  toggleFavorite: jest.fn().mockResolvedValue(false),
  getActivePromotions: jest.fn().mockResolvedValue([]),
  getRecommendedProducts: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../src/data/marketplaceCategories', () => ({ MARKETPLACE_CATEGORIES: [] }));
jest.mock('../../src/services/payment', () => ({ PLANS: {} }));
jest.mock('../../src/services/notificationPrefs', () => ({ getPrefsForSettings: jest.fn().mockResolvedValue({}), setNotificationPref: jest.fn() }));
jest.mock('../../src/services/tutorial', () => ({ resetAllTutorials: jest.fn(), hasCompletedTutorial: jest.fn().mockResolvedValue(true), completeTutorial: jest.fn().mockResolvedValue(true), markTutorialSkipped: jest.fn().mockResolvedValue(true), getTutorialSteps: jest.fn().mockReturnValue([]) }));
jest.mock('../../src/services/share', () => ({ shareProgress: jest.fn() }));
jest.mock('../../src/services/voiceCoach', () => ({ setVoiceCoachEnabled: jest.fn() }));
jest.mock('../../src/services/gamification', () => ({ getUserAchievements: jest.fn().mockResolvedValue([]), getUserBadges: jest.fn().mockResolvedValue([]), getLeaderboard: jest.fn().mockResolvedValue([]), getPoints: jest.fn().mockResolvedValue(0) }));
jest.mock('../../src/constants/gamification', () => ({ GAMIFICATION: {}, ACHIEVEMENTS: [], XP_VALUES: {} }));
jest.mock('../../src/services/appleWatch', () => ({ isAvailable: jest.fn().mockResolvedValue(false), startWorkout: jest.fn().mockResolvedValue({}), stopWorkout: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/services/healthConnect', () => ({ isAvailable: jest.fn().mockResolvedValue(false), syncData: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/services/strava', () => ({ isAuthenticated: jest.fn().mockResolvedValue(false), authenticate: jest.fn().mockResolvedValue({}), syncActivities: jest.fn().mockResolvedValue([]) }));
jest.mock('../../src/services/body-measurements', () => ({ getMeasurements: jest.fn().mockResolvedValue([]), addMeasurement: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/services/progress-photos', () => ({ getPhotos: jest.fn().mockResolvedValue([]), addPhoto: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/services/notifications', () => ({ getNotifications: jest.fn().mockResolvedValue([]), markAsRead: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/hooks/useRealtimePosts', () => ({ useRealtimePosts: () => ({ posts: [], loading: false }) }));
jest.mock('../../src/data/settingsOptions', () => ({ THEME_OPTIONS: [], SETTINGS_GROUPS: [], ACCOUNT_OPTIONS: [], INFO_OPTIONS: [] }));
jest.mock('../../src/data/onboarding', () => ({ ONBOARDING_STEPS: [] }));
jest.mock('../../src/services/mealAnalyzer', () => ({ analyzeMeal: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/services/gemini', () => ({ sendMessage: jest.fn().mockResolvedValue('') }));
jest.mock('../../src/services/analytics', () => ({ trackEvent: jest.fn() }));
jest.mock('../../src/services/voiceCoach', () => ({ setVoiceCoachEnabled: jest.fn() }));
jest.mock('../../src/hooks/usePaywallPayment', () => ({ usePaywallPayment: () => ({}) }));

import LandingScreen from '../../app/landing';
import AiIndexScreen from '../../app/ai/index';
import ChallengesIndexScreen from '../../app/challenges/index';
import GoalsIndexScreen from '../../app/goals/index';
import AccessibilityScreen from '../../app/settings/accessibility';

describe('Screens - Round 13', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('LandingScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<LandingScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('AiIndexScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<AiIndexScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('ChallengesIndexScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ChallengesIndexScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('GoalsIndexScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<GoalsIndexScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('AccessibilityScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<AccessibilityScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
