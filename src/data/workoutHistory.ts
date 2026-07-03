interface PeriodOption {
  key: string;
  label: string;
}

interface SortOption {
  key: string;
  label: string;
  icon: string;
}

export const PERIODS: PeriodOption[] = [
  { key: 'all', label: 'Todos' },
  { key: 'week', label: '7 dias' },
  { key: 'month', label: '30 dias' },
  { key: 'quarter', label: '3 meses' },
];

export const SORT_OPTIONS: SortOption[] = [
  { key: 'recent', label: 'Mais recente', icon: 'time' },
  { key: 'oldest', label: 'Mais antigo', icon: 'time-outline' },
  { key: 'rating', label: 'Melhor avaliado', icon: 'star' },
  { key: 'duration', label: 'Mais longo', icon: 'timer' },
];
