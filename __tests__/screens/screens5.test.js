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
    LineChart: (props) => React.createElement('LineChart', props),
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
  single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  update: jest.fn(() => mockChain),
  delete: jest.fn(() => mockChain),
};

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockChain),
  },
}));

jest.mock('../../src/hooks/useMountedRef', () => ({
  __esModule: true,
  useMountedRef: () => ({ current: true }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({ isSmall: false, horizontalPadding: 20 }),
  useResponsive: () => ({ isSmall: false, horizontalPadding: 20 }),
}));

jest.mock('../../src/services/analytics', () => ({
  getWorkoutAnalytics: jest.fn().mockResolvedValue({}),
  getWorkoutFrequency: jest.fn().mockResolvedValue([]),
  getMonthlyComparison: jest.fn().mockResolvedValue([]),
  getWeightHistory: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/gemini', () => ({
  askGeminiCoach: jest.fn().mockResolvedValue('Resposta do coach'),
  saveChatMessage: jest.fn().mockResolvedValue({}),
  getChatHistory: jest.fn().mockResolvedValue([]),
  clearChatHistory: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/services/share', () => ({
  shareProgress: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name), props.children);
  const base = {
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    FilterBar: (props) => React.createElement(View, null, React.createElement(Text, null, 'FilterBar')),
    DashboardStats: (props) => React.createElement(View, null, React.createElement(Text, null, 'DashboardStats')),
    MuscleRadarChart: (props) => null,
    WeeklySummary: (props) => null,
    QuickAccessGrid: (props) => null,
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
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/components/analytics/ComparisonCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'ComparisonCard'));
});

jest.mock('../../src/components/analytics/StatsGrid', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'StatsGrid'));
});

jest.mock('../../src/components/analytics/InsightsRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'InsightsRow'));
});

jest.mock('../../src/components/analytics/ChartsSection', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    FrequencyChart: () => React.createElement(View, null, React.createElement(Text, null, 'FrequencyChart')),
    CategoryChart: () => React.createElement(View, null, React.createElement(Text, null, 'CategoryChart')),
    DayOfWeekChart: () => React.createElement(View, null, React.createElement(Text, null, 'DayOfWeekChart')),
    MonthlyChart: () => React.createElement(View, null, React.createElement(Text, null, 'MonthlyChart')),
    HourChart: () => React.createElement(View, null, React.createElement(Text, null, 'HourChart')),
  };
});

jest.mock('../../src/components/analytics/DashboardStats', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'DashboardStats'));
});

jest.mock('../../src/components/chat/ChatHeader', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'ChatHeader'));
});

jest.mock('../../src/components/chat/MessageBubble', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, props.message?.text || 'Message'));
});

jest.mock('../../src/components/chat/ChatInput', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'ChatInput'));
});

jest.mock('../../src/components/chat/QuickTips', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'QuickTips'));
});

jest.mock('../../src/data/filters', () => ({
  DAY_NAMES: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  DAY_FULL: ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
}));

import AnalyticsScreen from '../../app/analytics';
import DashboardScreen from '../../app/dashboard';
import ChatCoachScreen from '../../app/chat-coach';

describe('Screens - Round 5', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChain.single.mockResolvedValue({ data: null, error: null });
    mockChain.limit.mockResolvedValue({ data: [], error: null });
  });

  describe('AnalyticsScreen', () => {
    it('renders components', () => {
      const { getByText } = render(<AnalyticsScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });

  describe('DashboardScreen', () => {
    it('renders components', () => {
      const { getByText } = render(<DashboardScreen />);
      expect(getByText('DashboardStats')).toBeTruthy();
    });
  });

  describe('ChatCoachScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<ChatCoachScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });
});
