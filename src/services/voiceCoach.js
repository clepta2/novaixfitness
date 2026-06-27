// src/services/voiceCoach.js
// Treinador de voz por IA - NOVAIX FITNESS

import * as Speech from 'expo-speech';

const SPEECH_OPTIONS = {
  language: 'pt-BR',
  pitch: 1.0,
  rate: 0.95,
};

let enabled = true;

const MOTIVATIONAL_MESSAGES = [
  'Você está indo muito bem! Continue assim!',
  'Cada repetição conta! Não desista!',
  'Foco na forma correta do exercício!',
  'Respire fundo e mantenha o ritmo!',
  'Você é mais forte do que pensa!',
  'Última série! Dê o seu máximo!',
];

const EXERCISE_TIPS = {
  'Supino': 'Mantenha as escápulas juntas no banco. Não trave os cotovelos.',
  'Agachamento': 'Joelhos na direção dos pés. Costas retas.',
  'Remada': 'Puxe com as costas, não com os braços.',
  'Desenvolvimento': 'Não trave os cotovelos no topo.',
  'Leg Press': 'Não trave os joelhos. Desça até 90 graus.',
  'Prancha': 'Mantenha o corpo reto como uma prancha.',
};

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

export function speakMotivation() {
  const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  speak(msg);
}

export function speakExerciseTip(exerciseName) {
  const tip = Object.entries(EXERCISE_TIPS).find(([key]) => exerciseName?.includes(key));
  if (tip) {
    speak(`Dica para ${tip[0]}: ${tip[1]}`);
  }
}

export function speakCaloriesBurned(calories) {
  speak(`Você já queimou ${calories} calorias! Continue queimando!`);
}

export function speakHeartRateWarning(bpm) {
  if (bpm > 160) {
    speak(`Atenção! Seu batimento cardíaco está alto: ${bpm}. Reduza a intensidade.`);
  }
}
