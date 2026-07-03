// src/data/dailyWorkouts.ts
// Dados dos treinos diários - NOVAIX FITNESS

interface DailyWorkout {
  id: string;
  time: string;
  name: string;
  focus: string;
  sets: number;
  reps: number;
  intensity: string;
  duration: number;
  videoId: string;
  completed: boolean;
  locked?: boolean;
}

export const dailyWorkouts: DailyWorkout[] = [
  {
    id: '1',
    time: '08:00',
    name: 'MUSCULAÇÃO',
    focus: 'Peito/Tríceps',
    sets: 6,
    reps: 3,
    intensity: 'Int.',
    duration: 50,
    videoId: 'dQw4w9WgXcQ',
    completed: true,
  },
  {
    id: '2',
    time: '14:00',
    name: 'CARDIO HIIT 30\'',
    focus: 'Queima de gordura',
    sets: 0,
    reps: 0,
    intensity: 'High Int.',
    duration: 30,
    videoId: 'dQw4w9WgXcQ',
    completed: true,
  },
  {
    id: '3',
    time: '16:00',
    name: 'CARDIO LISS 40\'',
    focus: 'Resistência',
    sets: 0,
    reps: 0,
    intensity: 'Estável / Baixa Int.',
    duration: 40,
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    locked: true,
  },
  {
    id: '4',
    time: '18:00',
    name: 'MUSCULAÇÃO',
    focus: 'Costas/Bíceps',
    sets: 5,
    reps: 0,
    intensity: 'Média Int.',
    duration: 55,
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    locked: true,
  },
  {
    id: '5',
    time: '20:00',
    name: 'FLEXIBILIDADE',
    focus: 'Pernas',
    sets: 6,
    reps: 0,
    intensity: 'Along.',
    duration: 30,
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    locked: true,
  },
];

export const activeWorkout = {
  id: 'active',
  time: '22:00',
  name: 'TREINO FINAL: ESTRELAS',
  sets: 3,
  reps: 20,
  intensity: 'High Int.',
  duration: 45,
  videoId: 'dQw4w9WgXcQ',
};
