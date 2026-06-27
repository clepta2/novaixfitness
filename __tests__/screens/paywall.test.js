import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PaywallScreen from '../../app/paywall';
import { PLANS } from '../../src/services/payment';

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
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// Mock style & layout constants
jest.mock('../../src/styles', () => ({
  typography: {
    h3: { fontSize: 16 },
    h2: { fontSize: 20 },
    h5: { fontSize: 12 },
    bodyMuted: { fontSize: 14 },
    bodySmall: { fontSize: 12 },
    caption: { fontSize: 12 },
    button: { fontSize: 14 },
  },
  layout: {
    screen: { flex: 1 },
    scroll: { padding: 24, paddingTop: 60 },
    section: { marginBottom: 12 },
    footer: { padding: 12 },
  },
}));

// Mock Auth context
const mockUser = { id: 'test-user-id', email: 'test@example.com' };
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock AB test service
let mockVariant = 'control';
jest.mock('../../src/services/abtest', () => ({
  getVariant: jest.fn(() => Promise.resolve(mockVariant)),
  trackPaywallView: jest.fn(),
  trackPaywallClick: jest.fn(),
  trackPaywallSkip: jest.fn(),
}));

// Mock payments service
const mockCheckoutResult = {
  paymentId: 'pay-123',
  pixQrCode: {
    payload: 'pix-payload-123',
    encodedImage: 'base64-image-data',
    expirationDate: '2026-06-26T23:59:59Z',
  },
};
jest.mock('../../src/services/payment', () => ({
  PLANS: {
    basic: { id: 'basic', name: 'Plano Básico', price: 49.90, priceText: 'R$ 49,90', features: [] },
    intermediate: { id: 'intermediate', name: 'Plano Intermediário', price: 79.90, priceText: 'R$ 79,90', popular: true, features: [] },
    premium: { id: 'premium', name: 'Plano Premium', price: 119.90, priceText: 'R$ 119,90', features: [] },
  },
  createCheckout: jest.fn(() => Promise.resolve(mockCheckoutResult)),
  getPaymentStatus: jest.fn(() => Promise.resolve({ payment: { status: 'PENDING' } })),
}));

// Mock coupons service
jest.mock('../../src/services/coupon', () => ({
  applyCoupon: jest.fn((price, coupon) => {
    if (coupon?.valid) return price * 0.9; // 10% discount
    return price;
  }),
}));

describe('PaywallScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVariant = 'control';
  });

  it('renders control variant correctly', async () => {
    mockVariant = 'control';
    const { getByText, queryByText } = render(<PaywallScreen />);

    await waitFor(() => {
      expect(getByText('LIBERE TODO O POTENCIAL')).toBeTruthy();
      expect(getByText('Escolha o plano ideal para sua evolução')).toBeTruthy();
      expect(getByText('7 DIAS GRÁTIS')).toBeTruthy();
      expect(getByText('LIBERAR MEU CRONOGRAMA')).toBeTruthy();
    });

    // Variant B elements should NOT render
    expect(queryByText('EVOLUA RAPIDO')).toBeNull();
  });

  it('renders variant_b layout correctly', async () => {
    mockVariant = 'variant_b';
    const { getByText, queryByText } = render(<PaywallScreen />);

    await waitFor(() => {
      expect(getByText('EVOLUA RAPIDO')).toBeTruthy();
      expect(getByText('OFERTA POR TEMPO LIMITADO')).toBeTruthy();
      expect(getByText('COMEÇAR AGORA - 7 DIAS GRATIS')).toBeTruthy();
    });

    // Control elements should NOT render
    expect(queryByText('LIBERE TODO O POTENCIAL')).toBeNull();
  });

  it('allows selecting a plan and subscribing', async () => {
    mockVariant = 'control';
    const { getByText } = render(<PaywallScreen />);

    await waitFor(() => {
      expect(getByText('Plano Básico')).toBeTruthy();
    });

    // Select basic plan
    fireEvent.press(getByText('Plano Básico'));

    // Trigger subscribe
    fireEvent.press(getByText('LIBERAR MEU CRONOGRAMA'));

    const { createCheckout } = require('../../src/services/payment');
    await waitFor(() => {
      expect(createCheckout).toHaveBeenCalledWith('basic', 'PIX');
    });
  });

  it('skips paywall and redirects to home', async () => {
    mockVariant = 'control';
    const { getByText } = render(<PaywallScreen />);

    await waitFor(() => {
      expect(getByText('Pular por agora')).toBeTruthy();
    });

    fireEvent.press(getByText('Pular por agora'));

    const { trackPaywallSkip } = require('../../src/services/abtest');
    expect(trackPaywallSkip).toHaveBeenCalledWith('test-user-id');
    expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/home');
  });
});
