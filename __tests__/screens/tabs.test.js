import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

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

jest.mock('../../src/i18n', () => ({
  useI18n: () => ({
    locale: 'pt',
    t: (key, opts) => {
      const map = {
        'home.welcome': 'BEM-VINDO,',
        'home.greeting': 'BOM-DIA, ATLETA',
        'home.categories': 'CATEGORIAS DE TREINO',
        'home.afternoon': 'BOM-DIA, ATLETA',
        'home.evening': 'BOA NOITE, ATLETA',
        'home.morning': 'BOM-DIA, ATLETA',
        'library.title': 'Biblioteca',
        'library.focus': 'Foco: ' + (opts?.level || 'Iniciante'),
        'library.search': 'Buscar treino, exercício ou grupo...',
        'library.exploreAll': 'Explorar tudo',
        'library.offlineMode': 'Modo offline',
        'subscription.features.premium': 'Premium',
        'subscription.upgrade': 'Faça upgrade',
        'subscription.plans': 'Planos',
        'common.cancel': 'Cancelar',
      };
      return map[key] || key;
    },
    changeLocale: jest.fn(),
  }),
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com', user_metadata: { name: 'Atleta' } },
  }),
}));

jest.mock('../../src/config/supabase', () => {
  let callCount = 0;
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    single: jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ data: { subscription_status: 'active', onboarding: { level: 'beginner' }, streak: 5 }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
  return {
    supabase: {
      from: jest.fn(() => {
        callCount = 0;
        return chain;
      }),
    },
  };
});

jest.mock('../../src/services/checkIn', () => ({
  __esModule: true,
  default: () => 0,
  performCheckIn: jest.fn().mockResolvedValue(null),
  getTodayCheckIn: jest.fn().mockResolvedValue(null),
  getCheckInStreak: jest.fn().mockResolvedValue(0),
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
  calculateLevel: jest.fn().mockReturnValue({ level: 1, name: 'Iniciante', color: '#00E676', icon: 'leaf' }),
}));

jest.mock('../../src/hooks/useNetworkStatus', () => {
  const hook = () => ({ isConnected: true, isInternetReachable: true, isOnline: true, isOffline: false, wasOffline: false });
  return { __esModule: true, default: hook, useNetworkStatus: hook };
});

jest.mock('../../src/services/offlineSync', () => ({
  syncPendingActions: jest.fn().mockResolvedValue({ synced: 0 }),
  hasPendingActions: jest.fn().mockResolvedValue(false),
}));

jest.mock('../../src/services/offline', () => ({
  isWorkoutCached: jest.fn().mockResolvedValue(false),
  getPendingActions: jest.fn().mockResolvedValue([]),
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

jest.mock('../../src/i18n', () => ({
  __esModule: true,
  default: { t: (key) => key },
  useI18n: () => ({ t: (key, opts) => {
    const map = {
      'library.title': 'Biblioteca',
      'library.focus': 'Foco: ' + (opts?.level || ''),
      'library.search': 'Buscar treino, exercício ou grupo...',
    };
    return map[key] || key;
  }}),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name), props.children);
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
    HomeHeader: (props) => React.createElement(View, null, React.createElement(Text, null, 'BEM-VINDO,'), React.createElement(Text, null, 'BOM-DIA, ' + (props.userName || 'ATLETA'))),
    CategoryGrid: (props) => React.createElement(View, null, React.createElement(Text, null, 'CATEGORIAS DE TREINO')),
    HomeSkeleton: (props) => React.createElement(View, null, React.createElement(Text, null, 'HomeSkeleton')),
    CommonOfflineBanner: (props) => React.createElement(View, null),
    DailyCheckIn: (props) => React.createElement(View, null),
    BodySummary: (props) => React.createElement(View, null),
    SearchBar: (props) => React.createElement(TextInput, { placeholder: props.placeholder }),
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

describe('Tab Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomeScreen', () => {
    it('renders welcome message', async () => {
      const { getByText } = render(<HomeScreen />);
      await waitFor(() => {
        expect(getByText('BEM-VINDO,')).toBeTruthy();
      });
    });

    it('renders contextual card', async () => {
      const { getByText } = render(<HomeScreen />);
      await waitFor(() => {
        expect(getByText(/BOM-DIA/)).toBeTruthy();
      });
    });

    it('renders categories section', async () => {
      const { getByText } = render(<HomeScreen />);
      await waitFor(() => {
        expect(getByText('CATEGORIAS DE TREINO')).toBeTruthy();
      });
    });
  });

  describe('LibraryScreen', () => {
    it('renders header', async () => {
      const { getByText } = render(<LibraryScreen />);
      await waitFor(() => {
        expect(getByText('Biblioteca')).toBeTruthy();
      });
    });

    it('renders search placeholder', async () => {
      const { getByPlaceholderText } = render(<LibraryScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('Buscar treino, exercício ou grupo...')).toBeTruthy();
      });
    });
  });
});
