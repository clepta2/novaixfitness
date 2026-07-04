import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { APP_CONFIG } from '../config/app';
import { tryIf } from '../utils/tryIf';

const WEBSITE_URL = APP_CONFIG.links.website;

export async function shareWorkout(workout) {
  if (!workout) return;

  const message = `💪 Treine com o NOVAIX Fitness!\n\n` +
    `Treino: ${workout.name}\n` +
    `Categoria: ${workout.category || 'Treino'}\n` +
    `Duracao: ${workout.duration || 45} min\n` +
    `Nivel: ${workout.level || 'Intermediario'}\n\n` +
    `Baixe agora: ${WEBSITE_URL}`;

  const result = await tryIf(async () => {
    if (await Sharing.isAvailableAsync()) {
      const fileUri = `${FileSystem.cacheDirectory ?? ''}novaix_share.txt`;
      await FileSystem.writeAsStringAsync(fileUri, message);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar treino',
      });
    } else {
      Alert.alert('Compartilhar', message);
    }
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok && __DEV__) console.error('Erro ao compartilhar:', result.error);
}

export async function shareAchievement(achievement) {
  if (!achievement) return;

  const message = `🏆 Conquista desbloqueada no NOVAIX Fitness!\n\n` +
    `${achievement.icon || '🎉'} ${achievement.name}\n` +
    `${achievement.description || ''}\n\n` +
    `Baixe: ${WEBSITE_URL}`;

  const result = await tryIf(async () => {
    if (await Sharing.isAvailableAsync()) {
      const fileUri = `${FileSystem.cacheDirectory ?? ''}novaix_achievement.txt`;
      await FileSystem.writeAsStringAsync(fileUri, message);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar conquista',
      });
    }
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok && __DEV__) console.error('Erro ao compartilhar conquista:', result.error);
}

export async function shareProgress(stats) {
  if (!stats) return;

  const message = `📊 Meu progresso no NOVAIX Fitness:\n\n` +
    `🔥 Streak: ${stats.streak} dias\n` +
    `💪 Treinos: ${stats.totalWorkouts}\n` +
    `⏱️ Tempo total: ${stats.totalMinutes} min\n\n` +
    `Baixe: ${WEBSITE_URL}`;

  const result = await tryIf(async () => {
    if (await Sharing.isAvailableAsync()) {
      const fileUri = `${FileSystem.cacheDirectory ?? ''}novaix_progress.txt`;
      await FileSystem.writeAsStringAsync(fileUri, message);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartilhar progresso',
      });
    }
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok && __DEV__) console.error('Erro ao compartilhar progresso:', result.error);
}
