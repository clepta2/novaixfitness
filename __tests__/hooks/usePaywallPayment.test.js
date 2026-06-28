import { renderHook, act } from '@testing-library/react-hooks';
import usePaywallPayment from '../../src/hooks/usePaywallPayment';
import { createCheckout, getPaymentStatus } from '../../src/services/payment';
import { getVariant, trackPaywallView, trackPaywallClick } from '../../src/services/abtest';

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../../src/services/payment');
jest.mock('../../src/services/abtest');
jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  Linking: { openURL: jest.fn() },
}));

describe('usePaywallPayment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getVariant.mockResolvedValue('control');
  });

  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    expect(result.current.loading).toBe(false);
    expect(result.current.pixData).toBeNull();
    expect(result.current.variant).toBe('control');
  });

  it('deve retornar funções', () => {
    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    expect(typeof result.current.handleSubscribe).toBe('function');
    expect(typeof result.current.loadVariant).toBe('function');
  });

  it('deve carregar variante', async () => {
    getVariant.mockResolvedValue('variant_a');
    trackPaywallView.mockResolvedValue();
    
    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    
    await act(async () => {
      await result.current.loadVariant();
    });

    expect(result.current.variant).toBe('variant_a');
    expect(getVariant).toHaveBeenCalledWith('user-123', 'paywall');
    expect(trackPaywallView).toHaveBeenCalledWith('user-123');
  });

  it('deve retornar erro quando não há user', async () => {
    const { Alert } = require('react-native');
    const { result } = renderHook(() => usePaywallPayment(null));
    
    await act(async () => {
      await result.current.handleSubscribe({ id: 'plan-1' }, 'PIX');
    });

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Faça login para assinar.');
    expect(result.current.loading).toBe(false);
  });

  it('deve processar pagamento PIX', async () => {
    createCheckout.mockResolvedValue({
      pixQrCode: { payload: 'pix-qr', encodedImage: 'base64', expirationDate: '2024-12-31' },
      paymentId: 'pay-123',
    });
    trackPaywallClick.mockResolvedValue();

    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    
    await act(async () => {
      await result.current.handleSubscribe({ id: 'plan-1' }, 'PIX');
    });

    expect(result.current.pixData).toBeDefined();
    expect(result.current.pixData.paymentId).toBe('pay-123');
    expect(trackPaywallClick).toHaveBeenCalled();
  });

  it('deve processar pagamento CREDIT_CARD', async () => {
    createCheckout.mockResolvedValue({ paymentId: 'pay-456' });
    trackPaywallClick.mockResolvedValue();

    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    
    await act(async () => {
      await result.current.handleSubscribe({ id: 'plan-1' }, 'CREDIT_CARD');
    });

    expect(createCheckout).toHaveBeenCalled();
    expect(trackPaywallClick).toHaveBeenCalled();
  });

  it('deve tratar erro no pagamento', async () => {
    const { Alert } = require('react-native');
    createCheckout.mockRejectedValue(new Error('Payment failed'));

    const { result } = renderHook(() => usePaywallPayment({ id: 'user-123' }));
    
    await act(async () => {
      await result.current.handleSubscribe({ id: 'plan-1' }, 'PIX');
    });

    expect(Alert.alert).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
