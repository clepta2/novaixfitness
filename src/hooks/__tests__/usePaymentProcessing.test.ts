// src/hooks/__tests__/usePaymentProcessing.test.js
// Testes unitários para o hook de processamento de pagamento - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import usePaymentProcessing from '../usePaymentProcessing';

// Mock do AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    signOut: jest.fn(),
  }),
}));

// Mock do Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock dos serviços de pagamento
jest.mock('../../services/payment', () => ({
  PLANS: {
    basic: { id: 'basic', name: 'Básico', price: 49.90, priceText: 'R$ 49,90' },
    intermediate: { id: 'intermediate', name: 'Intermediário', price: 79.90, priceText: 'R$ 79,90' },
    premium: { id: 'premium', name: 'Premium', price: 119.90, priceText: 'R$ 119,90' },
  },
  createCheckout: jest.fn(),
  getPaymentStatus: jest.fn(),
}));

describe('usePaymentProcessing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default plan', () => {
    const { result } = renderHook(() => usePaymentProcessing());

    expect(result.current.selected).toBe('intermediate');
    expect(result.current.processing).toBe(false);
    expect(result.current.processStep).toBe('');
  });

  it('should select a plan', () => {
    const { result } = renderHook(() => usePaymentProcessing());

    act(() => {
      result.current.setSelected('premium');
    });

    expect(result.current.selected).toBe('premium');
  });

  it('should set coupon', () => {
    const { result } = renderHook(() => usePaymentProcessing());

    act(() => {
      result.current.setCoupon('DISCOUNT20');
    });

    expect(result.current.coupon).toBe('DISCOUNT20');
  });

  it('should return correct button title', () => {
    const { result } = renderHook(() => usePaymentProcessing());

    const title = result.current.getButtonTitle();
    expect(title).toContain('LIBERAR MEU CRONOGRAMA');
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => usePaymentProcessing());

    await act(async () => {
      await result.current.handleLogout();
    });

    // Logout should be called
  });

  it('should handle skip', () => {
    const { result } = renderHook(() => usePaymentProcessing());

    act(() => {
      result.current.handleSkip();
    });

    // Skip should navigate away
  });
});
