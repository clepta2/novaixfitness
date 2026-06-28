// src/data/tutorials.js
// Dados dos tutoriais por tela - NOVAIX FITNESS

export const TUTORIALS = {
  home: {
    id: 'home',
    title: 'Tutorial da Home',
    steps: [
      { id: 'welcome', title: 'BEM-VINDO AO NOVAIX!', description: 'Vamos te mostrar como usar o app. Leva menos de 1 minuto!', icon: 'rocket', screen: 'home' },
      { id: 'contextual_card', title: 'SEU PLANO DO DIA', description: 'O card muda conforme a hora do dia: aquecimento, treino ou recuperação.', icon: 'sunny', screen: 'home', target: 'contextualCard' },
      { id: 'categories', title: 'CATEGORIAS', description: 'Explore treinos por grupo muscular ou tipo de exercício.', icon: 'grid', screen: 'home', target: 'categories' },
      { id: 'voice_coach', title: 'TREINADOR POR VOZ', description: 'Ative nas configurações para ouvir instruções durante o treino.', icon: 'mic', screen: 'home', target: 'header' },
      { id: 'notifications', title: 'NOTIFICAÇÕES', description: 'Escolha quais notificações quer receber nas Configurações.', icon: 'notifications', screen: 'home', target: 'header' },
      { id: 'complete', title: 'PRONTO!', description: 'Você está preparado. Bons treinos!', icon: 'checkmark-circle', screen: 'home' },
    ],
  },
  library: {
    id: 'library',
    title: 'Tutorial da Biblioteca',
    steps: [
      { id: 'library_welcome', title: 'BIBLIOTECA DE TREINOS', description: 'Aqui você encontra todos os treinos disponíveis. Vamos explicar!', icon: 'book', screen: 'library' },
      { id: 'library_search', title: 'BUSCA INTELIGENTE', description: 'Digite palavras-chave para encontrar treinos específicos. Experimente buscar por "peito" ou "perna"!', icon: 'search', screen: 'library', target: 'searchBar' },
      { id: 'library_search_tips', title: 'DICA DE BUSCA', description: 'Você pode buscar por nome do treino, exercício, grupo muscular ou até equipamento!', icon: 'bulb', screen: 'library', target: 'searchBar' },
      { id: 'library_filters', title: 'FILTROS AVANÇADOS', description: 'Use filtros por nível, duração, equipamento e mais para refinar sua busca.', icon: 'options', screen: 'library', target: 'filterBtn' },
      { id: 'library_favorites', title: 'SEUS FAVORITOS', description: 'Toque no ícone de coração para salvar treinos favoritos e acessá-los rapidamente.', icon: 'heart', screen: 'library', target: 'favorites' },
      { id: 'library_complete', title: 'EXPLORE!', description: 'Agora você pode explorar todos os treinos. Bons treinos!', icon: 'checkmark-circle', screen: 'library' },
    ],
  },
  perfil: {
    id: 'perfil',
    title: 'Tutorial do Perfil',
    steps: [
      { id: 'perfil_welcome', title: 'SEU PERFIL', description: 'Aqui você acompanha seu progresso e conquistas.', icon: 'person', screen: 'perfil' },
      { id: 'perfil_stats', title: 'SUAS ESTATÍSTICAS', description: 'Veja streak, treinos concluídos e tempo total de treino.', icon: 'stats-chart', screen: 'perfil', target: 'stats' },
      { id: 'perfil_xp', title: 'SISTEMA DE XP', description: 'Ganhe XP a cada treino e suba de nível!', icon: 'trophy', screen: 'perfil', target: 'gamification' },
      { id: 'perfil_achievements', title: 'CONQUISTAS', description: 'Desbloqueie conquistas completando desafios.', icon: 'medal', screen: 'perfil', target: 'achievements' },
      { id: 'perfil_complete', title: 'PERFIL COMPLETO!', description: 'Personalize seu perfil e acompanhe seu progresso.', icon: 'checkmark-circle', screen: 'perfil' },
    ],
  },
  feed: {
    id: 'feed',
    title: 'Tutorial da Comunidade',
    steps: [
      { id: 'feed_welcome', title: 'COMUNIDADE', description: 'Conecte-se com outros atletas e compartilhe seu progresso.', icon: 'people', screen: 'feed' },
      { id: 'feed_post', title: 'CRIAR POST', description: 'Compartilhe seus treinos e conquistas com a comunidade.', icon: 'add-circle', screen: 'feed', target: 'fab' },
      { id: 'feed_interact', title: 'INTERAJA', description: 'Curta e comente nos posts dos outros atletas.', icon: 'chatbubbles', screen: 'feed', target: 'posts' },
      { id: 'feed_complete', title: 'PARTICIPE!', description: 'Agora você faz parte da comunidade NOVAIX!', icon: 'checkmark-circle', screen: 'feed' },
    ],
  },
  player: {
    id: 'player',
    title: 'Tutorial do Player',
    steps: [
      { id: 'player_welcome', title: 'PLAYER DE TREINOS', description: 'Aqui você acompanha seus treinos diários em tempo real.', icon: 'play', screen: 'player' },
      { id: 'player_progress', title: 'PROGRESSO', description: 'A barra mostra quanto do treino diário você completou.', icon: 'trending-up', screen: 'player', target: 'progressBar' },
      { id: 'player_timer', title: 'CRONÔMETRO', description: 'Toque em INICIAR para começar o treino com cronômetro.', icon: 'timer', screen: 'player', target: 'timer' },
      { id: 'player_complete', title: 'BONS TREINOS!', description: 'Complete todos os treinos para manter seu streak!', icon: 'checkmark-circle', screen: 'player' },
    ],
  },
  notifications: {
    id: 'notifications',
    title: 'Tutorial de Notificações',
    steps: [
      { id: 'notif_welcome', title: 'CENTRO DE NOTIFICAÇÕES', description: 'Aqui ficam todas as suas notificações importantes.', icon: 'notifications', screen: 'notifications' },
      { id: 'notif_unread', title: 'NÃO LIDAS', description: 'O badge indica quantas notificações você ainda não leu.', icon: 'mail-unread', screen: 'notifications', target: 'badge' },
      { id: 'notif_mark_read', title: 'MARCAR COMO LIDAS', description: 'Toque no ícone de check para marcar todas como lidas de uma vez.', icon: 'checkmark-done', screen: 'notifications', target: 'markAllBtn' },
      { id: 'notif_interact', title: 'INTERAJA', description: 'Toque em uma notificação para ver os detalhes. Segure para apagar.', icon: 'finger-print', screen: 'notifications', target: 'list' },
      { id: 'notif_complete', title: 'MANTENHA-SE ATUALIZADO', description: 'Verifique suas notificações regularmente para não perder nada!', icon: 'checkmark-circle', screen: 'notifications' },
    ],
  },
};

export const TUTORIAL_STORAGE_KEY = '@novaix_tutorials_completed';
