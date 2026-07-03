interface FilterOption {
  key: string;
  label: string;
  icon?: string;
}

export const HISTORY_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Todos' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'partial', label: 'Em andamento' },
];

export const PHOTO_LABELS: string[] = ['Frente', 'Lado', 'Costas', 'Detalhe'];

export const DAY_NAMES: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
export const DAY_FULL: string[] = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

export const LEVEL_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Níveis' },
  { key: 'Iniciante', label: 'Iniciante' },
  { key: 'Intermediário', label: 'Intermediário' },
  { key: 'Avançado', label: 'Avançado' }
];

export const DURATION_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Duração' },
  { key: 'under30', label: '< 30 min' },
  { key: '30to45', label: '30-45 min' },
  { key: 'over45', label: '> 45 min' }
];

export const ACCESS_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Acesso' },
  { key: 'free', label: 'Grátis' },
  { key: 'premium', label: '🔒 Premium' }
];

export const EQUIPMENT_FILTERS_SPECIFIC: FilterOption[] = [
  { key: 'all', label: 'Todos' },
  { key: 'none', label: 'Peso Corporal' },
  { key: 'dumbbells', label: 'Halteres' },
  { key: 'barbell', label: 'Barra' },
  { key: 'machine', label: 'Máquinas' },
  { key: 'cable', label: 'Polia' },
  { key: 'bench', label: 'Banco' }
];

export const CATEGORY_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Todas' },
  { key: 'musculacao', label: 'Musculação' },
  { key: 'calistenia', label: 'Calistenia' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'flexibilidade', label: 'Flexibilidade' }
];

export const MUSCLE_FILTERS: FilterOption[] = [
  { key: 'all', label: 'Todos' },
  { key: 'chest', label: 'Peito' },
  { key: 'back', label: 'Costas' },
  { key: 'shoulders', label: 'Ombros' },
  { key: 'arms', label: 'Braços' },
  { key: 'legs', label: 'Pernas' },
  { key: 'core', label: 'Core' },
  { key: 'glutes', label: 'Glúteos' },
  { key: 'full_body', label: 'Corpo Todo' }
];
