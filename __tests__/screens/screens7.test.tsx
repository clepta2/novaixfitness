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
    headerBtn: { width: 40, height: 40 },
    section: { marginBottom: 24 },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@test.com' },
  }),
}));

const mockSupabaseData = [];
jest.mock('../../src/hooks', () => ({
  useSupabaseData: () => ({
    data: mockSupabaseData,
    refetch: jest.fn(),
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

jest.mock('../../src/services/coupon', () => ({
  applyCoupon: jest.fn((price) => price),
}));

jest.mock('../../src/services/payment', () => ({
  createCheckout: jest.fn().mockResolvedValue({ payment: { id: 'p1' } }),
  PLANS: {
    basic: { id: 'basic', name: 'Basico', price: 49.90, features: [] },
    intermediate: { id: 'intermediate', name: 'Intermediario', price: 79.90, features: [] },
    premium: { id: 'premium', name: 'Premium', price: 119.90, features: [] },
  },
  getPaymentStatus: jest.fn().mockResolvedValue({ payment: { status: 'PENDING' } }),
}));

jest.mock('../../src/services/abtest', () => ({
  getVariant: jest.fn().mockResolvedValue('control'),
  trackPaywallView: jest.fn(),
  trackPaywallClick: jest.fn(),
  trackPaywallSkip: jest.fn(),
}));

jest.mock('../../src/hooks/usePaymentProcessing', () => ({
  __esModule: true,
  default: () => ({
    selected: 'intermediate', setSelected: jest.fn(),
    coupon: '', setCoupon: jest.fn(),
    processing: false, processStep: 0, paymentId: null, isWeb: false,
    handleLogout: jest.fn(), handleSkip: jest.fn(),
    getButtonTitle: () => 'LIBERAR MEU CRONOGRAMA',
    handleSubscribe: jest.fn(), cancelProcessing: jest.fn(),
  }),
}));

jest.mock('../../src/hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({ isSmall: false, horizontalPadding: 20 }),
  useResponsive: () => ({ isSmall: false, horizontalPadding: 20 }),
}));

jest.mock('../../src/components', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Header: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    Button: (props) => React.createElement(View, null, React.createElement(Text, null, props.title)),
    PlanCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'PlanCard')),
    CouponInput: (props) => React.createElement(View, null, React.createElement(Text, null, 'CouponInput')),
    PixPaymentScreen: (props) => React.createElement(View, null, React.createElement(Text, null, 'PixPaymentScreen')),
    BillingToggle: (props) => React.createElement(View, null, React.createElement(Text, null, 'BillingToggle')),
    VariantBView: (props) => React.createElement(View, null, React.createElement(Text, null, 'VariantBView')),
    GuaranteeSection: (props) => React.createElement(View, null, React.createElement(Text, null, 'GuaranteeSection')),
    DiscountBanner: (props) => React.createElement(View, null, React.createElement(Text, null, 'DiscountBanner')),
    GradientButton: (props) => React.createElement(View, null, React.createElement(Text, null, props.title || 'GradientButton')),
    ProcessingModal: (props) => React.createElement(View, null),
    FaqItem: (props) => React.createElement(View, null, React.createElement(Text, null, props.item?.question || 'FAQ')),
    ContactCard: (props) => React.createElement(View, null, React.createElement(Text, null, props.label || 'Contact')),
    PostCard: (props) => React.createElement(View, null, React.createElement(Text, null, 'PostCard')),
    CreatePostModal: (props) => React.createElement(View, null),
    NotificationModal: (props) => React.createElement(View, null),
    ErrorBoundary: ({ children }) => children,
  };
});

import PaywallScreen from '../../app/paywall';
import AjudaScreen from '../../app/(tabs)/ajuda';
import FeedScreen from '../../app/(tabs)/feed';

describe('Screens - Round 7', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PaywallScreen', () => {
    it('renders plan cards', () => {
      const { getAllByText } = render(<PaywallScreen />);
      expect(getAllByText('PlanCard').length).toBeGreaterThan(0);
    });
  });

  describe('AjudaScreen', () => {
    it('renders header', () => {
      const { getByText } = render(<AjudaScreen />);
      expect(getByText('AJUDA')).toBeTruthy();
    });

    it('renders FAQ items', () => {
      const { getByText } = render(<AjudaScreen />);
      expect(getByText('Como funciona o plano de treino?')).toBeTruthy();
    });

    it('renders contact cards', () => {
      const { getByText } = render(<AjudaScreen />);
      expect(getByText('WhatsApp')).toBeTruthy();
      expect(getByText('E-mail')).toBeTruthy();
    });
  });
});
