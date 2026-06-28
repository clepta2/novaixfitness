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
  useLocalSearchParams: () => ({}),
}));

jest.mock('react-native-chart-kit', () => {
  const React = require('react');
  return {
    BarChart: (props) => React.createElement('BarChart', props),
  };
});

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
    h4: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 12 },
    buttonSmall: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10 },
    statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
    statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11 },
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
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

const mockChain = {
  select: jest.fn(() => mockChain),
  eq: jest.fn(() => mockChain),
  order: jest.fn(() => mockChain),
  limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
  gte: jest.fn(() => mockChain),
  lte: jest.fn(() => mockChain),
  single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  update: jest.fn(() => mockChain),
  delete: jest.fn(() => mockChain),
};

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockChain),
  },
}));

jest.mock('../../src/data/filters', () => ({
  HISTORY_FILTERS: [
    { key: 'all', label: 'Todos' },
    { key: 'completed', label: 'Concluidos' },
    { key: 'pending', label: 'Pendentes' },
  ],
  DAY_NAMES: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  DAY_FULL: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    HistoryCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'HistoryCard')),
    FilterBar: (props) => React.createElement(View, null, React.createElement(Text, null, 'FilterBar')),
    WeekSummary: (props) => React.createElement(View, null, React.createElement(Text, null, 'WeekSummary')),
    DayGrid: (props) => React.createElement(View, null, React.createElement(Text, null, 'DayGrid')),
    CategoryBars: (props) => React.createElement(View, null, React.createElement(Text, null, 'CategoryBars')),
    DayDetails: (props) => React.createElement(View, null, React.createElement(Text, null, 'DayDetails')),
    GlobalStats: (props) => React.createElement(View, null, React.createElement(Text, null, 'GlobalStats')),
    TutorialOverlay: (props) => React.createElement(View, null),
    getDateRange: (period) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start: start.toISOString(), end: end.toISOString() };
    },
    PERIOD_FILTERS: [
      { key: 'week', label: '7 dias', days: 7 },
      { key: 'month', label: '1 mes', days: 30 },
    ],
  };
});

jest.mock('../../src/components/notifications/NotificationItem', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, props.item?.title || 'Notification'));
});

jest.mock('../../src/components/workout/HistoryCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'HistoryCard'));
});

jest.mock('../../src/constants/gamification', () => ({
  ACHIEVEMENTS: [],
}));

jest.mock('../../src/hooks/useTutorial', () => ({
  useTutorial: () => ({ showTutorial: false, completeTutorial: jest.fn(), shouldShowTutorial: false }),
}));

import NotificationsScreen from '../../app/notifications';
import HistoryScreen from '../../app/(tabs)/perfil/history';
import WeeklyProgressScreen from '../../app/weekly-progress';

describe('Screens - Round 4', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChain.limit.mockResolvedValue({ data: [], error: null });
    mockChain.single.mockResolvedValue({ data: null, error: null });
  });

  describe('NotificationsScreen', () => {
    it('renders and shows empty state', () => {
      const { getByText } = render(<NotificationsScreen />);
      expect(getByText('Notificacoes')).toBeTruthy();
    });
  });

  describe('HistoryScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<HistoryScreen />);
      expect(getByText('Histórico')).toBeTruthy();
    });
  });

  describe('WeeklyProgressScreen', () => {
    it('renders components', () => {
      const { getByText } = render(<WeeklyProgressScreen />);
      expect(getByText('FilterBar')).toBeTruthy();
    });
  });
});
