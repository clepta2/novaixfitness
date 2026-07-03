interface ExerciseFallback {
  name: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  sets: number;
  reps: string;
  rest: number;
  calories: number;
}

export const EXERCISE_FALLBACK: ExerciseFallback[] = [
  { name: 'Supino Reto', muscle: 'Peito', equipment: 'Halteres', difficulty: 'Intermediário', sets: 4, reps: '10-12', rest: 90, calories: 8 },
  { name: 'Agachamento', muscle: 'Pernas', equipment: 'Barra', difficulty: 'Intermediário', sets: 4, reps: '8-10', rest: 120, calories: 12 },
  { name: 'Puxada Frontal', muscle: 'Costas', equipment: 'Máquina', difficulty: 'Iniciante', sets: 4, reps: '10-12', rest: 90, calories: 7 },
  { name: 'Desenvolvimento', muscle: 'Ombros', equipment: 'Halteres', difficulty: 'Intermediário', sets: 3, reps: '10-12', rest: 60, calories: 6 },
  { name: 'Rosca Direta', muscle: 'Braços', equipment: 'Halteres', difficulty: 'Iniciante', sets: 3, reps: '12-15', rest: 60, calories: 4 },
  { name: 'Abdominal Crunch', muscle: 'Abdômen', equipment: 'Nenhum', difficulty: 'Iniciante', sets: 3, reps: '15-20', rest: 45, calories: 3 },
  { name: 'Supino Inclinado', muscle: 'Peito', equipment: 'Halteres', difficulty: 'Avançado', sets: 4, reps: '8-10', rest: 90, calories: 9 },
  { name: 'Leg Press', muscle: 'Pernas', equipment: 'Máquina', difficulty: 'Iniciante', sets: 4, reps: '10-12', rest: 90, calories: 10 },
  { name: 'Remada Curvada', muscle: 'Costas', equipment: 'Barra', difficulty: 'Intermediário', sets: 4, reps: '10-12', rest: 90, calories: 8 },
  { name: 'Elevação Lateral', muscle: 'Ombros', equipment: 'Halteres', difficulty: 'Iniciante', sets: 3, reps: '12-15', rest: 60, calories: 4 },
  { name: 'Tríceps Pulley', muscle: 'Braços', equipment: 'Cabo', difficulty: 'Iniciante', sets: 3, reps: '12-15', rest: 60, calories: 4 },
  { name: 'Prancha', muscle: 'Abdômen', equipment: 'Nenhum', difficulty: 'Iniciante', sets: 3, reps: '30-45s', rest: 30, calories: 3 },
  { name: 'Flexão', muscle: 'Peito', equipment: 'Nenhum', difficulty: 'Iniciante', sets: 3, reps: '10-15', rest: 60, calories: 5 },
  { name: 'Burpee', muscle: 'Pernas', equipment: 'Nenhum', difficulty: 'Avançado', sets: 3, reps: '10-12', rest: 90, calories: 15 },
  { name: 'Stiff', muscle: 'Pernas', equipment: 'Barra', difficulty: 'Intermediário', sets: 4, reps: '10-12', rest: 90, calories: 9 },
  { name: 'Face Pull', muscle: 'Ombros', equipment: 'Cabo', difficulty: 'Iniciante', sets: 3, reps: '12-15', rest: 60, calories: 4 },
  { name: 'Rosca Martelo', muscle: 'Braços', equipment: 'Halteres', difficulty: 'Iniciante', sets: 3, reps: '12-15', rest: 60, calories: 4 },
  { name: 'Elevação Pélvica', muscle: 'Pernas', equipment: 'Nenhum', difficulty: 'Iniciante', sets: 3, reps: '15-20', rest: 60, calories: 5 },
];
