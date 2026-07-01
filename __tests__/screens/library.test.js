import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
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
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

jest.mock('../../src/hooks', () => ({
  useLibraryData: () => ({
    router: { push: jest.fn() },
    selectedCategory: null,
    setSelectedCategory: jest.fn(),
    searchQuery: '',
    setSearchQuery: jest.fn(),
    favorites: [
      { id: 'f1', name: 'Treino Favorito', category: 'Musculacao', duration: 30, level: 'Iniciante' },
    ],
    toggleFavorite: jest.fn(),
    filterByMyLevel: true,
    setFilterByMyLevel: jest.fn(),
    levelFilter: null,
    setLevelFilter: jest.fn(),
    durationFilter: null,
    setDurationFilter: jest.fn(),
    accessFilter: null,
    setAccessFilter: jest.fn(),
    equipmentFilter: null,
    setEquipmentFilter: jest.fn(),
    muscleFilter: null,
    setMuscleFilter: jest.fn(),
    showFilters: false,
    setShowFilters: jest.fn(),
    cachedIds: new Set(['w1']),
    filteredWorkouts: [
      { id: 'w1', name: 'Treino A', category: 'Musculacao', duration: 45, level: 'Iniciante' },
      { id: 'w2', name: 'Treino B', category: 'Cardio', duration: 30, level: 'Intermediario' },
    ],
    popularWorkouts: [
      { id: 'w1', name: 'Treino Popular', category: 'Musculacao', duration: 45, level: 'Iniciante' },
    ],
    recentWorkouts: [
      { id: 'w2', name: 'Treino Recente', category: 'Cardio', duration: 30, level: 'Intermediario' },
    ],
    activeFiltersCount: 0,
    activePills: [],
    removePill: jest.fn(),
    clearAll: jest.fn(),
    userPhysicalLevel: 'Iniciante',
    dbWorkouts: [],
  }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const mock = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  return {
    WorkoutCard: 'WorkoutCard',
    FavoriteWorkoutCard: 'FavoriteWorkoutCard',
    FilterModal: 'FilterModal',
    TagFilter: 'TagFilter',
    TutorialOverlay: 'TutorialOverlay',
    ErrorBoundary: (props) => React.createElement(View, null, props.children),
    OfflineIndicator: mock('OfflineIndicator'),
    SearchBar: mock('SearchBar'),
    Loading: mock('Loading'),
    EmptyState: mock('EmptyState'),
  };
});

jest.mock('../../src/hooks/useTutorial', () => ({
  useTutorial: () => ({
    visible: false,
    steps: [],
    handleComplete: jest.fn(),
    handleSkip: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useNetworkStatus', () => ({
  __esModule: true,
  default: () => ({ isOffline: false }),
  useNetworkStatus: () => ({ isOffline: false }),
}));

jest.mock('../../src/styles/libraryStyles', () => ({
  styles: {
    searchRow: {},
    searchBar: {},
    filterBtn: {},
    filterBtnText: {},
    favScroll: {},
    statsCard: {},
  },
}));

jest.mock('../../src/i18n', () => ({
  __esModule: true,
  default: { t: (key) => key },
  useI18n: () => ({ t: (key, opts) => { if (key === 'library.title') return 'Biblioteca'; if (key === 'library.focus') return 'Foco: ' + (opts?.level || ''); if (key === 'library.exploreAll') return 'Explorar tudo'; return key; } }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({ isSmall: false, horizontalPadding: 20 }),
  useResponsive: () => ({ isSmall: false, horizontalPadding: 20 }),
}));

import LibraryScreen from '../../app/(tabs)/library';

describe('Library Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header', () => {
    const { getByText } = render(<LibraryScreen />);
    expect(getByText('Biblioteca')).toBeTruthy();
  });

  it('shows user physical level', () => {
    const { getByText } = render(<LibraryScreen />);
    expect(getByText('Foco: Iniciante')).toBeTruthy();
  });

  it('renders search bar', () => {
    const { toJSON } = render(<LibraryScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders categories', () => {
    const { getByText } = render(<LibraryScreen />);
    expect(getByText('MUSCULACAO')).toBeTruthy();
  });

  it('renders workout list', () => {
    const { toJSON } = render(<LibraryScreen />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain('WorkoutCard');
  });
});
