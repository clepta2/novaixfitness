// src/data/settingsTexts.ts
// Textos e strings das telas de configuracoes

export const NOTIFICATIONS = {
  title: 'NOTIFICAÇÕES',
  subtitle: 'Escolha quais notificações deseja receber',
} as const;

export const APPEARANCE = {
  title: 'APARENCIA',
  subtitle: 'Personalize o visual do app',
  themeSection: 'TEMA',
  light: 'Claro',
  dark: 'Escuro',
  info: 'O tema escuro ajuda a reduzir o cansaco visual durante treinos noturnos.',
} as const;

export const OFFLINE = {
  title: 'DADOS OFFLINE',
  cache: 'Cache',
  lastSync: 'Último Sync',
  pending: 'Pendentes',
  syncing: 'Sincronizando...',
  sync: 'Sincronizar',
  clearWorkouts: 'Limpar Treinos',
  clearAll: 'Limpar Tudo',
  offlineTitle: 'Offline',
  offlineMessage: 'Sem conexão. Tente quando estiver online.',
  syncTitle: 'Sync',
  syncMessage: 'Sincronizado: {synced}\nFalhou: {failed}',
  syncError: 'Falha ao sincronizar.',
  clearWorkoutsTitle: 'Limpar cache de treinos',
  clearWorkoutsMessage: 'Remove treinos salvos offline.',
  clearAllTitle: 'Limpar todo o cache',
  clearAllMessage: 'Remove todos os dados offline.',
  cancel: 'Cancelar',
  clear: 'Limpar',
  clearAllButton: 'Limpar Tudo',
  never: 'Nunca',
  justNow: 'Agora',
  errorTitle: 'Erro',
} as const;
