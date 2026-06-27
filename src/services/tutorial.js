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
    id: 'contextual_card',
    title: 'SEU PLANO DO DIA',
    description: 'O card muda conforme a hora do dia: aquecimento, treino ou recuperação.',
    icon: 'sunny',
    screen: 'home',
    target: 'contextualCard',
  },
  {
    id: 'categories',
    title: 'CATEGORIAS',
    description: 'Explore treinos por grupo muscular ou tipo de exercício.',
    icon: 'grid',
    screen: 'home',
    target: 'categories',
  },
  {
    id: 'voice_coach',
    title: 'TREINADOR POR VOZ',
    description: 'Ative nas configurações para ouvir instruções durante o treino.',
    icon: 'mic',
    screen: 'home',
    target: 'header',
  },
  {
    id: 'notifications',
    title: 'NOTIFICAÇÕES',
    description: 'Escolha quais notificações quer receber nas Configurações.',
    icon: 'notifications',
    screen: 'home',
    target: 'header',
  },
  {
    id: 'complete',
    title: 'PRONTO!',
    description: 'Você está preparado. Bons treinos!',
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

  try {
    await supabase
      .from('profiles')
      .update({ tutorial_completed: true })
      .eq('id', userId);
  } catch (err) {
    console.error('Erro ao completar tutorial:', err);
  }
}

export async function markTutorialSkipped(userId) {
  if (!userId) return;

  try {
    await supabase
      .from('profiles')
      .update({ tutorial_skipped: true })
      .eq('id', userId);
  } catch (err) {
    console.error('Erro ao marcar tutorial como pulado:', err);
  }
}

export function getTutorialSteps() {
  return TUTORIAL_STEPS;
}

export function getStepForScreen(screenName) {
  return TUTORIAL_STEPS.filter(step => step.screen === screenName);
}
