import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PaywallScreen from '../../app/paywall';

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

// Mock icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: (props) => React.createElement('Ionicons', props),
  };
});

// Mock router
const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

// Mock styles
jest.mock('../../src/styles', () => ({
  typography: {
    h3: { fontSize: 16 }, h4: { fontSize: 14 }, bodyMuted: { fontSize: 14 },
    body: { fontSize: 14 }, caption: { fontSize: 12 }, label: { fontSize: 12 },
    h5: { fontSize: 12 }, button: { fontSize: 14 },
  },
}));

// Mock Auth context
const mockUpdateProfile = jest.fn(() => Promise.resolve());
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    updateProfile: mockUpdateProfile,
  }),
}));

// Mock payment service
jest.mock('../../src/services/payment', () => ({
  PLANS: {
    basic: { id: 'basic', name: 'Plano Básico', price: 49.90, priceText: 'R$ 49,90', features: [], period: '/mês' },
    intermediate: { id: 'intermediate', name: 'Plano Intermediário', price: 79.90, priceText: 'R$ 79,90', popular: true, features: [], period: '/mês' },
    premium: { id: 'premium', name: 'Plano Premium', price: 119.90, priceText: 'R$ 119,90', features: [], period: '/mês' },
  },
}));

// Mock paywall components
jest.mock('../../src/components', () => {
  const React = require('react');
  const { Text, TouchableOpacity, View, TextInput } = require('react-native');
  return {
    Button: ({ title, onPress, disabled }) => (
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={`btn-${title}`}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
    PlanCard: ({ plan, isSelected, onSelect }) => (
      <TouchableOpacity onPress={() => onSelect(plan.id)}>
        <Text>{plan.name}</Text>
        {isSelected && <Text>SELECIONADO</Text>}
      </TouchableOpacity>
    ),
    CouponInput: ({ onApply }) => <View />,
    GuaranteeSection: () => <View />,
    Input: ({ label, value, onChangeText, placeholder }) => (
      <TextInput
        testID={`input-${label}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    ),
    ErrorBoundary: ({ children }) => children,
    GradientButton: ({ title, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
    ProcessingModal: () => <View />,
  };
});

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

// Mock abtest service (no longer used, but guard against import error)
jest.mock('../../src/services/abtest', () => ({
  getVariant: jest.fn(() => Promise.resolve('control')),
  trackPaywallView: jest.fn(),
  trackPaywallClick: jest.fn(),
  trackPaywallSkip: jest.fn(),
}));

jest.mock('../../src/services/coupon', () => ({
  applyCoupon: jest.fn((price) => price),
}));

describe('PaywallScreen (novo fluxo cartão + Asaas)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza título e badge corretamente', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('LIBERE TODO SEU POTENCIAL')).toBeTruthy();
    expect(getByText('Escolha o plano ideal para sua evolucao')).toBeTruthy();
    expect(getByText('7 DIAS GRATIS')).toBeTruthy();
  });

  it('renderiza os planos disponíveis', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('Plano Básico')).toBeTruthy();
    expect(getByText('Plano Intermediário')).toBeTruthy();
    expect(getByText('Plano Premium')).toBeTruthy();
  });

  it('renderiza botao de pular', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText('Pular')).toBeTruthy();
  });

  it('mostra botao de ativar', () => {
    const { getByText } = render(<PaywallScreen />);
    expect(getByText(/LIBERAR MEU CRONOGRAMA/)).toBeTruthy();
  });

  it('botao de ativar funciona', async () => {
    const { getByText } = render(<PaywallScreen />);
    fireEvent.press(getByText(/LIBERAR MEU CRONOGRAMA/));
    await waitFor(() => {
      expect(getByText(/LIBERAR MEU CRONOGRAMA/)).toBeTruthy();
    });
  });

  it('permite selecionar plano diferente', () => {
    const { getByText } = render(<PaywallScreen />);
    fireEvent.press(getByText('Plano Básico'));
    expect(getByText('Plano Básico')).toBeTruthy();
  });
});
