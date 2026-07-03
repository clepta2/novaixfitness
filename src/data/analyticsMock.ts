// src/data/analyticsMock.ts
// Dados mock para analytics - NOVAIX FITNESS

export interface SleepEntry {
  date: string;
  sleepHours: number;
  workoutPerformance: number;
  workoutDuration: number;
  sleepQuality: 'ruim' | 'regular' | 'bom' | 'otimo';
}

export interface BenchmarkData {
  ageRange: string;
  goal: string;
  experience: string;
  userStats: {
    weight: number;
    workoutsPerWeek: number;
    avgDuration: number;
    streak: number;
    totalMinutes: number;
    bmi: number;
  };
  peerStats: {
    weight: number;
    workoutsPerWeek: number;
    avgDuration: number;
    streak: number;
    totalMinutes: number;
    bmi: number;
  };
  percentile: number;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  streakBest: number;
  streakCurrent: number;
  bestWorkout: { name: string; duration: number; calories: number; date: string };
  mostActiveDay: string;
  workoutsByDay: Record<string, number>;
  workoutsByCategory: Record<string, number>;
  minutesByWeek: number[];
  photosComparison: { before: string | null; after: string | null } | null;
}

export interface ProgressPredictionData {
  currentWeight: number;
  weightHistory: number[];
  workoutsPerWeek: number;
  avgDuration: number;
  goal: 'perder_peso' | 'ganhar_massa' | 'manter';
  monthsActive: number;
}

export const MOCK_SLEEP_DATA: SleepEntry[] = [
  { date: '01/06', sleepHours: 5.5, workoutPerformance: 45, workoutDuration: 30, sleepQuality: 'ruim' },
  { date: '02/06', sleepHours: 6.2, workoutPerformance: 55, workoutDuration: 35, sleepQuality: 'regular' },
  { date: '03/06', sleepHours: 7.0, workoutPerformance: 70, workoutDuration: 45, sleepQuality: 'bom' },
  { date: '04/06', sleepHours: 8.1, workoutPerformance: 85, workoutDuration: 55, sleepQuality: 'otimo' },
  { date: '05/06', sleepHours: 6.5, workoutPerformance: 50, workoutDuration: 30, sleepQuality: 'regular' },
  { date: '06/06', sleepHours: 7.3, workoutPerformance: 75, workoutDuration: 50, sleepQuality: 'bom' },
  { date: '07/06', sleepHours: 8.5, workoutPerformance: 90, workoutDuration: 60, sleepQuality: 'otimo' },
  { date: '08/06', sleepHours: 5.0, workoutPerformance: 40, workoutDuration: 25, sleepQuality: 'ruim' },
  { date: '09/06', sleepHours: 7.5, workoutPerformance: 78, workoutDuration: 48, sleepQuality: 'bom' },
  { date: '10/06', sleepHours: 6.8, workoutPerformance: 60, workoutDuration: 40, sleepQuality: 'regular' },
  { date: '11/06', sleepHours: 8.0, workoutPerformance: 88, workoutDuration: 58, sleepQuality: 'otimo' },
  { date: '12/06', sleepHours: 7.2, workoutPerformance: 72, workoutDuration: 45, sleepQuality: 'bom' },
  { date: '13/06', sleepHours: 6.0, workoutPerformance: 48, workoutDuration: 30, sleepQuality: 'regular' },
  { date: '14/06', sleepHours: 7.8, workoutPerformance: 82, workoutDuration: 52, sleepQuality: 'bom' },
];

export const MOCK_BENCHMARK_DATA: BenchmarkData = {
  ageRange: '25-34',
  goal: 'Perder peso',
  experience: 'Intermediário',
  userStats: {
    weight: 82,
    workoutsPerWeek: 3.5,
    avgDuration: 45,
    streak: 12,
    totalMinutes: 1260,
    bmi: 26.2,
  },
  peerStats: {
    weight: 80,
    workoutsPerWeek: 3.2,
    avgDuration: 42,
    streak: 8,
    totalMinutes: 1100,
    bmi: 25.5,
  },
  percentile: 72,
};

export const MOCK_MONTHLY_REPORT: MonthlyReportData = {
  month: 'Junho',
  year: 2026,
  totalWorkouts: 14,
  totalMinutes: 630,
  totalCalories: 8400,
  streakBest: 8,
  streakCurrent: 5,
  bestWorkout: {
    name: 'Treino HIIT Full Body',
    duration: 60,
    calories: 750,
    date: '2026-06-14',
  },
  mostActiveDay: 'Terça-feira',
  workoutsByDay: {
    Seg: 2, Ter: 3, Qua: 2, Qui: 3, Sex: 2, Sab: 1, Dom: 1,
  },
  workoutsByCategory: {
    'Musculação': 6,
    'HIIT': 4,
    'Cardio': 3,
    'Flexibilidade': 1,
  },
  minutesByWeek: [120, 165, 180, 165],
  photosComparison: {
    before: null,
    after: null,
  },
};

export const MOCK_PROGRESS_PREDICTION: ProgressPredictionData = {
  currentWeight: 82,
  weightHistory: [88, 87, 85.5, 84, 83.2, 82],
  workoutsPerWeek: 3.5,
  avgDuration: 45,
  goal: 'perder_peso',
  monthsActive: 6,
};
