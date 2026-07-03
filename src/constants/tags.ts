// src/constants/tags.ts
// Tags e categorias - NOVAIX FITNESS

interface Tag {
  id: string;
  label: string;
  icon: string;
}

interface TagCategory {
  label: string;
  icon: string;
  tags: Tag[];
}

interface DurationRange {
  min: number;
  max: number;
}

export const TAG_CATEGORIES: Record<string, TagCategory> = {
  objective: {
    label: 'OBJETIVO',
    icon: 'target',
    tags: [
      { id: 'weight_loss', label: 'Perder Peso', icon: 'flame' },
      { id: 'muscle_gain', label: 'Ganhar Massa', icon: 'barbell' },
      { id: 'endurance', label: 'Resistência', icon: 'heart' },
      { id: 'flexibility', label: 'Flexibilidade', icon: 'leaf' },
      { id: 'strength', label: 'Força', icon: 'fitness' },
      { id: 'general_fitness', label: 'Fitness Geral', icon: 'pulse' },
    ],
  },
  bodyPart: {
    label: 'GRUPO MUSCULAR',
    icon: 'body',
    tags: [
      { id: 'chest', label: 'Peito', icon: 'body' },
      { id: 'back', label: 'Costas', icon: 'body' },
      { id: 'shoulders', label: 'Ombros', icon: 'body' },
      { id: 'arms', label: 'Braços', icon: 'body' },
      { id: 'legs', label: 'Pernas', icon: 'body' },
      { id: 'core', label: 'Core', icon: 'body' },
      { id: 'glutes', label: 'Glúteos', icon: 'body' },
      { id: 'full_body', label: 'Corpo Todo', icon: 'body' },
    ],
  },
  duration: {
    label: 'DURAÇÃO',
    icon: 'time',
    tags: [
      { id: 'short', label: '< 20 min', icon: 'time' },
      { id: 'medium', label: '20-40 min', icon: 'time' },
      { id: 'long', label: '40-60 min', icon: 'time' },
      { id: 'extra', label: '60+ min', icon: 'time' },
    ],
  },
  equipment: {
    label: 'EQUIPAMENTO',
    icon: 'construct',
    tags: [
      { id: 'none', label: 'Nenhum', icon: 'body' },
      { id: 'dumbbells', label: 'Halteres', icon: 'barbell' },
      { id: 'barbell', label: 'Barra', icon: 'barbell' },
      { id: 'machine', label: 'Máquinas', icon: 'construct' },
      { id: 'cable', label: 'Polia', icon: 'construct' },
      { id: 'bench', label: 'Banco', icon: 'construct' },
    ],
  },
  location: {
    label: 'LOCAL',
    icon: 'location',
    tags: [
      { id: 'gym', label: 'Academia', icon: 'location' },
      { id: 'home', label: 'Casa', icon: 'home' },
      { id: 'outdoor', label: 'Ao ar livre', icon: 'leaf' },
    ],
  },
};

export const DURATION_RANGES: Record<string, DurationRange> = {
  short: { min: 0, max: 20 },
  medium: { min: 20, max: 40 },
  long: { min: 40, max: 60 },
  extra: { min: 60, max: Infinity },
};

export const MUSCLE_TO_BODY_PART: Record<string, string> = {
  'Peito': 'chest',
  'Peito Superior': 'chest',
  'Costas': 'back',
  'Costas Superior': 'back',
  'Ombro': 'shoulders',
  'Ombros': 'shoulders',
  'Bíceps': 'arms',
  'Tríceps': 'arms',
  'Braço': 'arms',
  'Perna': 'legs',
  'Pernas': 'legs',
  'Quadríceps': 'legs',
  'Posterior': 'legs',
  'Panturrilha': 'legs',
  'Core': 'core',
  'Abdômen': 'core',
  'Glúteo': 'glutes',
  'Glúteos': 'glutes',
  'Corpo todo': 'full_body',
  'Corpo Todo': 'full_body',
};

export const EQUIPMENT_TO_TAG: Record<string, string> = {
  'Barra': 'barbell',
  'Halteres': 'dumbbells',
  'Máquina': 'machine',
  'Polia': 'cable',
  'Banco': 'bench',
  'Kettlebell': 'dumbbells',
  'Elástico': 'none',
  'TRX': 'none',
};

export const CATEGORY_TO_OBJECTIVE: Record<string, string[]> = {
  'MUSCULAÇÃO': ['muscle_gain', 'strength'],
  'CARDIO': ['weight_loss', 'endurance'],
  'CALISTENIA': ['general_fitness', 'strength'],
  'FLEXIBILIDADE': ['flexibility'],
};

export type TagId = string;
export type BodyPart = string;
export type Equipment = string;
