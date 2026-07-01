// src/services/reminder-helpers.js
// Auxiliares para lembretes de treino - NOVAIX FITNESS

export function getRestDays(workoutDays) {
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  return allDays.filter(d => !workoutDays.includes(d));
}

export function getMotivationalMessage() {
  const messages = [
    'Cada treino te aproxima do seu objetivo!',
    'Disciplina e mais forte que motivacao.',
    'Seu corpo agradece cada gota de suor.',
    'Hoje e um bom dia para superar seus limites.',
    'A consistencia e a chave do sucesso.',
    'Nao pare agora! Voce esta indo muito bem.',
    'O unico treino ruim e o que nao aconteceu.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getWeeklyFeedback(count) {
  if (count >= 5) return 'Semana incrivel!';
  if (count >= 3) return 'Muito bem! Continue assim.';
  if (count >= 1) return 'Bom comeco! Tente treinar mais.';
  return 'Semana fraca. Volte com tudo!';
}
