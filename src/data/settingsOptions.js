// src/data/settingsOptions.js
// Opções de configuração - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

export const THEME_OPTIONS = [
  { key: 'dark', icon: 'moon', label: 'Escuro' },
  { key: 'light', icon: 'sunny', label: 'Claro' },
  { key: 'system', icon: 'phone-portrait', label: 'Automático' },
];

export const SETTINGS_GROUPS = [
  { title: 'TREINO', items: [
    { key: 'autoPlay', icon: 'play-circle-outline', label: 'Auto-play Videos', desc: 'Reproduzir video automaticamente', color: COLORS.info },
    { key: 'showRestTimer', icon: 'timer-outline', label: 'Timer de Descanso', desc: 'Mostrar timer entre series', color: COLORS.amber },
    { key: 'autoSkipRest', icon: 'play-skip-forward-outline', label: 'Auto-skip Descanso', desc: 'Pular descanso automaticamente', color: COLORS.cyan },
    { key: 'voiceCoach', icon: 'mic-outline', label: 'Treinador por Voz', desc: 'Instrucoes de voz durante o treino', color: COLORS.primary },
  ]},
  { title: 'FEEDBACK', items: [
    { key: 'soundEffects', icon: 'volume-high-outline', label: 'Efeitos Sonoros', desc: 'Sons ao completar exercicios', color: COLORS.successLight },
    { key: 'hapticFeedback', icon: 'phone-portrait-outline', label: 'Vibracao', desc: 'Vibracao ao interagir', color: COLORS.rose },
  ]},
  { title: 'COMUNICACAO', items: [
    { key: 'weeklyReport', icon: 'mail-outline', label: 'Relatorio Semanal', desc: 'Receber resumo por e-mail', color: COLORS.warning },
    { key: 'communityPosts', icon: 'chatbubbles-outline', label: 'Posts da Comunidade', desc: 'Notificar sobre novos posts', color: COLORS.fuchsia },
  ]},
];

export const ACCOUNT_OPTIONS = [
  { icon: 'person-outline', label: 'Editar Perfil', route: '/(tabs)/perfil', color: COLORS.info },
  { icon: 'lock-closed-outline', label: 'Alterar Senha', action: 'password', color: COLORS.error },
  { icon: 'download-outline', label: 'Exportar Dados', route: '/export-data', color: COLORS.successLight },
  { icon: 'shield-checkmark-outline', label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd', color: COLORS.purple },
];

export const INFO_OPTIONS = [
  { icon: 'help-circle-outline', label: 'Ajuda', route: '/(tabs)/ajuda', color: COLORS.textMuted },
  { icon: 'school-outline', label: 'Ver Tutorial', action: 'tutorial', color: COLORS.primary },
  { icon: 'star-outline', label: 'Avaliar o App', action: 'rate', color: COLORS.warning },
  { icon: 'share-social-outline', label: 'Compartilhar', action: 'share', color: COLORS.info },
  { icon: 'document-text-outline', label: 'Termos de Uso', route: '/(tabs)/perfil/termos', color: COLORS.textMuted },
  { icon: 'information-circle-outline', label: 'Sobre', version: '1.0.0', color: COLORS.textMuted },
];
