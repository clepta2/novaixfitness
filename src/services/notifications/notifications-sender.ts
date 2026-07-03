import * as Notifications from 'expo-notifications';
import { APP_CONFIG } from '../../config/app';
import { isNotificationEnabled } from './notificationPrefs';
import { supabase } from '../../config/supabase';
import { tryIf } from '../../utils/tryIf';

const { streakMessages, motivationalTips } = APP_CONFIG.notifications;

async function shouldSend(userId, type) {
  return isNotificationEnabled(userId, type);
}

async function saveAndSend(userId, type, title, body, data = {}) {
  if (!(await shouldSend(userId, type))) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { ...data, type } },
    trigger: null,
  });
  if (userId) {
    await tryIf(async () => {
      await supabase.from('notifications').insert({ user_id: userId, type, title, body, data });
    }, { retries: 3, baseDelay: 1000 });
  }
  return true;
}

export async function sendWorkoutCompletedNotification(workoutName, xpGained, userId) {
  return saveAndSend(userId, 'workout_completed', 'Treino concluido!', `${workoutName} finalizado. +${xpGained} XP ganho!`);
}

export async function sendStreakNotification(days, userId) {
  return saveAndSend(userId, 'streak', `Streak de ${days} dias!`, streakMessages[days] || 'Continue assim! Voce esta indo muito bem.');
}

export async function sendAchievementNotification(achievementName, xpReward, userId) {
  return saveAndSend(userId, 'achievement', 'Conquista desbloqueada!', `${achievementName} +${xpReward} XP`);
}

export async function sendLevelUpNotification(levelName, newLevel, userId) {
  return saveAndSend(userId, 'level_up', `Nivel ${newLevel}!`, `Parabens! Voce alcancou o nivel ${levelName}!`);
}

export async function sendNewWorkoutNotification(workoutName, userId) {
  return saveAndSend(userId, 'new_workout', 'Novo treino disponivel!', `${workoutName} acabou de chegar. Confira agora!`);
}

export async function sendWeeklySummaryNotification(workoutsCompleted, minutesTrained, userId) {
  return saveAndSend(userId, 'weekly_summary', 'Resumo da semana', `${workoutsCompleted} treinos, ${minutesTrained} minutos. Continue firme!`);
}

export async function sendRestReminder(userId) {
  return saveAndSend(userId, 'rest_day', 'Dia de descanso', 'Recuperacao e importante! Volte amanha com tudo.');
}

export async function sendMotivationalNotification(userId) {
  const tip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  return saveAndSend(userId, 'motivational', 'Motivacao do dia', tip);
}

export async function sendWorkoutReminder(userId) {
  return saveAndSend(userId, 'workout_reminder', 'Hora de treinar!', 'Seu streak esta em risco! Nao esqueca do treino de hoje.');
}
