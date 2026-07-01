// Hook de monetização - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPlans,
} from '../services/monetizationPlans';
import {
  getUserPlan,
  checkFeatureAccess,
  getUsageStats,
  createSubscription,
  cancelSubscription,
} from '../services/monetizationSubscription';
import {
  applyCoupon,
  createReferral,
  getReferralStats,
  applyReferral,
} from '../services/monetizationCoupons';
import { Plan } from '../types';

interface UsageStats {
  [key: string]: unknown;
}

interface Discount {
  [key: string]: unknown;
}

interface ReferralStats {
  code?: string;
  [key: string]: unknown;
}

interface UseSubscriptionReturn {
  plan: Plan | null;
  plans: Plan[];
  usage: UsageStats | null;
  loading: boolean;
  subscribe: (planId: string, paymentMethod: string) => Promise<unknown>;
  cancel: () => Promise<void>;
  checkAccess: (feature: string) => Promise<boolean>;
  refresh: () => void;
  isPremium: boolean;
  isBasic: boolean;
  isFree: boolean;
}

interface UseCouponReturn {
  discount: Discount | null;
  loading: boolean;
  error: string | null;
  validate: (code: string, planId: string) => Promise<Discount | null>;
  clear: () => void;
}

interface UseReferralReturn {
  stats: ReferralStats | null;
  loading: boolean;
  generateCode: () => Promise<string>;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setPlans(getPlans() as any);
    if (user?.id) loadPlan();
  }, [user?.id]);

  async function loadPlan(): Promise<void> {
    setLoading(true);
    try {
      const [userPlan, usageStats] = await Promise.all([
        getUserPlan(user.id),
        getUsageStats(user.id),
      ]);
      setPlan(userPlan as any);
      setUsage(usageStats);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar plano:', err);
    }
    setLoading(false);
  }

  const subscribe = useCallback(async (planId: string, paymentMethod: string): Promise<unknown> => {
    const sub = await createSubscription(user.id, planId, paymentMethod);
    await loadPlan();
    return sub;
  }, [user?.id]);

  const cancel = useCallback(async (): Promise<void> => {
    await cancelSubscription(user.id);
    await loadPlan();
  }, [user?.id]);

  const checkAccess = useCallback(async (feature: string): Promise<boolean> => {
    return checkFeatureAccess(user.id, feature);
  }, [user?.id]);

  const refresh = useCallback((): void => { loadPlan(); }, [user?.id]);

  return {
    plan,
    plans,
    usage,
    loading,
    subscribe,
    cancel,
    checkAccess,
    refresh,
    isPremium: plan?.id === 'premium',
    isBasic: plan?.id === 'basic',
    isFree: plan?.id === 'free' || !plan,
  };
}

export function useCoupon(): UseCouponReturn {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (code: string, planId: string): Promise<Discount | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await applyCoupon(code, planId);
      if (result) {
        setDiscount(result as any);
      } else {
        setError('Cupom invalido ou expirado');
      }
      return result as any;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao validar cupom';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback((): void => {
    setDiscount(null);
    setError(null);
  }, []);

  return { discount, loading, error, validate, clear };
}

export function useReferral(): UseReferralReturn {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.id) loadStats();
  }, [user?.id]);

  async function loadStats(): Promise<void> {
    setLoading(true);
    try {
      const data = await getReferralStats(user.id);
      setStats(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar stats referral:', err);
    }
    setLoading(false);
  }

  const generateCode = useCallback(async (): Promise<string> => {
    const code = await createReferral(user.id);
    setStats(prev => prev ? { ...prev, code } : { code });
    return code;
  }, [user?.id]);

  return { stats, loading, generateCode, refresh: loadStats };
}
