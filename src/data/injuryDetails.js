// src/data/injuryDetails.js
// Detalhes de lesões - NOVAIX FITNESS

export const INJURY_DETAILS = {
  knee: {
    label: 'Joelho',
    icon: 'body',
    description: 'Dor, instabilidade ou limitação no joelho',
    bodyRegion: 'Perna - Articulação do joelho',
    limitations: [
      'Evitar agachamento profundo',
      'Evitar leg press pesado',
      'Evitar exercícios com salto',
    ],
    safeAlternatives: [
      'Leg press parcial (45°)',
      'Cadeira extensora leve',
      'Bike/Elíptico',
    ],
    followUpQuestions: [
      'A dor é constante ou só ao se movimentar?',
      'Há quanto tempo sente essa dor?',
      'Já fez algum tratamento?',
    ],
  },
  back: {
    label: 'Coluna/Lombar',
    icon: 'body',
    description: 'Dor na lombar, hérnia de disco ou rigidez',
    bodyRegion: 'Tronco - Coluna vertebral',
    limitations: [
      'Evitar deadlift pesado',
      'Evitar good morning',
      'Evitar hiperextensão',
    ],
    safeAlternatives: [
      'Leg press',
      'Mesa flexora',
      'Puxada frontal',
    ],
    followUpQuestions: [
      'A dor é aguda ou crônica?',
      'Sentir dor ao sentar por muito tempo?',
      'Já tem diagnóstico médico?',
    ],
  },
  shoulder: {
    label: 'Ombro',
    icon: 'body',
    description: 'Dor no ombro, manguito rotador ou instabilidade',
    bodyRegion: 'Braço - Articulação do ombro',
    limitations: [
      'Evitar desenvolvimento acima da cabeça',
      'Evitar elevação lateral pesada',
      'Evitar crucifixo com braços retos',
    ],
    safeAlternatives: [
      'Desenvolvimento na máquina',
      'Elevação lateral com halteres leves',
      'Face pull',
    ],
    followUpQuestions: [
      'A dor é ao levantar o braço ou em repouso?',
      'Sente estalos ou travamentos?',
      'Já fez exames de imagem?',
    ],
  },
  hip: {
    label: 'Quadril',
    icon: 'body',
    description: 'Dor no quadril, bursite ou limitação de movimento',
    bodyRegion: 'Tronco - Articulação do quadril',
    limitations: [
      'Evitar agachamento profundo',
      'Evitar afundo longo',
      'Evitar leg press muito baixo',
    ],
    safeAlternatives: [
      'Leg press parcial',
      'Cadeira extensora',
      'Abdução de quadril',
    ],
    followUpQuestions: [
      'A dor é ao caminhar ou em repouso?',
      'Sente rigidez pela manhã?',
      'Já fez tratamento para bursite?',
    ],
  },
  wrist: {
    label: 'Punho',
    icon: 'body',
    description: 'Dor no punho, tendinite ou limitação de pegada',
    bodyRegion: 'Braço - Articulação do punho',
    limitations: [
      'Evitar rosca direta pesada',
      'Evitar extensão de punho',
      'Evitar flexão de punho',
    ],
    safeAlternatives: [
      'Rosca martelo',
      'Rosca concentrada',
      'Pegada aberta no supino',
    ],
    followUpQuestions: [
      'A dor é ao segurar peso ou em repouso?',
      'Sente formigamento ou dormência?',
      'Já fez tratamento para tendinite?',
    ],
  },
  ankle: {
    label: 'Tornozelo',
    icon: 'body',
    description: 'Dor, torção ou instabilidade no tornozelo',
    bodyRegion: 'Perna - Articulação do tornozelo',
    limitations: [
      'Evitar saltos',
      'Evitar esteira em inclinação',
      'Evitar agachamento com elevação do calcanhar',
    ],
    safeAlternatives: [
      'Bike',
      'Elíptico',
      'Leg press',
    ],
    followUpQuestions: [
      'A dor é ao caminhar ou ao correr?',
      'Sente instabilidade?',
      'Já teve entorse anterior?',
    ],
  },
  neck: {
    label: 'Pescoço',
    icon: 'body',
    description: 'Dor cervical, torticolis ou rigidez',
    bodyRegion: 'Tronco - Coluna cervical',
    limitations: [
      'Evitar exercícios com carga na cabeça',
      'Evitar prancha com cabeça caída',
    ],
    safeAlternatives: [
      'Prancha com cabeça neutra',
      'Exercícios de mobilidade cervical',
    ],
    followUpQuestions: [
      'A dor é ao girar o pescoço ou em repouso?',
      'Sente dores de cabeça frequentes?',
      'Trabalha olhando para tela?',
    ],
  },
};

export const SEVERITY_LEVELS = {
  mild: { label: 'Leve', description: 'Incomoda mas não impede movimentos', estimatedRecovery: '1-2 semanas', canTrain: true },
  moderate: { label: 'Moderado', description: 'Dificulta exercícios específicos', estimatedRecovery: '2-4 semanas', canTrain: true },
  severe: { label: 'Grave', description: 'Impede muitos movimentos', estimatedRecovery: '4+ semanas', canTrain: false },
};

export const MOOD_OPTIONS = [
  { id: 'great', label: 'Ótimo', emoji: '??', color: '#00E676' },
  { id: 'good', label: 'Bom', emoji: '??', color: '#3B82F6' },
  { id: 'regular', label: 'Regular', emoji: '??', color: '#FFD600' },
  { id: 'bad', label: 'Ruim', emoji: '??', color: '#FF9800' },
  { id: 'terrible', label: 'Péssimo', emoji: '??', color: '#FF1744' },
];

export const MOOD_ADJUSTMENTS = {
  great: { volumeChange: 0.1, intensityChange: 0.1, message: 'Vamos arrasar! Treino intensificado' },
  good: { volumeChange: 0, intensityChange: 0, message: 'Bora! Treino padrão' },
  regular: { volumeChange: 0, intensityChange: -0.1, message: 'Tranquilo, vamos manter o ritmo' },
  bad: { volumeChange: -0.2, intensityChange: -0.2, message: 'Vamos reduzir um pouco, ok?' },
  terrible: { volumeChange: -0.5, intensityChange: -0.5, message: 'Hoje é dia de descanso ativo' },
};
