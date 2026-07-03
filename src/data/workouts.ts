// src/data/workouts.ts
// Dados de treinos - NOVAIX FITNESS

const placeholder = (text: string, color: string = '1E232A', textColor: string = 'CCFF00') =>
  `https://placehold.co/300x200/${color}/${textColor}?text=${encodeURIComponent(text)}&font=montserrat`;

interface ExerciseStep {
  step: number;
  text: string;
  image: string;
}

interface ExerciseAlternative {
  name: string;
  level: string;
  reason: string;
}

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  muscle: string;
  equipment?: string;
  steps: ExerciseStep[];
  tips?: string[];
  mistakes?: string[];
  alternatives?: ExerciseAlternative[];
}

interface Workout {
  id: string;
  name: string;
  category: string;
  level: string;
  duration: number;
  description: string;
  videoId: string;
  equipment: string[];
  exercises: WorkoutExercise[];
}

export const workoutData: Record<string, Workout> = {
  '1': {
    id: '1',
    name: 'Peito e Tríceps',
    category: 'MUSCULAÇÃO',
    level: 'Intermediário',
    duration: 50,
    description: 'Treino focado em hipertrofia para peito e tríceps com exercícios compostos e isolados.',
    videoId: 'dQw4w9WgXcQ',
    equipment: ['Barra', 'Halteres', 'Polia'],
    exercises: [
      {
        id: '1',
        name: 'Supino Reto Barra',
        sets: 4,
        reps: 10,
        rest: 60,
        muscle: 'Peito',
        equipment: 'Barra',
        steps: [
          { step: 1, text: 'Deite-se no banco com os pés apoiados no chão. Segure a barra com pegada ligeiramente mais larga que os ombros.', image: placeholder('Passo 1') },
          { step: 2, text: 'Retire a barra do suporte e posicione-a acima do peito com braços estendidos.', image: placeholder('Passo 2') },
          { step: 3, text: 'Desça a barra controladamente até tocar levemente o meio do peito. Cotovelos a 45°.', image: placeholder('Passo 3') },
          { step: 4, text: 'Empurre a barra para cima até a posição inicial, contraindo o peitoral no topo.', image: placeholder('Passo 4') },
        ],
        tips: ['Mantenha as escápulas juntas no banco', 'Não trave os cotovelos no topo', 'Respire ao descer, expire ao subir'],
        mistakes: ['Bater a barra no peito', 'Tirar o bumbum do banco', 'Cotovelos abrindo demais'],
        alternatives: [
          { name: 'Supino com Halteres', level: 'Iniciante', reason: 'Se não tiver barra' },
          { name: 'Flexão no chão', level: 'Iniciante', reason: 'Peso corporal' },
          { name: 'Supino Máquina', level: 'Iniciante', reason: 'Mais segurança' },
        ],
      },
      {
        id: '2',
        name: 'Supino Inclinado Halteres',
        sets: 4,
        reps: 12,
        rest: 45,
        muscle: 'Peito Superior',
        equipment: 'Halteres',
        steps: [
          { step: 1, text: 'Ajuste o banco em 30-45°. Sente-se com halteres nas coxas.', image: placeholder('Passo 1', '1E232A', '6366F1') },
          { step: 2, text: 'Deite-se levantando os halteres com um impulso dos joelhos.', image: placeholder('Passo 2', '1E232A', '6366F1') },
          { step: 3, text: 'Desça os halteres controladamente até sentir alongamento no peito.', image: placeholder('Passo 3', '1E232A', '6366F1') },
          { step: 4, text: 'Empurre os halteres para cima e levemente para dentro.', image: placeholder('Passo 4', '1E232A', '6366F1') },
        ],
        tips: ['Controle a descida por 2-3 segundos', 'Não bata os halteres no topo', 'Mantenha os pés firmes'],
        mistakes: ['Usar impulso do corpo', 'Deixar os cotovelos abrirem', 'Descer rápido demais'],
        alternatives: [
          { name: 'Supino Inclinado Barra', level: 'Intermediário', reason: 'Mais carga' },
          { name: 'Flexão Elevada', level: 'Iniciante', reason: 'Peso corporal' },
        ],
      },
      {
        id: '3',
        name: 'Crossover Polia',
        sets: 3,
        reps: 15,
        rest: 30,
        muscle: 'Peito',
        equipment: 'Polia',
        steps: [
          { step: 1, text: 'Posicione-se no meio das polias. Pegue as alças com braços abertos.', image: placeholder('Passo 1', '1E232A', '00E676') },
          { step: 2, text: 'Dê um passo à frente para sentir tração no peito.', image: placeholder('Passo 2', '1E232A', '00E676') },
          { step: 3, text: 'Traga as mãos juntas à frente do peito, contraindo o peitoral.', image: placeholder('Passo 3', '1E232A', '00E676') },
          { step: 4, text: 'Volte controladamente à posição inicial.', image: placeholder('Passo 4', '1E232A', '00E676') },
        ],
        tips: ['Contria no final do movimento', 'Mantenha levemente os cotovelos flexionados', 'Não use impulso'],
        mistakes: ['Peso excessivo', 'Movimento rápido', 'Cotovelos travados'],
        alternatives: [
          { name: 'Flexão com Halteres', level: 'Iniciante', reason: 'Peso corporal' },
          { name: 'Crucifixo Máquina', level: 'Iniciante', reason: 'Mais estabilidade' },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'HIIT Queima 30\'',
    category: 'CARDIO',
    level: 'Avançado',
    duration: 30,
    description: 'Treino intervalado de alta intensidade para queima máxima de gordura.',
    videoId: 'dQw4w9WgXcQ',
    equipment: [],
    exercises: [
      { id: '1', name: 'Burpee', sets: 4, reps: 10, rest: 20, muscle: 'Corpo todo', steps: [{ step: 1, text: 'Em pé, agache e coloque as mãos no chão.', image: placeholder('Passo 1', '1E232A', 'FF6B35') }, { step: 2, text: 'Jogue as pernas para trás em posição de prancha.', image: placeholder('Passo 2', '1E232A', 'FF6B35') }, { step: 3, text: 'Faça uma flexão.', image: placeholder('Passo 3', '1E232A', 'FF6B35') }, { step: 4, text: 'Traga as pernas e salte explosivamente.', image: placeholder('Passo 4', '1E232A', 'FF6B35') }], tips: ['Seja explosivo', 'Mantenha o ritmo'], mistakes: ['Ficar devagar', 'Não flexionar o braço'], alternatives: [{ name: 'Agachamento com salto', level: 'Iniciante', reason: 'Versão simplificada' }] },
      { id: '2', name: 'Mountain Climber', sets: 4, reps: 20, rest: 20, muscle: 'Core', steps: [{ step: 1, text: 'Posição de prancha.', image: placeholder('Passo 1', '1E232A', 'FFD600') }, { step: 2, text: 'Alterne os joelhos em direção ao peito.', image: placeholder('Passo 2', '1E232A', 'FFD600') }], tips: ['Rápido e controlado'], mistakes: ['Levantar muito o bumbum'], alternatives: [{ name: 'Prancha com toque', level: 'Iniciante', reason: 'Mais leve' }] },
    ],
  },
  '3': {
    id: '3',
    name: 'Calistenia Básica',
    category: 'CALISTENIA',
    level: 'Iniciante',
    duration: 40,
    description: 'Treino introdutório com exercícios de peso corporal para construir base.',
    videoId: 'dQw4w9WgXcQ',
    equipment: [],
    exercises: [
      { id: '1', name: 'Flexão de Joelhos', sets: 3, reps: 10, rest: 60, muscle: 'Peito', steps: [{ step: 1, text: 'Apoie os joelhos no chão.', image: placeholder('Passo 1') }, { step: 2, text: 'Desça o peito até o chão.', image: placeholder('Passo 2') }], tips: ['Corpo reto'], mistakes: ['Barriga caída'], alternatives: [{ name: 'Flexão na parede', level: 'Iniciante', reason: 'Mais fácil' }] },
      { id: '2', name: 'Agachamento Livre', sets: 3, reps: 15, rest: 60, muscle: 'Pernas', steps: [{ step: 1, text: 'Fique em pé com pés na largura dos ombros.', image: placeholder('Passo 1', '1E232A', '00E676') }, { step: 2, text: 'Agache como se fosse sentar.', image: placeholder('Passo 2', '1E232A', '00E676') }], tips: ['Joelhos na direção dos pés'], mistakes: ['Joelhos para dentro'], alternatives: [] },
    ],
  },
};

export const fallbackWorkout = {
  id: '1', name: 'Peito e Tríceps', category: 'MUSCULAÇÃO', level: 'Intermediário', duration: 50,
  description: 'Treino focado em hipertrofia para peito e tríceps.',
  video_id: 'dQw4w9WgXcQ', equipment: ['Barra', 'Halteres', 'Polia'],
  exercises: [
    { id: '1', name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 60, muscle: 'Peito' },
    { id: '2', name: 'Supino Inclinado Halteres', sets: 4, reps: 12, rest: 45, muscle: 'Peito Superior' },
    { id: '3', name: 'Crossover Polia', sets: 3, reps: 15, rest: 30, muscle: 'Peito' },
  ],
};

interface WorkoutCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  count: number;
  color: string;
}

export const categories: WorkoutCategory[] = [
  { id: 'musculacao', label: 'MUSCULAÇÃO', icon: 'barbell-outline', description: 'Hipertrofia e força', count: 42, color: '#6366F1' },
  { id: 'calistenia', label: 'CALISTENIA', icon: 'body-outline', description: 'Peso corporal', count: 28, color: '#00E676' },
  { id: 'cardio', label: 'CARDIO', icon: 'heart-outline', description: 'HIIT, Tabata, LISS', count: 18, color: '#FF6B35' },
  { id: 'flexibilidade', label: 'FLEXIBILIDADE', icon: 'leaf-outline', description: 'Alongamento e mobilidade', count: 15, color: '#8B5CF6' },
];

interface DemoExercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

export const DEMO_WORKOUT = {
  id: 'demo',
  name: 'Treino Full Body',
  duration: 45,
  videoId: 'dQw4w9WgXcQ',
  exercises: [
    { name: 'Supino Reto', sets: 4, reps: 10, rest: 60 },
    { name: 'Agachamento', sets: 4, reps: 12, rest: 60 },
    { name: 'Remada Curvada', sets: 4, reps: 10, rest: 60 },
    { name: 'Desenvolvimento', sets: 3, reps: 12, rest: 45 },
    { name: 'Burpee', sets: 3, reps: 15, rest: 30 },
  ],
};
