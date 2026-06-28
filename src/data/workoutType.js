// src/data/workoutType.js
// O USUÁRIO escolhe apenas o TIPO de treino
// A IA decide os exercícios, séries, etc.

export const WORKOUT_TYPES = [
  {
    id: 'academia',
    label: 'Academia',
    description: 'Treino com equipamentos e peso',
    icon: 'barbell',
    color: '#6366F1',
    whatYouNeed: ['Tênis', 'Roupa confortável', 'Garrafa de água'],
    whatYouGet: ['Exercícios com carga', 'Progressão de carga', 'Músculos definidos'],
    examples: ['Supino, Agachamento, Leg Press, Puxada'],
  },
  {
    id: 'calistenia',
    label: 'Calistenia',
    description: 'Treino com peso corporal',
    icon: 'body',
    color: '#00E676',
    whatYouNeed: ['Barra fixa (opcional)', 'Chão', 'Corpo'],
    whatYouGet: ['Força funcional', 'Flexibilidade', 'Controle corporal'],
    examples: ['Flexão, Agachamento, Barra, Muscle-up'],
  },
  {
    id: 'yoga',
    label: 'Yoga',
    description: 'Flexibilidade, equilíbrio e mente',
    icon: 'leaf',
    color: '#8B5CF6',
    whatYouNeed: ['Estojo', 'Roupa confortável', 'Espaço tranquilo'],
    whatYouGet: ['Flexibilidade', 'Equilíbrio', 'Redução de estresse'],
    examples: ['Saudação ao Sol, Árvore, Guerreiro, Loto'],
  },
];

export function getWorkoutTypeInfo(typeId) {
  return WORKOUT_TYPES.find(t => t.id === typeId);
}
