// src/services/share.js
// Serviço de compartilhamento - NOVAIX FITNESS

import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { APP_CONFIG } from '../config/app';

const WEBSITE_URL = APP_CONFIG.links.website;

export async function shareWorkout(workout) {
  if (!workout) return;

  const message = `💪 Treine com o NOVAIX Fitness!\n\n` +
    `Treino: ${workout.name}\n` +
    `Categoria: ${workout.category || 'Treino'}\n` +
    `Duração: ${workout.duration || 45} min\n` +
    `Nível: ${workout.level || 'Intermediário'}\n\n` +
    `Baixe agora: ${WEBSITE_URL}`;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(message, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar treino',
      });
    } else {
      Alert.alert('Compartilhar', message);
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
}

export async function shareAchievement(achievement) {
  if (!achievement) return;

  const message = `🏆 Conquista desbloqueada no NOVAIX Fitness!\n\n` +
    `${achievement.icon || '🎉'} ${achievement.name}\n` +
    `${achievement.description || ''}\n\n` +
    `Baixe: ${WEBSITE_URL}`;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(message, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar conquista',
      });
    }
  } catch (error) {
    console.error('Erro ao compartilhar conquista:', error);
  }
}

export async function shareProgress(stats) {
  if (!stats) return;

  const message = `📊 Meu progresso no NOVAIX Fitness:\n\n` +
    `🔥 Streak: ${stats.streak} dias\n` +
    `💪 Treinos: ${stats.totalWorkouts}\n` +
    `⏱️ Tempo total: ${stats.totalMinutes} min\n\n` +
    `Baixe: ${WEBSITE_URL}`;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(message, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar progresso',
      });
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
}
