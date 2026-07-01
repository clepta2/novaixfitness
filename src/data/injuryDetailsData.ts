// src/data/injuryDetailsData.ts
// Dados de lesões e humor

import type { InjuryDetail, SeverityLevel, MoodOption, MoodAdjustment } from './injuryDetailsTypes';

export const INJURY_DETAILS: Record<string, InjuryDetail> = {
  knee: {
    label: 'Joelho', icon: 'body', description: 'Dor, instabilidade ou limitacao no joelho', bodyRegion: 'Perna - Articulacao do joelho',
    limitations: ['Evitar agachamento profundo', 'Evitar leg press pesado', 'Evitar exercicios com salto'],
    safeAlternatives: ['Leg press parcial (45 graus)', 'Cadeira extensora leve', 'Bike/Eliptico'],
    followUpQuestions: ['A dor e constante ou so ao se movimentar?', 'Ha quanto tempo sente essa dor?', 'Ja fez algum tratamento?'],
  },
  back: {
    label: 'Coluna/Lombar', icon: 'body', description: 'Dor na lombar, hernia de disco ou rigidez', bodyRegion: 'Tronco - Coluna vertebral',
    limitations: ['Evitar deadlift pesado', 'Evitar good morning', 'Evitar hiperextensao'],
    safeAlternatives: ['Leg press', 'Mesa flexora', 'Puxada frontal'],
    followUpQuestions: ['A dor e aguda ou cronica?', 'Sentir dor ao sentar por muito tempo?', 'Ja tem diagnostico medico?'],
  },
  shoulder: {
    label: 'Ombro', icon: 'body', description: 'Dor no ombro, manguito rotador ou instabilidade', bodyRegion: 'Braco - Articulacao do ombro',
    limitations: ['Evitar desenvolvimento acima da cabeca', 'Evitar elevacao lateral pesada', 'Evitar crucifixo com bracos retos'],
    safeAlternatives: ['Desenvolvimento na maquina', 'Elevacao lateral com halteres leves', 'Face pull'],
    followUpQuestions: ['A dor e ao levantar o braco ou em repouso?', 'Sente estalos ou travamentos?', 'Ja fez exames de imagem?'],
  },
  hip: {
    label: 'Quadril', icon: 'body', description: 'Dor no quadril, bursite ou limitacao de movimento', bodyRegion: 'Tronco - Articulacao do quadril',
    limitations: ['Evitar agachamento profundo', 'Evitar afundo longo', 'Evitar leg press muito baixo'],
    safeAlternatives: ['Leg press parcial', 'Cadeira extensora', 'Abducao de quadril'],
    followUpQuestions: ['A dor e ao caminhar ou em repouso?', 'Sente rigidez pela manha?', 'Ja fez tratamento para bursite?'],
  },
  wrist: {
    label: 'Punho', icon: 'body', description: 'Dor no punho, tendinite ou limitacao de pegada', bodyRegion: 'Braco - Articulacao do punho',
    limitations: ['Evitar rosca direta pesada', 'Evitar extensao de punho', 'Evitar flexao de punho'],
    safeAlternatives: ['Rosca martelo', 'Rosca concentrada', 'Pegada aberta no supino'],
    followUpQuestions: ['A dor e ao segurar peso ou em repouso?', 'Sente formigamento ou dormencia?', 'Ja fez tratamento para tendinite?'],
  },
  ankle: {
    label: 'Tornozelo', icon: 'body', description: 'Dor, torcao ou instabilidade no tornozelo', bodyRegion: 'Perna - Articulacao do tornozelo',
    limitations: ['Evitar saltos', 'Evitar esteira em inclinacao', 'Evitar agachamento com elevacao do calcanhar'],
    safeAlternatives: ['Bike', 'Eliptico', 'Leg press'],
    followUpQuestions: ['A dor e ao caminhar ou ao correr?', 'Sente instabilidade?', 'Ja teve entorse anterior?'],
  },
  neck: {
    label: 'Pescoco', icon: 'body', description: 'Dor cervical, torticolis ou rigidez', bodyRegion: 'Tronco - Coluna cervical',
    limitations: ['Evitar exercicios com carga na cabeca', 'Evitar prancha com cabeca caida'],
    safeAlternatives: ['Prancha com cabeca neutra', 'Exercicios de mobilidade cervical'],
    followUpQuestions: ['A dor e ao girar o pescoco ou em repouso?', 'Sente dores de cabeca frequentes?', 'Trabalha olhando para tela?'],
  },
};

export const SEVERITY_LEVELS: Record<string, SeverityLevel> = {
  mild: { label: 'Leve', description: 'Incomoda mas nao impede movimentos', estimatedRecovery: '1-2 semanas', canTrain: true },
  moderate: { label: 'Moderado', description: 'Dificulta exercicios especificos', estimatedRecovery: '2-4 semanas', canTrain: true },
  severe: { label: 'Grave', description: 'Impede muitos movimentos', estimatedRecovery: '4+ semanas', canTrain: false },
};

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'great', label: 'Otimo', emoji: '🤩', color: '#00E676' },
  { id: 'good', label: 'Bom', emoji: '😊', color: '#3B82F6' },
  { id: 'regular', label: 'Regular', emoji: '😐', color: '#FFD600' },
  { id: 'bad', label: 'Ruim', emoji: '😟', color: '#FF9800' },
  { id: 'terrible', label: 'Pessimo', emoji: '😭', color: '#FF1744' },
];

export const MOOD_ADJUSTMENTS: Record<string, MoodAdjustment> = {
  great: { volumeChange: 0.1, intensityChange: 0.1, message: 'Vamos arrasar! Treino intensificado' },
  good: { volumeChange: 0, intensityChange: 0, message: 'Bora! Treino padrao' },
  regular: { volumeChange: 0, intensityChange: -0.1, message: 'Tranquilo, vamos manter o ritmo' },
  bad: { volumeChange: -0.2, intensityChange: -0.2, message: 'Vamos reduzir um pouco, ok?' },
  terrible: { volumeChange: -0.5, intensityChange: -0.5, message: 'Hoje e dia de descanso ativo' },
};
