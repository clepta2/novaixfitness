require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const workoutsToSeed = [
  {
    title: 'Peito e Tríceps',
    name: 'Peito e Tríceps',
    description: 'Treino focado em hipertrofia para peito e tríceps',
    category: 'Musculação',
    level: 'Intermediário',
    is_premium: false,
    duration_minutes: 50,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: ['Barra', 'Halteres', 'Polia'],
    exercises: [
      { name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 60, muscle: 'Peito' },
      { name: 'Supino Inclinado Halteres', sets: 4, reps: 12, rest: 45, muscle: 'Peito Superior' },
      { name: 'Crossover Polia', sets: 3, reps: 15, rest: 30, muscle: 'Peito' },
      { name: 'Tríceps Pulley', sets: 4, reps: 12, rest: 45, muscle: 'Tríceps' },
      { name: 'Tríceps Testa Barra', sets: 3, reps: 12, rest: 45, muscle: 'Tríceps' }
    ]
  },
  {
    title: 'Costas e Bíceps',
    name: 'Costas e Bíceps',
    description: 'Treino para costas e bíceps',
    category: 'Musculação',
    level: 'Intermediário',
    is_premium: false,
    duration_minutes: 50,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: ['Barra', 'Halteres'],
    exercises: [
      { name: 'Puxada Alta', sets: 4, reps: 10, rest: 60, muscle: 'Costas' },
      { name: 'Remada Curvada', sets: 4, reps: 10, rest: 60, muscle: 'Costas' },
      { name: 'Rosca Direta', sets: 3, reps: 12, rest: 45, muscle: 'Bíceps' },
      { name: 'Rosca Alternada', sets: 3, reps: 12, rest: 45, muscle: 'Bíceps' }
    ]
  },
  {
    title: 'Pernas Completo',
    name: 'Pernas Completo',
    description: 'Treino completo de pernas',
    category: 'Musculação',
    level: 'Intermediário',
    is_premium: false,
    duration_minutes: 60,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: ['Barra', 'Máquina'],
    exercises: [
      { name: 'Agachamento Livre', sets: 4, reps: 10, rest: 90, muscle: 'Quadríceps' },
      { name: 'Leg Press', sets: 4, reps: 12, rest: 60, muscle: 'Quadríceps' },
      { name: 'Mesa Flexora', sets: 3, reps: 12, rest: 45, muscle: 'Posteriores' },
      { name: 'Extensora', sets: 3, reps: 15, rest: 30, muscle: 'Quadríceps' },
      { name: 'Gêmeos', sets: 4, reps: 20, rest: 30, muscle: 'Panturrilha' }
    ]
  },
  {
    title: 'HIIT Queima 30',
    name: "HIIT Queima 30'",
    description: 'Treino intervalado de alta intensidade',
    category: 'Cardio',
    level: 'Avançado',
    is_premium: true,
    duration_minutes: 30,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: [],
    exercises: [
      { name: 'Burpee', sets: 4, reps: 10, rest: 20, muscle: 'Corpo todo' },
      { name: 'Mountain Climber', sets: 4, reps: 20, rest: 20, muscle: 'Core' },
      { name: 'Jumping Jack', sets: 4, reps: 30, rest: 20, muscle: 'Cardio' },
      { name: 'Agachamento com Salto', sets: 4, reps: 15, rest: 20, muscle: 'Pernas' }
    ]
  },
  {
    title: 'Cardio LISS 40',
    name: "Cardio LISS 40'",
    description: 'Cardio de baixa intensidade para resistência',
    category: 'Cardio',
    level: 'Iniciante',
    is_premium: false,
    duration_minutes: 40,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: [],
    exercises: [
      { name: 'Caminhada Rápida', sets: 1, reps: 1, rest: 0, muscle: 'Cardio' },
      { name: 'Corrida Leve', sets: 1, reps: 1, rest: 0, muscle: 'Cardio' }
    ]
  },
  {
    title: 'Calistenia Básica',
    name: 'Calistenia Básica',
    description: 'Treino introdutório com peso corporal',
    category: 'Calistenia',
    level: 'Iniciante',
    is_premium: false,
    duration_minutes: 40,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: [],
    exercises: [
      { name: 'Flexão de Joelhos', sets: 3, reps: 10, rest: 60, muscle: 'Peito' },
      { name: 'Agachamento Livre', sets: 3, reps: 15, rest: 60, muscle: 'Pernas' },
      { name: 'Prancha', sets: 3, reps: 30, rest: 45, muscle: 'Core' },
      { name: 'Australian Pull-up', sets: 3, reps: 8, rest: 60, muscle: 'Costas' }
    ]
  },
  {
    title: 'Yoga Matinal',
    name: 'Yoga Matinal',
    description: 'Sessão de yoga para começar o dia',
    category: 'Flexibilidade',
    level: 'Iniciante',
    is_premium: false,
    duration_minutes: 35,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    equipment: ['Tapete'],
    exercises: [
      { name: 'Saudação ao Sol', sets: 3, reps: 5, rest: 15, muscle: 'Corpo todo' },
      { name: 'Postura da Cobra', sets: 3, reps: 10, rest: 15, muscle: 'Lombar' },
      { name: 'Downward Dog', sets: 3, reps: 10, rest: 15, muscle: 'Costas' }
    ]
  }
];

async function seedWorkouts() {
  console.log('--- Iniciando seed de treinos dinâmico ---');

  try {
    // 1. Obter colunas existentes na tabela workouts
    const { data: testRow, error: testError } = await supabase
      .from('workouts')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Erro ao inspecionar a tabela workouts:', testError.message);
      return;
    }

    const availableColumns = testRow && testRow.length > 0
      ? Object.keys(testRow[0])
      : ['id', 'title', 'description', 'category', 'level', 'duration_minutes', 'video_url', 'thumbnail_url', 'tags', 'created_at'];

    console.log('Colunas disponíveis no banco de dados:', availableColumns);

    // 2. Filtrar dados do seed para manter apenas colunas que existem
    const filteredWorkouts = workoutsToSeed.map(w => {
      const cleanWorkout = {};
      Object.keys(w).forEach(key => {
        if (availableColumns.includes(key)) {
          cleanWorkout[key] = w[key];
        }
      });
      return cleanWorkout;
    });

    // 3. Limpar treinos antigos
    const { error: deleteError } = await supabase
      .from('workouts')
      .delete()
      .neq('title', '');

    if (deleteError) {
      console.warn('Nota: Erro ao tentar limpar treinos antigos:', deleteError.message);
    } else {
      console.log('✅ Treinos antigos limpos com sucesso.');
    }

    // 4. Inserir treinos filtrados
    const { data, error } = await supabase
      .from('workouts')
      .insert(filteredWorkouts)
      .select();

    if (error) {
      console.error('❌ Erro ao inserir treinos:', error.message);
    } else {
      console.log(`✅ ${data.length} treinos semeados com sucesso (com as colunas disponíveis)!`);
      console.log('Treino inserido de exemplo:', JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('❌ Falha crítica ao rodar o seeder:', err);
  }
}

seedWorkouts();
