// src/data/workoutPlanOptions.js
// Opções de plano de treino - O usuário decide como quer treinar

export const PLAN_TYPES = [
  {
    id: 'musculacao',
    label: 'Musculação',
    description: 'Treino com peso e máquinas',
    icon: 'barbell',
    daysPerWeek: [3, 4, 5],
    defaultDays: 4,
    subcategories: [
      { id: 'hipertrofia', label: 'Hipertrofia', description: 'Ganhar massa muscular' },
      { id: 'forca', label: 'Força', description: 'Aumentar carga' },
      { id: 'definicao', label: 'Definição', description: 'Perder gordura e definir' },
    ],
    equipment: ['Barra', 'Halteres', 'Máquinas', 'Polias'],
  },
  {
    id: 'calistenia',
    label: 'Calistenia',
    description: 'Treino com peso corporal',
    icon: 'body',
    daysPerWeek: [3, 4, 5],
    defaultDays: 4,
    subcategories: [
      { id: 'basico', label: 'Básico', description: 'Flexão, agachamento, prancha' },
      { id: 'intermediario', label: 'Intermediário', description: 'Flexão diamante, agachamento búlgaro' },
      { id: 'avancado', label: 'Avançado', description: 'Muscle-up, front lever' },
    ],
    equipment: ['Barra fixa', 'Paralelas', 'Anilhas', 'Chão'],
  },
  {
    id: 'yoga',
    label: 'Yoga',
    description: 'Flexibilidade e equilíbrio',
    icon: 'leaf',
    daysPerWeek: [3, 4, 5],
    defaultDays: 4,
    subcategories: [
      { id: 'hatha', label: 'Hatha', description: 'Clássico, lento' },
      { id: 'vinyasa', label: 'Vinyasa', description: 'Dinâmico, fluxo' },
      { id: 'yin', label: 'Yin', description: 'Passivo, alongamento profundo' },
    ],
    equipment: ['Estojo', 'Copo', 'Bloco', 'Cinta'],
  },
  {
    id: 'cardio',
    label: 'Cardio',
    description: 'Exercícios aeróbicos',
    icon: 'heart',
    daysPerWeek: [3, 4, 5],
    defaultDays: 4,
    subcategories: [
      { id: 'corrida', label: 'Corrida', description: 'Rua ou esteira' },
      { id: 'ciclismo', label: 'Ciclismo', description: 'Bike ou outdoor' },
      { id: 'natacao', label: 'Natação', description: 'Piscina ou mar' },
      { id: 'hiit', label: 'HIIT', description: 'Intervalado de alta intensidade' },
    ],
    equipment: ['Tênis', 'Garrafa', 'Roupa confortável'],
  },
  {
    id: 'misto',
    label: 'Misto',
    description: 'Combinação de tudo',
    icon: 'flash',
    daysPerWeek: [4, 5, 6],
    defaultDays: 5,
    subcategories: [
      { id: 'forca_cardio', label: 'Força + Cardio', description: 'Alternados' },
      { id: 'calistenia_cardio', label: 'Calistenia + Cardio', description: 'Peso corporal + corrida' },
      { id: 'tudo', label: 'Tudo junto', description: 'Musculação + Cardio + Yoga' },
    ],
    equipment: ['Depende dos treinos escolhidos'],
  },
];

export const CARDIO_OPTIONS = [
  {
    id: 'corrida',
    label: 'Corrida',
    icon: 'walk',
    description: 'Correr na rua ou esteira',
    benefits: ['Queima gordura', 'Melhora condicionamento', 'Fortalece pernas'],
    intensity: ['Leve', 'Moderada', 'Intensa'],
    duration: ['15min', '30min', '45min', '60min'],
  },
  {
    id: 'ciclismo',
    label: 'Ciclismo',
    icon: 'bicycle',
    description: 'Bike estática ou outdoor',
    benefits: ['Baixo impacto', 'Fortalece pernas', 'Diversão'],
    intensity: ['Leve', 'Moderada', 'Intensa'],
    duration: ['20min', '30min', '45min', '60min'],
  },
  {
    id: 'natacao',
    label: 'Natação',
    icon: 'water',
    description: 'Piscina ou mar',
    benefits: ['Corpo todo', 'Baixo impacto', 'Respiração'],
    intensity: ['Leve', 'Moderada', 'Intensa'],
    duration: ['20min', '30min', '45min', '60min'],
  },
  {
    id: 'hiit',
    label: 'HIIT',
    icon: 'flash',
    description: 'Intervalado de alta intensidade',
    benefits: ['Queima muita caloria', 'Rápido', 'Eficaz'],
    intensity: ['Moderada', 'Intensa', 'Máxima'],
    duration: ['15min', '20min', '30min'],
  },
  {
    id: 'eliptico',
    label: 'Elíptico',
    icon: 'fitness',
    description: 'Máquina de academia',
    benefits: ['Baixo impacto', 'Corpo todo', 'Fácil'],
    intensity: ['Leve', 'Moderada', 'Intensa'],
    duration: ['20min', '30min', '45min'],
  },
  {
    id: 'escada',
    label: 'Escada',
    icon: 'trending-up',
    description: 'Escada rolante ou fixa',
    benefits: ['Fortalece pernas', 'Queima caloria', 'Cardiovascular'],
    intensity: ['Leve', 'Moderada', 'Intensa'],
    duration: ['10min', '15min', '20min'],
  },
];

export const YOGA_STYLES = [
  {
    id: 'hatha',
    label: 'Hatha Yoga',
    description: 'Clássico, posturas mantidas',
    benefits: ['Flexibilidade', 'Equilíbrio', 'Respiração'],
    level: ['Iniciante', 'Intermediário', 'Avançado'],
  },
  {
    id: 'vinyasa',
    label: 'Vinyasa Flow',
    description: 'Dinâmico, fluxo entre posturas',
    benefits: ['Força', 'Flexibilidade', 'Cardio leve'],
    level: ['Intermediário', 'Avançado'],
  },
  {
    id: 'yin',
    label: 'Yin Yoga',
    description: 'Passivo, alongamento profundo',
    benefits: ['Flexibilidade profunda', 'Relaxamento', 'Recuperação'],
    level: ['Iniciante', 'Intermediário'],
  },
  {
    id: 'ashtanga',
    label: 'Ashtanga',
    description: 'Sequência fixa, intensa',
    benefits: ['Força', 'Flexibilidade', 'Disciplina'],
    level: ['Intermediário', 'Avançado'],
  },
  {
    id: 'kundalini',
    label: 'Kundalini',
    description: 'Mental e espiritual',
    benefits: ['Estresse', 'Mental', 'Energia'],
    level: ['Iniciante', 'Intermediário', 'Avançado'],
  },
];

export const ACTIVE_REST_ACTIVITIES = [
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

export const WEEKLY_PLAN_TEMPLATES = {
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

export function generateWeeklyPlan(planType, daysPerWeek, preferredRestActivities = []) {
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
