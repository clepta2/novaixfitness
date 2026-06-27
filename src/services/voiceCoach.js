// src/services/voiceCoach.js
// Treinador de voz por IA - NOVAIX FITNESS

import * as Speech from 'expo-speech';

const SPEECH_OPTIONS = {
  language: 'pt-BR',
  pitch: 1.0,
  rate: 0.95,
};

let enabled = true;

export function setVoiceCoachEnabled(value) {
  enabled = value;
}

export function isVoiceCoachEnabled() {
  return enabled;
}

export async function stopSpeaking() {
  try {
    await Speech.stop();
  } catch (err) {
    console.warn('Erro ao parar fala:', err);
  }
}

async function speak(text) {
  if (!enabled) return;
  try {
    await stopSpeaking();
    Speech.speak(text, SPEECH_OPTIONS);
  } catch (err) {
    console.warn('Erro ao falar áudio:', err);
  }
}

export function speakWelcome(workoutName) {
  const text = `Olá atleta! Hora de iniciar seu treino de hoje: ${workoutName || 'Nix Inteligente'}. Prepare-se e vamos com tudo!`;
  speak(text);
}

export function speakNextExercise(exerciseName, reps, weight, seriesIndex, totalSeries) {
  let details = '';
  if (reps) details += `, ${reps} repetições`;
  if (weight) details += ` com ${weight} quilos`;
  
  const seriesText = seriesIndex && totalSeries ? `Série ${seriesIndex} de ${totalSeries}. ` : '';
  const text = `${seriesText}Próximo exercício: ${exerciseName}${details}. Prepare-se para começar.`;
  speak(text);
}

export function speakRestStart(seconds) {
  const text = `Série concluída! Descanse por ${seconds} segundos. Beba um gole de água.`;
  speak(text);
}

export function speakRestHalfway() {
  const text = `Metade do tempo de descanso concluído. Prepare-se para a próxima série.`;
  speak(text);
}

export function speakRestEnd() {
  const text = `Descanso finalizado. Volte para o exercício agora.`;
  speak(text);
}

export function speakHalfway() {
  const text = `Metade concluída! Mantenha o ritmo e a postura.`;
  speak(text);
}

export function speakWorkoutComplete(workoutName) {
  const text = `Treino concluído! Excelente trabalho no treino de ${workoutName || 'hoje'}. Você superou seus limites!`;
  speak(text);
}
