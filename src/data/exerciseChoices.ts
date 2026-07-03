// src/data/exerciseChoices.ts
// O USUÁRIO escolhe o que quer ter no treino DELE

interface ExerciseChoice {
  id: string;
  name: string;
  equipment: string;
  level: string;
}

interface MuscleGroup {
  id: string;
  label: string;
  icon: string;
  exercises: ExerciseChoice[];
}

interface IntensityOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface GoalOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    id: 'chest',
    label: 'Peito',
    icon: 'fitness',
    exercises: [
      { id: 'supino_reto', name: 'Supino Reto', equipment: 'Barra', level: 'intermediário' },
      { id: 'supino_inclinado', name: 'Supino Inclinado', equipment: 'Halteres', level: 'intermediário' },
      { id: 'crucifixo', name: 'Crucifixo', equipment: 'Máquina', level: 'iniciante' },
      { id: 'flexao', name: 'Flexão', equipment: 'Peso corporal', level: 'iniciante' },
      { id: 'crossover', name: 'Crossover', equipment: 'Polia', level: 'intermediário' },
    ],
  },
  {
    id: 'back',
    label: 'Costas',
    icon: 'body',
    exercises: [
      { id: 'puxada_frontal', name: 'Puxada Frontal', equipment: 'Máquina', level: 'iniciante' },
      { id: 'remada_curvada', name: 'Remada Curvada', equipment: 'Barra', level: 'intermediário' },
      { id: 'remada_unilateral', name: 'Remada Unilateral', equipment: 'Halteres', level: 'iniciante' },
      { id: 'barra_fixa', name: 'Barra Fixa', equipment: 'Barra fixa', level: 'avançado' },
    ],
  },
  {
    id: 'legs',
    label: 'Pernas',
    icon: 'foot',
    exercises: [
      { id: 'agachamento', name: 'Agachamento', equipment: 'Barra', level: 'intermediário' },
      { id: 'leg_press', name: 'Leg Press', equipment: 'Máquina', level: 'iniciante' },
      { id: 'cadeira_extensora', name: 'Cadeira Extensora', equipment: 'Máquina', level: 'iniciante' },
      { id: 'cadeira_flexora', name: 'Cadeira Flexora', equipment: 'Máquina', level: 'iniciante' },
      { id: 'stiff', name: 'Stiff', equipment: 'Barra', level: 'intermediário' },
      { id: 'panturrilha', name: 'Panturrilha', equipment: 'Máquina', level: 'iniciante' },
    ],
  },
  {
    id: 'shoulders',
    label: 'Ombros',
    icon: 'resize',
    exercises: [
      { id: 'desenvolvimento', name: 'Desenvolvimento', equipment: 'Barra', level: 'intermediário' },
      { id: 'elevacao_lateral', name: 'Elevação Lateral', equipment: 'Halteres', level: 'iniciante' },
      { id: 'face_pull', name: 'Face Pull', equipment: 'Polia', level: 'iniciante' },
      { id: 'arnold_press', name: 'Arnold Press', equipment: 'Halteres', level: 'intermediário' },
    ],
  },
  {
    id: 'arms',
    label: 'Braços',
    icon: 'barbell',
    exercises: [
      { id: 'rosca_direta', name: 'Rosca Direta', equipment: 'Barra', level: 'intermediário' },
      { id: 'rosca_martelo', name: 'Rosca Martelo', equipment: 'Halteres', level: 'iniciante' },
      { id: 'triceps_pulley', name: 'Tríceps Pulley', equipment: 'Polia', level: 'iniciante' },
      { id: 'triceps_frances', name: 'Tríceps Francês', equipment: 'Halteres', level: 'intermediário' },
    ],
  },
  {
    id: 'abs',
    label: 'Abdômen',
    icon: 'fitness',
    exercises: [
      { id: 'abdominal_crunch', name: 'Abdominal Crunch', equipment: 'Peso corporal', level: 'iniciante' },
      { id: 'prancha', name: 'Prancha', equipment: 'Peso corporal', level: 'iniciante' },
      { id: 'russian_twist', name: 'Russian Twist', equipment: 'Peso corporal', level: 'intermediário' },
      { id: 'elevacao_pernas', name: 'Elevação de Pernas', equipment: 'Peso corporal', level: 'intermediário' },
    ],
  },
  {
    id: 'cardio',
    label: 'Cardio',
    icon: 'heart',
    exercises: [
      { id: 'corrida', name: 'Corrida', equipment: 'Esteira/Rua', level: 'iniciante' },
      { id: 'bike', name: 'Bike', equipment: 'Bike', level: 'iniciante' },
      { id: 'eliptico', name: 'Elíptico', equipment: 'Máquina', level: 'iniciante' },
      { id: 'remo', name: 'Remo', equipment: 'Máquina', level: 'intermediário' },
      { id: 'escada', name: 'Escada', equipment: 'Máquina', level: 'iniciante' },
    ],
  },
  {
    id: 'flexibility',
    label: 'Flexibilidade',
    icon: 'leaf',
    exercises: [
      { id: 'alongamento', name: 'Alongamento', equipment: 'Peso corporal', level: 'iniciante' },
      { id: 'yoga', name: 'Yoga', equipment: 'Estojo', level: 'iniciante' },
      { id: 'pilates', name: 'Pilates', equipment: 'Estojo', level: 'iniciante' },
      { id: 'foam_roller', name: 'Foam Roller', equipment: 'Foam Roller', level: 'iniciante' },
    ],
  },
];

export const INTENSITY_OPTIONS: IntensityOption[] = [
  { id: 'light', label: 'Leve', description: 'Foco em forma e mobilidade', icon: 'leaf' },
  { id: 'moderate', label: 'Moderado', description: 'Equilíbrio entre força e resistência', icon: 'flash' },
  { id: 'intense', label: 'Intenso', description: 'Máximo desempenho', icon: 'flame' },
];

export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'lose_weight', label: 'Perder peso', description: 'Queima de gordura', icon: 'flame' },
  { id: 'gain_muscle', label: 'Ganhar massa', description: 'Hipertrofia muscular', icon: 'barbell' },
  { id: 'get_fit', label: 'Condicionamento', description: 'Saúde e disposição', icon: 'heart' },
  { id: 'flexibility', label: 'Flexibilidade', description: 'Mobilidade e alongamento', icon: 'leaf' },
  { id: 'strength', label: 'Força', description: 'Aumentar cargas', icon: 'flash' },
];
