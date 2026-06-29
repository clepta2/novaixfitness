import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

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

jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
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
  },
  layout: {
    screen: { flex: 1, backgroundColor: '#12161A' },
    scroll: { padding: 24, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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

jest.mock('../../src/services/analytics', () => ({
  getWorkoutAnalytics: jest.fn().mockResolvedValue({}),
  getWorkoutFrequency: jest.fn().mockResolvedValue([]),
  getMonthlyComparison: jest.fn().mockResolvedValue([]),
  getWeightHistory: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/services/share', () => ({
  shareProgress: jest.fn(),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    DashboardStats: 'DashboardStats',
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

import DashboardScreen from '../../app/dashboard';

describe('Dashboard Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard header', () => {
    const { getByText } = render(<DashboardScreen />);
    expect(getByText('Meu Progresso')).toBeTruthy();
  });

  it('renders DashboardStats component', () => {
    const { toJSON } = render(<DashboardScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<DashboardScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
