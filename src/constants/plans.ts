export interface PlanLimits {
  workouts_per_week: number;
  ai_chats_per_day: number;
  custom_workouts: number;
  export_data: boolean;
  priority_support: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period?: 'monthly' | 'yearly';
  features: string[];
  limits: PlanLimits;
}

export interface Plans {
  free: Plan;
  basic: Plan;
  premium: Plan;
}

export const PLANS: Plans = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: [
      '3 treinos por semana',
      'Historico basico',
      'Comunidade',
    ],
    limits: {
      workouts_per_week: 3,
      ai_chats_per_day: 2,
      custom_workouts: 0,
      export_data: false,
      priority_support: false,
    },
  },
  basic: {
    id: 'basic',
    name: 'Basico',
    price: 29.90,
    period: 'monthly',
    features: [
      'Treinos ilimitados',
      'IA coach',
      'Planos personalizados',
      'Exportar dados',
    ],
    limits: {
      workouts_per_week: Infinity,
      ai_chats_per_day: 10,
      custom_workouts: 5,
      export_data: true,
      priority_support: false,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 59.90,
    period: 'monthly',
    features: [
      'Tudo do Basico',
      'IA ilimitada',
      'Treinos ilimitados',
      'Suporte prioritario',
      'Sem anuncios',
      'Integracao saude',
    ],
    limits: {
      workouts_per_week: Infinity,
      ai_chats_per_day: Infinity,
      custom_workouts: Infinity,
      export_data: true,
      priority_support: true,
    },
  },
};

export type PlanId = keyof Plans;
