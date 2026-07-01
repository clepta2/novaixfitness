// Hook de lógica do login - NOVAIX FITNESS

import { useState, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { BRAND_NAME } from '../constants/brand';

interface UseLoginReturn {
  router: ReturnType<typeof useRouter>;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  error: string;
  handleLogin: () => Promise<void>;
  handleGoogle: () => Promise<void>;
  handleApple: () => Promise<void>;
  handleBiometrics: () => Promise<void>;
}

export default function useLogin(): UseLoginReturn {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams<{ email?: string }>();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (paramEmail) setEmail(paramEmail);
  }, [paramEmail]);

  const showAlert = (title: string, msg: string): void => {
    if (Platform.OS === 'web') alert(`${title}: ${msg}`);
    else Alert.alert(title, msg);
  };

  const handleLogin = useCallback(async (): Promise<void> => {
    const inputVal = email.trim();
    if (!inputVal) return setError('Insira seu E-mail ou CPF');
    if (!password.trim() || password.length < 6) return setError('Mínimo 6 caracteres');

    setError('');
    setLoading(true);
    let resolvedEmail = inputVal;

    const cleanCpf = inputVal.replace(/\D/g, '');
    if (cleanCpf.length === 11 && /^\d+$/.test(cleanCpf)) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles').select('email').eq('cpf', cleanCpf).maybeSingle();
        if (error) { if (__DEV__) console.warn('Erro ao buscar CPF no login:', error); }
        if (profile?.email) {
          resolvedEmail = profile.email;
        } else {
          setLoading(false);
          return setError('Nenhuma conta encontrada com este CPF.');
        }
      } catch (err) {
        if (__DEV__) console.warn('Erro ao processar login por CPF:', err);
      }
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(inputVal)) {
        setLoading(false);
        return setError('Formato de E-mail ou CPF inválido');
      }
    }

    try {
      await signInWithEmail(resolvedEmail, password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao fazer login';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, signInWithEmail]);

  const handleGoogle = useCallback(async (): Promise<void> => {
    try { await signInWithGoogle(); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro';
      showAlert('Erro', msg);
    }
  }, [signInWithGoogle]);

  const handleApple = useCallback(async (): Promise<void> => {
    try { await signInWithApple(); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro';
      showAlert('Erro', msg);
    }
  }, [signInWithApple]);

  const handleBiometrics = useCallback(async (): Promise<void> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        return showAlert('Aviso', 'Autenticacao biometrica nao configurada no dispositivo.');
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Login Rapido - ${BRAND_NAME}`,
        fallbackLabel: 'Usar Senha',
      });
      if (result.success) router.replace('/(tabs)/home');
    } catch (_e) {
      showAlert('Erro', 'Falha na autenticacao biometrica.');
    }
  }, [router]);

  return {
    router, email, setEmail, password, setPassword, loading, error,
    handleLogin, handleGoogle, handleApple, handleBiometrics,
  };
}
