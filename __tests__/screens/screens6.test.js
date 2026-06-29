import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

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
    signOut: jest.fn(),
  }),
}));

const mockChain = {
  select: jest.fn(() => mockChain),
  eq: jest.fn(() => mockChain),
  order: jest.fn(() => mockChain),
  limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
  gte: jest.fn(() => mockChain),
  single: jest.fn(() => Promise.resolve({ data: { subscription_status: 'free', onboarding: { level: 'intermediate' } }, error: null })),
  update: jest.fn(() => mockChain),
  delete: jest.fn(() => mockChain),
};

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockChain),
  },
}));

jest.mock('../../src/services/payment', () => ({
  getCurrentSubscription: jest.fn().mockResolvedValue(null),
  cancelSubscription: jest.fn().mockResolvedValue({}),
  getPaymentHistory: jest.fn().mockResolvedValue([]),
  PLANS: {
    basic: { id: 'basic', name: 'Basico', price: 49.90 },
    premium: { id: 'premium', name: 'Premium', price: 99.90 },
  },
}));

jest.mock('../../src/services/totp', () => ({
  is2FAEnabled: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../src/data/dailyWorkouts', () => ({
  dailyWorkouts: [{ id: '1', name: 'Treino A', category: 'Musculacao' }],
  activeWorkout: { id: '1', name: 'Treino A' },
}));

jest.mock('../../src/data/subscriptionData', () => ({
  STATUS_MAP: { active: { label: 'Ativo', color: '#00E676' } },
  INFO_ITEMS: [{ label: 'Teste', value: '123' }],
}));

jest.mock('../../src/styles/subscriptionStyles', () => ({
  styles: {},
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stub = (name) => (props) => React.createElement(View, null, React.createElement(Text, null, name));
  const base = {
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    WorkoutListView: (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutListView')),
    StudentCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'StudentCard')),
    FinanceStats: (props) => React.createElement(View, null, React.createElement(Text, null, 'FinanceStats')),
    TwoFactorSetup: (props) => React.createElement(View, null, React.createElement(Text, null, 'TwoFactorSetup')),
    TwoFactorPrompt: (props) => {
      React.useEffect(() => {
        if (props.onVerified) props.onVerified();
      }, []);
      return React.createElement(View, null, React.createElement(Text, null, 'TwoFactorPrompt'));
    },
  };
  return new Proxy(base, { get: (target, key) => target[key] || Stub(key) });
});

jest.mock('../../src/components/admin/AdminDashboard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'AdminDashboard'));
});

jest.mock('../../src/components/admin/WorkoutManager', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'WorkoutManager'));
});

jest.mock('../../src/components/admin/ExerciseManager', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'ExerciseManager'));
});

jest.mock('../../src/components/admin/StudentEditModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null);
});

jest.mock('../../src/components/admin/CampaignManager', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'CampaignManager'));
});

jest.mock('../../src/components/admin/StudentExporter', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => React.createElement(View, null, React.createElement(Text, null, 'StudentExporter'));
});

import PlayerListScreen from '../../app/player-list';
import SubscriptionScreen from '../../app/subscription';
import AdminScreen from '../../app/admin';

describe('Screens - Round 6', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChain.single.mockResolvedValue({ data: { subscription_status: 'free', onboarding: { level: 'intermediate' } }, error: null });
    mockChain.limit.mockResolvedValue({ data: [], error: null });
  });

  describe('PlayerListScreen', () => {
    it('renders WorkoutListView', async () => {
      const { getByText } = render(<PlayerListScreen />);
      await waitFor(() => {
        expect(getByText('WorkoutListView')).toBeTruthy();
      });
    });
  });

  describe('SubscriptionScreen', () => {
    it('renders without crashing', () => {
      const { toJSON } = render(<SubscriptionScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('AdminScreen', () => {
    it('renders admin tabs', async () => {
      const { getByText } = render(<AdminScreen />);
      await waitFor(() => {
        expect(getByText('AdminDashboard')).toBeTruthy();
      });
    });
  });
});
