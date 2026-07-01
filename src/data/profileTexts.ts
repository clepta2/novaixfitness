// src/data/profileTexts.ts
// Textos e strings da tela de perfil

export const SECTION_TITLES = {
  posts: 'Publicacoes',
  about: 'Sobre',
  options: 'Opcoes',
  stats: 'Estatisticas',
  settings: 'Configuracoes',
  ranking: 'RANKING GLOBAL',
  challenges: 'DESAFIOS SEMANAIS',
  bodyEvolution: 'EVOLUÇÃO CORPORAL',
  muscleBalance: 'EQUILÍBRIO MUSCULAR',
  quickActions: 'AÇÕES RÁPIDAS',
  achievements: 'CONQUISTAS',
  appearance: 'APARÊNCIA',
  shortcuts: 'ATALHOS',
  loadingPosts: 'Carregando publicações...',
  emptyPosts: 'Nenhum post publicado ainda.',
  composerPlaceholder: 'No que você está pensando, {name}?',
  logoutTitle: 'Sair',
  logoutMessage: 'Tem certeza?',
  logoutCancel: 'Cancelar',
  logoutConfirm: 'Sair',
} as const;

export const EMPTY_STATES = {
  noPosts: 'Nenhuma publicacao ainda',
  noFollowers: 'Nenhum seguidor',
  noFollowing: 'Nao segue ninguem',
  noAchievements: 'Conquistas em breve',
  noWorkouts: 'Nenhum treino registrado',
} as const;

export const BUTTONS = {
  edit: 'Editar',
  save: 'Salvar',
  follow: 'Seguir',
  unfollow: 'Deixar de seguir',
  message: 'Enviar mensagem',
  block: 'Bloquear',
  report: 'Denunciar',
  share: 'Compartilhar perfil',
  logout: 'Sair',
  claim: 'RESGATAR',
} as const;

export const LABELS = {
  memberSince: 'Membro desde',
  followers: 'Seguidores',
  following: 'Seguindo',
  posts: 'Publicacoes',
  workouts: 'Treinos',
  streak: 'Sequencia',
  level: 'Nivel',
  points: 'Pontos',
  bio: 'Biografia',
  location: 'Localizacao',
  xpTotal: 'XP Total',
  seeMore: 'Ver mais',
  nextLevel: 'Proximo',
  maxLevel: 'Nivel maximo atingido!',
  weight: 'PESO (KG)',
  bodyFat: 'GORDURA (%)',
  lastRecords: 'ULTIMOS REGISTROS:',
  locked: 'Bloqueada',
  unlockedCount: 'desbloqueadas',
  athlete: 'Atleta',
} as const;

export const MESSAGES = {
  profileUpdated: 'Perfil atualizado com sucesso',
  followSuccess: 'Agora voce segue este usuario',
  unfollowSuccess: 'Voce deixou de seguir este usuario',
  blockConfirm: 'Tem certeza que deseja bloquear este usuario?',
  logoutConfirm: 'Tem certeza que deseja sair?',
  challengeComplete: 'Desafio Completo!',
  challengeReward: (xp: number) => `+${xp} XP ganho!`,
} as const;

export const STAT_DEFS = [
  { key: 'streak', icon: 'flame', label: LABELS.streak, unit: 'd' },
  { key: 'workouts', icon: 'barbell', label: LABELS.workouts, unit: '' },
  { key: 'time', icon: 'time-outline', label: 'Horas', unit: 'h' },
  { key: 'favorites', icon: 'heart', label: 'Favoritos', unit: '' },
] as const;

export const MUSCLES = [
  { key: 'chest', label: 'Peito', icon: 'body' },
  { key: 'back', label: 'Costas', icon: 'body' },
  { key: 'legs', label: 'Pernas', icon: 'walk' },
  { key: 'shoulders', label: 'Ombros', icon: 'body' },
  { key: 'arms', label: 'Bracos', icon: 'barbell' },
  { key: 'core', label: 'Abdomen', icon: 'fitness' },
] as const;

export const QUICK_ACTIONS = [
  { icon: 'stats-chart', label: 'Analytics', route: '/analytics' },
  { icon: 'grid', label: 'Dashboard', route: '/dashboard' },
  { icon: 'body', label: 'Medidas', route: '/body-measures' },
  { icon: 'camera', label: 'Progresso', route: '/progress-photos' },
  { icon: 'time', label: 'Historico', route: '/(tabs)/perfil/history' },
  { icon: 'download', label: 'Exportar', route: '/export-data' },
  { icon: 'card', label: 'Assinatura', route: '/subscription' },
] as const;

export type SectionTitle = keyof typeof SECTION_TITLES;
export type ButtonKey = keyof typeof BUTTONS;
export type LabelKey = keyof typeof LABELS;
export type MuscleKey = typeof MUSCLES[number]['key'];
export type QuickAction = typeof QUICK_ACTIONS[number];
export type StatDef = typeof STAT_DEFS[number];
