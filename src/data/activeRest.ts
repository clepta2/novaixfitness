interface ActiveRestActivity {
  id: string;
  label: string;
  icon: string;
  duration: string;
  intensity: string;
  calories: number;
  benefits: string[];
}

interface DayPlan {
  day: string;
  type: 'workout' | 'rest';
  label: string;
  activity?: ActiveRestActivity;
}

interface WeeklyPlanTemplate {
  label: string;
  description: string;
  template: DayPlan[];
}

export const ACTIVE_REST_ACTIVITIES: ActiveRestActivity[] = [
  {
    id: 'walk',
    label: 'Caminhada',
    icon: 'walk',
    duration: '20-30 min',
    intensity: 'Leve',
    calories: 100,
    benefits: ['Melhora circulação', 'Reduz estresse', 'Recuperação muscular'],
  },
  {
    id: 'light_run',
    label: 'Corrida Leve',
    icon: 'run',
    duration: '15-20 min',
    intensity: 'Leve',
    calories: 150,
    benefits: ['Mantém condicionamento', 'Melhora humor', 'Queima gordura'],
  },
  {
    id: 'bike',
    label: 'Bike',
    icon: 'bicycle',
    duration: '20-30 min',
    intensity: 'Leve',
    calories: 120,
    benefits: ['Baixo impacto', 'Fortalece pernas', 'Diversão'],
  },
  {
    id: 'swim',
    label: 'Natação',
    icon: 'water',
    duration: '20-30 min',
    intensity: 'Leve',
    calories: 200,
    benefits: ['Corpo todo', 'Baixo impacto', 'Respiração'],
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: 'leaf',
    duration: '30 min',
    intensity: 'Muito leve',
    calories: 80,
    benefits: ['Flexibilidade', 'Reduz estresse', 'Equilíbrio'],
  },
  {
    id: 'stretch',
    label: 'Alongamento',
    icon: 'body',
    duration: '15 min',
    intensity: 'Muito leve',
    calories: 50,
    benefits: ['Flexibilidade', 'Recuperação', 'Previne lesões'],
  },
  {
    id: 'foam_roller',
    label: 'Foam Roller',
    icon: 'fitness',
    duration: '15 min',
    intensity: 'Muito leve',
    calories: 40,
    benefits: ['Recuperação muscular', 'Reduz tensão', 'Melhora mobilidade'],
  },
  {
    id: 'hike',
    label: 'Trilha',
    icon: 'trail-sign',
    duration: '30-60 min',
    intensity: 'Moderada',
    calories: 250,
    benefits: ['Contato com natureza', 'Corpo todo', 'Diversão'],
  },
];

export const WEEKLY_PLAN_TEMPLATES: Record<string, WeeklyPlanTemplate> = {
  '3_days': {
    label: '3 dias de treino',
    description: 'Treino + 4 dias de descanso ativo',
    template: [
      { day: 'Segunda', type: 'workout', label: 'Treino' },
      { day: 'Terça', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Quarta', type: 'workout', label: 'Treino' },
      { day: 'Quinta', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Sexta', type: 'workout', label: 'Treino' },
      { day: 'Sábado', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Domingo', type: 'rest', label: 'Descanso Total' },
    ],
  },
  '4_days': {
    label: '4 dias de treino',
    description: 'Treino + 3 dias de descanso ativo',
    template: [
      { day: 'Segunda', type: 'workout', label: 'Treino' },
      { day: 'Terça', type: 'workout', label: 'Treino' },
      { day: 'Quarta', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Quinta', type: 'workout', label: 'Treino' },
      { day: 'Sexta', type: 'workout', label: 'Treino' },
      { day: 'Sábado', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Domingo', type: 'rest', label: 'Descanso Total' },
    ],
  },
  '5_days': {
    label: '5 dias de treino',
    description: 'Treino + 2 dias de descanso ativo',
    template: [
      { day: 'Segunda', type: 'workout', label: 'Treino' },
      { day: 'Terça', type: 'workout', label: 'Treino' },
      { day: 'Quarta', type: 'workout', label: 'Treino' },
      { day: 'Quinta', type: 'rest', label: 'Descanso Ativo' },
      { day: 'Sexta', type: 'workout', label: 'Treino' },
      { day: 'Sábado', type: 'workout', label: 'Treino' },
      { day: 'Domingo', type: 'rest', label: 'Descanso Total' },
    ],
  },
};

export function generateWeeklyPlan(planType: string, daysPerWeek: number, preferredRestActivities: ActiveRestActivity[] = []) {
  const template = WEEKLY_PLAN_TEMPLATES[daysPerWeek + '_days'] || WEEKLY_PLAN_TEMPLATES['4_days'];

  const plan = template.template.map(day => {
    if (day.type === 'rest' && preferredRestActivities.length > 0) {
      const randomActivity = preferredRestActivities[Math.floor(Math.random() * preferredRestActivities.length)];
      return {
        ...day,
        activity: randomActivity,
        label: `Descanso: ${randomActivity.label}`,
      };
    }
    return day;
  });

  return {
    planType,
    daysPerWeek,
    template: plan,
    summary: `Seu plano: ${daysPerWeek} dias de treino + ${7 - daysPerWeek} dias de descanso ativo`,
  };
}
