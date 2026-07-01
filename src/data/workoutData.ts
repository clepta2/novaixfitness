// src/data/workoutData.ts
// Dados de treinos

import type { Workout, WorkoutCategory, FallbackWorkout, DemoWorkout } from './workoutTypes';

const placeholder = (text: string, color = '1E232A', textColor = 'CCFF00'): string =>
  `https://placehold.co/300x200/${color}/${textColor}?text=${encodeURIComponent(text)}&font=montserrat`;

export const workoutData: Record<string, Workout> = {
  '1': {
    id: '1', name: 'Peito e Triceps', category: 'MUSCULACAO', level: 'Intermediario', duration: 50,
    description: 'Treino focado em hipertrofia para peito e triceps com exercicios compostos e isolados.',
    videoId: 'dQw4w9WgXcQ', equipment: ['Barra', 'Halteres', 'Polia'],
    exercises: [
      {
        id: '1', name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 60, muscle: 'Peito', equipment: 'Barra',
        steps: [
          { step: 1, text: 'Deite-se no banco com os pes apoiados no chao. Segure a barra com pegada ligeiramente mais larga que os ombros.', image: placeholder('Passo 1') },
          { step: 2, text: 'Retire a barra do suporte e posicione-a acima do peito com bracos estendidos.', image: placeholder('Passo 2') },
          { step: 3, text: 'Desca a barra controladamente ate tocar levemente o meio do peito. Cotovelos a 45.', image: placeholder('Passo 3') },
          { step: 4, text: 'Empurre a barra para cima ate a posicao inicial, contraindo o peitoral no topo.', image: placeholder('Passo 4') },
        ],
        tips: ['Mantenha as escapulas juntas no banco', 'Nao trave os cotovelos no topo', 'Respire ao descer, expire ao subir'],
        mistakes: ['Bater a barra no peito', 'Tirar o bumbum do banco', 'Cotovelos abrindo demais'],
        alternatives: [
          { name: 'Supino com Halteres', level: 'Iniciante', reason: 'Se nao tiver barra' },
          { name: 'Flexao no chao', level: 'Iniciante', reason: 'Peso corporal' },
        ],
      },
      {
        id: '2', name: 'Supino Inclinado Halteres', sets: 4, reps: 12, rest: 45, muscle: 'Peito Superior', equipment: 'Halteres',
        steps: [
          { step: 1, text: 'Ajuste o banco em 30-45 graus. Sente-se com halteres nas coxas.', image: placeholder('Passo 1', '1E232A', '6366F1') },
          { step: 2, text: 'Deite-se levantando os halteres com um impulso dos joelhos.', image: placeholder('Passo 2', '1E232A', '6366F1') },
          { step: 3, text: 'Desca os halteres controladamente ate sentir alongamento no peito.', image: placeholder('Passo 3', '1E232A', '6366F1') },
          { step: 4, text: 'Empurre os halteres para cima e levemente para dentro.', image: placeholder('Passo 4', '1E232A', '6366F1') },
        ],
        tips: ['Controle a descida por 2-3 segundos', 'Nao bata os halteres no topo', 'Mantenha os pes firmes'],
        mistakes: ['Usar impulso do corpo', 'Deixar os cotovelos abrirem', 'Descer rapido demais'],
        alternatives: [{ name: 'Supino Inclinado Barra', level: 'Intermediario', reason: 'Mais carga' }],
      },
      {
        id: '3', name: 'Crossover Polia', sets: 3, reps: 15, rest: 30, muscle: 'Peito', equipment: 'Polia',
        steps: [
          { step: 1, text: 'Posicione-se no meio das polias. Pegue as alcas com bracos abertos.', image: placeholder('Passo 1', '1E232A', '00E676') },
          { step: 2, text: 'De um passo a frente para sentir tracao no peito.', image: placeholder('Passo 2', '1E232A', '00E676') },
          { step: 3, text: 'Traga as maos juntas a frente do peito, contraindo o peitoral.', image: placeholder('Passo 3', '1E232A', '00E676') },
          { step: 4, text: 'Volte controladamente a posicao inicial.', image: placeholder('Passo 4', '1E232A', '00E676') },
        ],
        tips: ['Contria no final do movimento', 'Mantenha levemente os cotovelos flexionados', 'Nao use impulso'],
        mistakes: ['Peso excessivo', 'Movimento rapido', 'Cotovelos travados'],
        alternatives: [{ name: 'Crucifixo Maquina', level: 'Iniciante', reason: 'Mais estabilidade' }],
      },
    ],
  },
  '2': {
    id: '2', name: 'HIIT Queima 30', category: 'CARDIO', level: 'Avancado', duration: 30,
    description: 'Treino intervalado de alta intensidade para queima maxima de gordura.',
    videoId: 'dQw4w9WgXcQ', equipment: [],
    exercises: [
      { id: '1', name: 'Burpee', sets: 4, reps: 10, rest: 20, muscle: 'Corpo todo',
        steps: [{ step: 1, text: 'Em pe, agache e coloque as maos no chao.', image: placeholder('Passo 1', '1E232A', 'FF6B35') },
          { step: 2, text: 'Jogue as pernas para tras em posicao de prancha.', image: placeholder('Passo 2', '1E232A', 'FF6B35') }],
        tips: ['Seja explosivo', 'Mantenha o ritmo'], mistakes: ['Ficar devagar'], alternatives: [] },
      { id: '2', name: 'Mountain Climber', sets: 4, reps: 20, rest: 20, muscle: 'Core',
        steps: [{ step: 1, text: 'Posicao de prancha.', image: placeholder('Passo 1', '1E232A', 'FFD600') }],
        tips: ['Rapido e controlado'], mistakes: ['Levantar muito o bumbum'], alternatives: [] },
    ],
  },
  '3': {
    id: '3', name: 'Calistenia Basica', category: 'CALISTENIA', level: 'Iniciante', duration: 40,
    description: 'Treino introdutorio com exercicios de peso corporal para construir base.',
    videoId: 'dQw4w9WgXcQ', equipment: [],
    exercises: [
      { id: '1', name: 'Flexao de Joelhos', sets: 3, reps: 10, rest: 60, muscle: 'Peito',
        steps: [{ step: 1, text: 'Apoie os joelhos no chao.', image: placeholder('Passo 1') }],
        tips: ['Corpo reto'], mistakes: ['Barriga caida'], alternatives: [] },
      { id: '2', name: 'Agachamento Livre', sets: 3, reps: 15, rest: 60, muscle: 'Pernas',
        steps: [{ step: 1, text: 'Fique em pe com pes na largura dos ombros.', image: placeholder('Passo 1', '1E232A', '00E676') }],
        tips: ['Joelhos na direcao dos pes'], mistakes: ['Joelhos para dentro'], alternatives: [] },
    ],
  },
};

