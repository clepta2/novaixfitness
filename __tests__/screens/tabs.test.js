import React from 'react';
import { render } from '@testing-library/react-native';

import HomeScreen from '../../app/(tabs)/home';
import LibraryScreen from '../../app/(tabs)/library';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
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
  useLocalSearchParams: () => ({}),
}));

jest.mock('../../src/utils/responsive', () => ({
  scale: (n) => n,
}));

jest.mock('../../src/utils/animations', () => ({
  useStaggeredEntry: () => ({
    opacity: { setValue: jest.fn(), interpolate: jest.fn() },
    translateY: { setValue: jest.fn(), interpolate: jest.fn() },
  }),
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
    inputField: { fontFamily: 'Inter_400Regular', fontSize: 14 },
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerBtn: { width: 40, height: 40 },
    section: { marginBottom: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com', user_metadata: { name: 'Atleta' } },
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

jest.mock('../../src/services/tutorial', () => ({
  hasCompletedTutorial: jest.fn().mockResolvedValue(true),
  completeTutorial: jest.fn(),
  markTutorialSkipped: jest.fn(),
  getTutorialSteps: jest.fn().mockReturnValue([]),
}));

jest.mock('../../src/hooks/useTutorial', () => ({
  useTutorial: () => ({
    visible: false,
    steps: [],
    handleComplete: jest.fn(),
    handleSkip: jest.fn(),
  }),
}));

jest.mock('../../src/services/gamification', () => ({
  getGamificationData: jest.fn().mockResolvedValue({ totalXP: 100, levelData: { level: 1, name: 'Iniciante', color: '#00E676', icon: 'leaf' } }),
}));

jest.mock('../../src/hooks/useNetworkStatus', () => {
  const hook = () => ({ isConnected: true, isInternetReachable: true, isOnline: true, isOffline: false, wasOffline: false });
  return { __esModule: true, default: hook, useNetworkStatus: hook };
});

jest.mock('../../src/services/sync', () => ({
  syncPendingActions: jest.fn().mockResolvedValue({ synced: 0 }),
  getPendingActionsCount: jest.fn().mockResolvedValue(0),
}));

jest.mock('../../src/services/offline', () => ({
  isWorkoutCached: jest.fn().mockResolvedValue(false),
}));

jest.mock('../../src/hooks', () => ({
  useSupabaseData: () => ({ data: [], refetch: jest.fn() }),
  useLibraryData: () => ({
    router: { push: jest.fn() },
    selectedCategory: null, setSelectedCategory: jest.fn(),
    searchQuery: '', setSearchQuery: jest.fn(),
    favorites: [], toggleFavorite: jest.fn(),
    filterByMyLevel: true, setFilterByMyLevel: jest.fn(),
    levelFilter: null, setLevelFilter: jest.fn(),
    durationFilter: null, setDurationFilter: jest.fn(),
    accessFilter: null, setAccessFilter: jest.fn(),
    equipmentFilter: null, setEquipmentFilter: jest.fn(),
    muscleFilter: null, setMuscleFilter: jest.fn(),
    showFilters: false, setShowFilters: jest.fn(),
    cachedIds: new Set(),
    filteredWorkouts: [], popularWorkouts: [], recentWorkouts: [],
    activeFiltersCount: 0, activePills: [],
    removePill: jest.fn(), clearAll: jest.fn(),
    userPhysicalLevel: 'Iniciante', dbWorkouts: [],
  }),
}));

jest.mock('../../src/data/categories', () => ({
  HOME_CATEGORIES: [
    { key: 'musculacao', label: 'Musculacao', icon: 'barbell', color: '#CCFF00', count: 10 },
  ],
}));

jest.mock('../../src/styles/homeStyles', () => ({
  styles: {},
}));

jest.mock('../../src/styles/libraryStyles', () => ({
  styles: {},
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    DailyWorkoutCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'DailyWorkoutCard')),
    OfflineBanner: (props) => React.createElement(View, null),
    TutorialOverlay: (props) => React.createElement(View, null),
    WorkoutCard: (props) => React.createElement(View, null, React.createElement(Text, null, props.workout?.name || 'WorkoutCard')),
    FavoriteWorkoutCard: (props) => React.createElement(View, null),
    FilterModal: (props) => React.createElement(View, null),
    TagFilter: (props) => React.createElement(View, null),
    ErrorBoundary: (props) => React.createElement(View, null, props.children),
    ContextualCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'ContextualCard')),
    RecentActivity: (props) => React.createElement(View, null, React.createElement(Text, null, 'RecentActivity')),
    OfflineIndicator: (props) => React.createElement(View, null),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

describe('Tab Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    it('renders welcome message', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('BEM-VINDO,')).toBeTruthy();
    });

    it('renders contextual card', () => {
      const { getByText } = render(<HomeScreen />);
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) expect(getByText('BOM-DIA, ATLETA')).toBeTruthy();
      else if (hour >= 12 && hour < 19) expect(getByText('HORA DO TREINO')).toBeTruthy();
      else expect(getByText('NOITE DE RECUPERAÇÃO')).toBeTruthy();
    });

    it('renders categories section', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('CATEGORIAS DE TREINO')).toBeTruthy();
    });
  });

  describe('LibraryScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<LibraryScreen />);
      expect(getByText('Biblioteca')).toBeTruthy();
    });

    it('renders search placeholder', () => {
      const { getByText } = render(<LibraryScreen />);
      expect(getByText('Foco: Iniciante')).toBeTruthy();
    });
  });
});
