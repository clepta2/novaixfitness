// src/data/dailyChallenges.js
// Desafios diários - DATA DRIVEN

export const CHALLENGE_TYPES = [
  { id: 'workout', label: 'Treino', icon: 'barbell', xp: 10 },
  { id: 'water', label: 'Água', icon: 'water', xp: 5 },
  { id: 'steps', label: 'Passos', icon: 'walk', xp: 10 },
  { id: 'sleep', label: 'Sono', icon: 'moon', xp: 5 },
  { id: 'nutrition', label: 'Alimentação', icon: 'restaurant', xp: 5 },
  { id: 'stretch', label: 'Alongamento', icon: 'body', xp: 5 },
];

export const CHALLENGES = [
  { id: 'complete_workout', type: 'workout', text: 'Complete 1 treino hoje', target: 1, xp: 10 },
  { id: 'drink_water', type: 'water', text: 'Beba sua meta de água', target: 1, xp: 5 },
  { id: 'walk_5000', type: 'steps', text: 'Caminhe 5000 passos', target: 5000, xp: 10 },
  { id: 'sleep_7h', type: 'sleep', text: 'Durma 7+ horas', target: 7, xp: 5 },
  { id: 'eat_healthy', type: 'nutrition', text: 'Registre 3 refeições saudáveis', target: 3, xp: 5 },
  { id: 'stretch_10min', type: 'stretch', text: 'Faça 10min de alongamento', target: 10, xp: 5 },
  { id: 'morning_workout', type: 'workout', text: 'Treine antes das 10h', target: 1, xp: 10 },
  { id: 'drink_3l', type: 'water', text: 'Beba 3L de água', target: 3000, xp: 10 },
  { id: 'no_sugar', type: 'nutrition', text: 'Evite açúcar hoje', target: 1, xp: 10 },
  { id: 'meditate', type: 'stretch', text: 'Medite 5 minutos', target: 5, xp: 5 },
];

export function getDailyChallenges(count = 3) {
  const shuffled = [...CHALLENGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function checkChallengeCompletion(challenge, stats) {
  switch (challenge.type) {
    case 'workout': return stats.workoutsToday >= challenge.target;
    case 'water': return stats.waterToday >= challenge.target;
    case 'steps': return stats.stepsToday >= challenge.target;
    case 'sleep': return stats.sleepHours >= challenge.target;
    case 'nutrition': return stats.mealsToday >= challenge.target;
    case 'stretch': return stats.stretchMinutes >= challenge.target;
    default: return false;
  }
}
