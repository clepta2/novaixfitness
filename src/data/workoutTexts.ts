// src/data/workoutTexts.ts
// Textos e strings do player de treinos

export const TIMER = {
  start: 'Iniciar',
  pause: 'Pausar',
  resume: 'Continuar',
  finish: 'Finalizar',
  reset: 'Reiniciar',
  elapsed: 'Tempo decorrido',
  remaining: 'Tempo restante',
  complete: 'Treino concluido!',
} as const;

export const REST = {
  title: 'Intervalo',
  skip: 'Pular intervalo',
  skipRest: 'PULAR DESCANSO',
  nextExercise: 'Proximo exercicio',
  nextExerciseLabel: 'PRÓXIMO EXERCÍCIO',
  countdown: 'Preparar...',
  getReady: 'Prepare-se!',
  takeBreath: 'Respire fundo',
  phaseLabel: 'DESCANSO',
} as const;

export const COMPLETION = {
  title: 'TREINO CONCLUÍDO!',
  subtitle: 'Voce completou o treino',
  rating: 'Como foi o treino?',
  feedback: 'Deixe seu feedback',
  share: 'Compartilhar conquista',
  shareButton: 'COMPARTILHAR',
  save: 'Salvar treino',
  nextWorkout: 'Proximo treino',
  backToHome: 'VOLTAR AO INÍCIO',
  easy: 'Facil',
  moderate: 'Moderado',
  hard: 'Dificil',
  extreme: 'Extremo',
  recordsBroken: 'RECORDES QUEBRADOS',
  musclesWorked: 'MÚSCULOS TRABALHADOS',
  exercisesUnit: 'exercícios',
  minutesUnit: 'Minutos',
  shareMessage: '💪 Treino concluído no NOVAIX!\n\n🏋️ {name}\n⏱️ {duration} min\n🔥 {calories} kcal\n⭐ +{xp} XP\n🎯 {exercises} exercícios{records}\n\nBaixe o NOVAIX Fitness!',
  shareMessageRecord: '\n🏆 {count} record(s)!',
} as const;

export const EXERCISE = {
  sets: 'Series',
  reps: 'Repeticoes',
  rest: 'Descanso',
  weight: 'Peso',
  time: 'Tempo',
  distance: 'Distancia',
  completed: 'Concluido',
  of: 'de',
  set: 'serie',
  skip: 'Pular exercicio',
  previous: 'Anterior',
  next: 'Proximo',
  label: 'Exercicios',
  count: '{count}',
} as const;

export const ERRORS = {
  loadFailed: 'Erro ao carregar treino',
  saveFailed: 'Erro ao salvar progresso',
  videoUnavailable: 'Video indisponivel',
  retry: 'Tentar novamente',
} as const;

export const RATING = {
  title: 'AVALIE ESTE TREINO',
  subtitle: 'Sua opinião ajuda outros atletas',
  howWas: 'COMO FOI?',
  optionalComment: 'Comentário opcional...',
  submit: 'ENVIAR AVALIAÇÃO',
  skipForNow: 'Pular por agora',
  rateStars: 'Avaliar {count} estrela(s)',
} as const;

export const TIMER_CONTROLS = {
  quickTime: 'Tempo Rápido',
} as const;

export type TimerAction = keyof typeof TIMER;
export type ExerciseLabel = keyof typeof EXERCISE;
