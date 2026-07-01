// src/middleware/subscription.ts
// Middleware de validação de assinatura - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

interface PlanConfig {
  maxWorkouts: number;
  maxMessages: number;
  maxCustomWorkouts: number;
  maxFavorites: number;
  features: string[];
}

const PLANS: Record<string, PlanConfig> = {
  free: { 
    maxWorkouts: 3, 
    maxMessages: 0, 
    maxCustomWorkouts: 0,
    maxFavorites: 5,
    features: [] 
  },
  basic: { 
    maxWorkouts: 5, 
    maxMessages: 0, 
    maxCustomWorkouts: 0,
    maxFavorites: 10,
    features: ['workouts', 'favorites'] 
  },
  intermediate: { 
    maxWorkouts: 10, 
    maxMessages: 10, 
    maxCustomWorkouts: 5,
    maxFavorites: 25,
    features: ['workouts', 'chat', 'favorites', 'custom_workouts'] 
  },
  premium: { 
    maxWorkouts: 20, 
    maxMessages: 20, 
    maxCustomWorkouts: 15,
    maxFavorites: 50,
    features: ['workouts', 'chat', 'analytics', 'favorites', 'custom_workouts', 'export'] 
  },
  ultra: { 
    maxWorkouts: 50, 
    maxMessages: 50, 
    maxCustomWorkouts: 50,
    maxFavorites: -1, // ilimitado
    features: ['workouts', 'chat', 'analytics', 'priority', 'favorites', 'custom_workouts', 'export', 'priority_support'] 
  },
};

const requireSubscription = (requiredPlan = 'basic') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', (req as any).user.id)
        .single();

      if (error || !profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      if (profile.subscription_status !== 'active') {
        return res.status(403).json({ 
          error: 'Assinatura necessária',
          required: true,
          currentPlan: profile.subscription_plan || 'free'
        });
      }

      const planHierarchy = ['free', 'basic', 'intermediate', 'premium', 'ultra'];
      const currentLevel = planHierarchy.indexOf(profile.subscription_plan || 'free');
      const requiredLevel = planHierarchy.indexOf(requiredPlan);

      if (currentLevel < requiredLevel) {
        return res.status(403).json({ 
          error: `Plano ${requiredPlan} ou superior necessário`,
          required: true,
          currentPlan: profile.subscription_plan
        });
      }

      (req as any).subscription = {
        plan: profile.subscription_plan,
        status: profile.subscription_status,
        config: PLANS[profile.subscription_plan] || PLANS.free,
      };

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao verificar assinatura' });
    }
  };
};

const checkFeature = (feature: string) => (req: Request, res: Response, next: NextFunction) => {
  const sub = (req as any).subscription;
  if (!sub) {
    return res.status(403).json({ error: 'Assinatura não verificada' });
  }

  if (!sub.config.features.includes(feature)) {
    return res.status(403).json({ 
      error: `Recurso '${feature}' não disponível no seu plano`,
      feature,
      currentPlan: sub.plan
    });
  }

  next();
};

const checkLimit = (limitType: keyof Omit<PlanConfig, 'features'>) => (req: Request, res: Response, next: NextFunction) => {
  const sub = (req as any).subscription;
  if (!sub) {
    return res.status(403).json({ error: 'Assinatura não verificada' });
  }

  const limit = sub.config[limitType];
  if (limit === undefined) return next();

  (req as any).subscriptionLimit = limit;
  (req as any).subscriptionLimitType = limitType;
  next();
};

export {
  PLANS,
  requireSubscription,
  checkFeature,
  checkLimit,
};
