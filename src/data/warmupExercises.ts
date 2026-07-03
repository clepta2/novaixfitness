// src/data/warmupExercises.ts
// Exercicios de aquecimento - NOVAIX FITNESS

interface WarmupExercise {
  name: string;
  duration: number;
  icon: string;
  desc: string;
}

export const WARMUP_EXERCISES: WarmupExercise[] = [
  { name: 'Rotação de Pescoço', duration: 30, icon: 'accessibility', desc: 'Gire lentamente em ambos os sentidos' },
  { name: 'Círculos de Braço', duration: 30, icon: 'body', desc: 'Círculos amplos para frente e trás' },
  { name: 'Agachamento Dinâmico', duration: 40, icon: 'walk', desc: 'Agache e suba devagar, 12 reps' },
  { name: 'Alongamento de Quadril', duration: 30, icon: 'fitness', desc: 'Estique cada lado por 15s' },
  { name: 'Jumping Jacks Leve', duration: 30, icon: 'pulse', desc: 'Pule abrindo braços e pernas' },
  { name: 'Mountain Climber Lento', duration: 30, icon: 'trending-up', desc: 'Alterne joelhos no peito, controle o ritmo' },
];
