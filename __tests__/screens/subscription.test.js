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

jest.mock('../../src/services/payment', () => ({
  getCurrentSubscription: jest.fn().mockResolvedValue(null),
  cancelSubscription: jest.fn().mockResolvedValue({}),
  getPaymentHistory: jest.fn().mockResolvedValue([]),
  PLANS: {
    basic: { id: 'basic', name: 'Basico', price: 49.90, priceText: 'R$ 49,90', period: '/mes' },
    intermediate: { id: 'intermediate', name: 'Intermediario', price: 79.90, priceText: 'R$ 79,90', period: '/mes' },
    premium: { id: 'premium', name: 'Premium', price: 119.90, priceText: 'R$ 119,90', period: '/mes' },
  },
}));

jest.mock('../../src/data/subscriptionData', () => ({
  STATUS_MAP: {
    active: { label: 'Ativo', color: '#00E676', icon: 'checkmark-circle' },
    free: { label: 'Gratuito', color: '#94A3B8', icon: 'person' },
  },
  INFO_ITEMS: [],
}));

jest.mock('../../src/styles/subscriptionStyles', () => ({
  styles: {
    statusCard: {},
    statusInfo: {},
    planCard: {},
  },
}));

jest.mock('../../src/components', () => ({
  Button: 'Button',
}));

import SubscriptionScreen from '../../app/subscription';

describe('Subscription Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { toJSON } = render(<SubscriptionScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders subscription screen', () => {
    const { toJSON } = render(<SubscriptionScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
