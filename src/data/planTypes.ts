interface PlanSubcategory {
  id: string;
  label: string;
  description: string;
}

interface PlanType {
  id: string;
  label: string;
  description: string;
  icon: string;
  daysPerWeek: number[];
  defaultDays: number;
  subcategories: PlanSubcategory[];
  equipment: string[];
}

export const PLAN_TYPES: PlanType[] = [
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