export const fallbackWorkout: FallbackWorkout = {
  id: '1', name: 'Peito e Triceps', category: 'MUSCULACAO', level: 'Intermediario', duration: 50,
  description: 'Treino focado em hipertrofia para peito e triceps.',
  video_id: 'dQw4w9WgXcQ', equipment: ['Barra', 'Halteres', 'Polia'],
  exercises: [
    { id: '1', name: 'Supino Reto Barra', sets: 4, reps: 10, rest: 60, muscle: 'Peito' },
    { id: '2', name: 'Supino Inclinado Halteres', sets: 4, reps: 12, rest: 45, muscle: 'Peito Superior' },
    { id: '3', name: 'Crossover Polia', sets: 3, reps: 15, rest: 30, muscle: 'Peito' },
  ],
};

export const categories: WorkoutCategory[] = [
  { id: 'musculacao', label: 'MUSCULACAO', icon: 'barbell-outline', description: 'Hipertrofia e forca', count: 42, color: '#6366F1' },
  { id: 'calistenia', label: 'CALISTENIA', icon: 'body-outline', description: 'Peso corporal', count: 28, color: '#00E676' },
  { id: 'cardio', label: 'CARDIO', icon: 'heart-outline', description: 'HIIT, Tabata, LISS', count: 18, color: '#FF6B35' },
  { id: 'flexibilidade', label: 'FLEXIBILIDADE', icon: 'leaf-outline', description: 'Alongamento e mobilidade', count: 15, color: '#8B5CF6' },
];

export const DEMO_WORKOUT: DemoWorkout = {
  id: 'demo', name: 'Treino Full Body', duration: 45, videoId: 'dQw4w9WgXcQ',
  exercises: [
    { name: 'Supino Reto', sets: 4, reps: 10, rest: 60 },
    { name: 'Agachamento', sets: 4, reps: 12, rest: 60 },
    { name: 'Remada Curvada', sets: 4, reps: 10, rest: 60 },
    { name: 'Desenvolvimento', sets: 3, reps: 12, rest: 45 },
    { name: 'Burpee', sets: 3, reps: 15, rest: 30 },
  ],
};
