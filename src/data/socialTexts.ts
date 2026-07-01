// src/data/socialTexts.ts
// Textos e strings do feed social

export const COMPOSER = {
  title: 'Novo Post',
  placeholder: 'O que voce esta pensando?',
  feedPlaceholder: 'No que você está pensando, {name}?',
  imagePlaceholder: 'Adicionar foto',
  hashtagPlaceholder: 'Adicionar hashtag',
  publishButton: 'Publicar',
  buttonLabel: 'PUBLICAR',
  photoLabel: 'Foto',
  videoLabel: 'Vídeo',
  checkInLabel: 'Check-in',
  draftSaved: 'Rascunho salvo',
  permissionTitle: 'Permissao',
  permissionMessage: 'Precisamos de acesso a galeria para selecionar fotos.',
  errorTitle: 'Erro',
  uploadError: 'Falha ao enviar imagem: ',
  emptyError: 'Escreva algo ou selecione uma imagem',
  selfName: 'Voce',
} as const;

export const COMMENTS = {
  placeholder: 'Comentario...',
  inputPlaceholder: 'Comentario...',
  replyPlaceholder: 'Responder a {name}...',
  viewAll: 'Ver todos os {count} comentarios',
  loading: 'Carregando...',
  empty: 'Nenhum comentario ainda',
  writeLabel: 'Escrever comentario',
  sendLabel: 'Enviar comentario',
  anonymous: 'Anonimo',
} as const;

export const ACTIONS = {
  like: 'Curtir',
  unlike: 'Descurtir',
  comment: 'Comentar',
  share: 'Compartilhar',
  save: 'Salvar',
  unsave: 'Remover dos salvos',
  report: 'Denunciar',
  delete: 'Excluir',
  edit: 'Editar',
  copy: 'Copiar link',
} as const;

export const EMPTY_STATES = {
  noFeed: 'Nada por aqui ainda',
  noFeedSubtitle: 'Siga pessoas para ver as publicacoes delas',
  noSavedPosts: 'Nenhum post salvo',
  noSavedSubtitle: 'Salve posts para acessar depois',
  noNotifications: 'Nenhuma notificacao',
  noNotificationsSubtitle: 'Quando algo acontecer, voce sera avisado',
} as const;

export const TIMELINE = {
  justNow: 'Agora',
  minutesAgo: '{n} min atras',
  hoursAgo: '{n}h atras',
  daysAgo: '{n} dias atras',
  weeksAgo: '{n} sem atras',
} as const;

export const REPORT = {
  title: 'Reportar',
  subtitle: 'Por que esta reportando?',
  detailsPlaceholder: 'Detalhes (opcional)',
  submitButton: 'ENVIAR REPORT',
  reasons: [
    { id: 'spam', label: 'Spam', icon: 'alert-circle-outline' },
    { id: 'inappropriate', label: 'Conteudo inadequado', icon: 'warning-outline' },
    { id: 'harassment', label: 'Assedio', icon: 'person-remove-outline' },
    { id: 'fake', label: 'Conta falsa', icon: 'ban-outline' },
    { id: 'other', label: 'Outro', icon: 'ellipsis-horizontal-outline' },
  ],
} as const;

export const SOCIAL_FEED = {
  title: 'ATIVIDADE DOS AMIGOS',
  loading: 'Carregando...',
  emptyState: 'Nenhuma atividade recente',
  filterAll: 'Todos',
  filterWorkouts: 'Treinos',
  filterAchievements: 'Conquistas',
  defaultUser: 'Atleta',
  completedPrefix: 'Completou ',
  reelsSectionTitle: 'Reels / Vídeos Curtos',
  duelsSectionTitle: 'Duelos de Treino Ativos',
} as const;

export type ComposerKey = keyof typeof COMPOSER;
export type ActionKey = keyof typeof ACTIONS;
