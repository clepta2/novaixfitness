// src/hooks/__tests__/useLogin.test.js
// Testes unitários para o hook de login - NOVAIX FITNESS

import { renderHook, act } from '@testing-library/react-hooks';
import useLogin from '../useLogin';

// Mock do AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signInWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithApple: jest.fn(),
  }),
}));

// Mock do Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock do LocalAuthentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should set email', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('should set password', () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setPassword('password123');
    });

    expect(result.current.password).toBe('password123');
  });

  it('should show error for empty email', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Insira seu E-mail ou CPF');
  });

  it('should show error for short password', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('123');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Mínimo 6 caracteres');
  });

  it('should show error for invalid email format', async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('invalid-email');
      result.current.setPassword('password123');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.error).toBe('Formato de E-mail ou CPF inválido');
  });
});
