// src/hooks/useRateLimit.ts
// ============================================================
// HOOK: useRateLimit
// TIPO: Rate limiting client-side
// USO: Prevenir brute force em login, cadastro, envio de codigo
// REGRAS: Usar em todas as acoes com custo (login, pagamento, envio)
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseRateLimitOptions {
  /** Maximo de tentativas no window */
  maxAttempts?: number;
  /** Janela de tempo em milissegundos (default: 60s) */
  windowMs?: number;
  /** Mensagem de erro quando bloqueado */
  blockedMessage?: string;
  /** Chave de persistência (opcional) */
  storageKey?: string;
}

interface UseRateLimitReturn {
  /** Se esta bloqueado */
  isBlocked: boolean;
  /** Tentativas restantes */
  attemptsLeft: number;
  /** Tempo restante em segundos */
  cooldownSeconds: number;
  /** Verificar se pode executar */
  canExecute: () => boolean;
  /** Registrar tentativa */
  recordAttempt: () => void;
  /** Resetar contador */
  reset: () => void;
  /** Mensagem de erro quando bloqueado */
  blockedMessage: string;
}

/**
 * Rate limiting client-side para prevenir abuso.
 *
 * @example
 * ```tsx
 * const { isBlocked, canExecute, recordAttempt, cooldownSeconds } = useRateLimit({
 *   maxAttempts: 5,
 *   windowMs: 60000,
 * });
 *
 * const handleLogin = async () => {
 *   if (!canExecute()) {
 *     Alert.alert('Muitas tentativas', `Aguarde ${cooldownSeconds}s`);
 *     return;
 *   }
 *   recordAttempt();
 *   await login(email, password);
 * };
 * ```
 */
export function useRateLimit(options: UseRateLimitOptions = {}): UseRateLimitReturn {
  const { maxAttempts = 5, windowMs = 60000, blockedMessage = 'Muitas tentativas. Aguarde.', storageKey } = options;

  const [isBlocked, setIsBlocked] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const attempts = useRef<number[]>([]);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const storageKeyRef = useRef(storageKey);

  // Restaurar do AsyncStorage ao montar
  useEffect(() => {
    if (!storageKeyRef.current) return;
    AsyncStorage.getItem(storageKeyRef.current).then(raw => {
      if (!raw) return;
      try {
        const saved: number[] = JSON.parse(raw);
        const now = Date.now();
        attempts.current = saved.filter(t => now - t < windowMs);
        if (attempts.current.length >= maxAttempts) {
          setIsBlocked(true);
          const remainingMs = windowMs - (now - attempts.current[0]);
          const seconds = Math.ceil(remainingMs / 1000);
          setCooldownSeconds(seconds);
          cooldownTimer.current = setInterval(() => {
            setCooldownSeconds(prev => {
              if (prev <= 1) {
                setIsBlocked(false);
                attempts.current = [];
                if (cooldownTimer.current) clearInterval(cooldownTimer.current);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch {}
    });
  }, []);

  // Cleanup do interval
  useEffect(() => {
    return () => { if (cooldownTimer.current) clearInterval(cooldownTimer.current); };
  }, []);

  const persistAttempts = useCallback(async () => {
    if (!storageKeyRef.current) return;
    try { await AsyncStorage.setItem(storageKeyRef.current, JSON.stringify(attempts.current)); } catch {}
  }, []);

  const cleanup = useCallback(() => {
    const now = Date.now();
    attempts.current = attempts.current.filter(t => now - t < windowMs);
  }, [windowMs]);

  const canExecute = useCallback(() => {
    cleanup();
    return attempts.current.length < maxAttempts;
  }, [cleanup, maxAttempts]);

  const recordAttempt = useCallback(async () => {
    attempts.current.push(Date.now());
    cleanup();
    await persistAttempts();

    if (attempts.current.length >= maxAttempts) {
      setIsBlocked(true);
      const remainingMs = windowMs - (Date.now() - attempts.current[0]);
      const seconds = Math.ceil(remainingMs / 1000);
      setCooldownSeconds(seconds);

      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
      cooldownTimer.current = setInterval(() => {
        setCooldownSeconds(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            attempts.current = [];
            if (cooldownTimer.current) clearInterval(cooldownTimer.current);
            persistAttempts();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [cleanup, maxAttempts, windowMs, persistAttempts]);

  const reset = useCallback(async () => {
    attempts.current = [];
    setIsBlocked(false);
    setCooldownSeconds(0);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    await persistAttempts();
  }, [persistAttempts]);

  const attemptsLeft = maxAttempts - attempts.current.length;

  return { isBlocked, attemptsLeft, cooldownSeconds, canExecute, recordAttempt, reset, blockedMessage };
}
