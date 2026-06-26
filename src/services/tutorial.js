// src/services/tutorial.js
// Serviço de tutorial interativo - NOVAIX FITNESS

import { supabase } from '../config/supabase';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'BEM-VINDO AO NOVAIX!',
    description: 'Vamos te mostrar como usar o app. Leva menos de 1 minuto!',
    icon: 'rocket',
    screen: 'home',
  },
  {
    id: 'daily_workout',
    title: 'TREINO DO DIA',
    description: 'Aqui aparece seu treino diário. Toque para começar!',
    icon: 'barbell',
    screen: 'home',
    target: 'dailyWorkout',
  },
  {
    id: 'categories',
    title: 'CATEGORIAS',
    description: 'Explore treinos por categoria: Musculação, Cardio, Flexibilidade...',
    icon: 'grid',
    screen: 'home',
    target: 'categories',
  },
  {
    id: 'player',
    title: 'PLAYER DE TREINO',
    description: 'Assista aos vídeos e acompanhe o timer durante o treino.',
    icon: 'play-circle',
    screen: 'player',
    target: 'player',
  },
  {
    id: 'library',
    title: 'BIBLIOTECA',
    description: 'Explore todos os treinos disponíveis e salve seus favoritos.',
    icon: 'library',
    screen: 'library',
    target: 'library',
  },
  {
    id: 'profile',
    title: 'SEU PERFIL',
    description: 'Acompanhe sua evolução, conquistas e configurações.',
    icon: 'person',
    screen: 'profile',
    target: 'profile',
  },
  {
    id: 'complete',
    title: 'PRONTO!',
    description: 'Agora você está pronto para começar sua jornada. Bons treinos!',
    icon: 'checkmark-circle',
    screen: 'home',
  },
];

export async function hasCompletedTutorial(userId) {
  if (!userId) return false;

  const { data } = await supabase
    .from('profiles')
    .select('tutorial_completed')
    .eq('id', userId)
    .single();

  return data?.tutorial_completed === true;
}

export async function completeTutorial(userId) {
  if (!userId) return;

  await supabase
    .from('profiles')
    .update({ tutorial_completed: true })
    .eq('id', userId);
}

export async function markTutorialSkipped(userId) {
  if (!userId) return;

  await supabase
    .from('profiles')
    .update({ tutorial_skipped: true })
    .eq('id', userId);
}

export function getTutorialSteps() {
  return TUTORIAL_STEPS;
}

export function getStepForScreen(screenName) {
  return TUTORIAL_STEPS.filter(step => step.screen === screenName);
}
