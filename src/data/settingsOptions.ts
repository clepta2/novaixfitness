// src/data/settingsOptions.ts
// Opções de configuração - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface ThemeOption {
  key: string;
  icon: string;
  label: string;
}

interface SettingItem {
  key: string;
  icon: string;
  label: string;
  desc: string;
  color: string;
}

interface SettingsGroup {
  title: string;
  items: SettingItem[];
}

interface AccountOption {
  icon: string;
  label: string;
  route?: string;
  action?: string;
  color: string;
}

interface InfoOption {
  icon: string;
  label: string;
  route?: string;
  action?: string;
  version?: string;
  color: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { key: 'dark', icon: 'moon', label: 'Escuro' },
  { key: 'light', icon: 'sunny', label: 'Claro' },
  { key: 'system', icon: 'phone-portrait', label: 'Automático' },
];

export const SETTINGS_GROUPS: SettingsGroup[] = [
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

export const ACCOUNT_OPTIONS: AccountOption[] = [
  { icon: 'person-outline', label: 'Editar Perfil', route: '/(tabs)/perfil', color: COLORS.info },
  { icon: 'lock-closed-outline', label: 'Alterar Senha', action: 'password', color: COLORS.error },
  { icon: 'download-outline', label: 'Exportar Dados', route: '/export-data', color: COLORS.successLight },
  { icon: 'shield-checkmark-outline', label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd', color: COLORS.purple },
];

export const INFO_OPTIONS: InfoOption[] = [
  { icon: 'help-circle-outline', label: 'Ajuda', route: '/(tabs)/ajuda', color: COLORS.textMuted },
  { icon: 'school-outline', label: 'Ver Tutorial', action: 'tutorial', color: COLORS.primary },
  { icon: 'star-outline', label: 'Avaliar o App', action: 'rate', color: COLORS.warning },
  { icon: 'share-social-outline', label: 'Compartilhar', action: 'share', color: COLORS.info },
  { icon: 'document-text-outline', label: 'Termos de Uso', route: '/(tabs)/perfil/termos', color: COLORS.textMuted },
  { icon: 'information-circle-outline', label: 'Sobre', version: '1.0.0', color: COLORS.textMuted },
];
export const AI_TABS = [
  { id: 'dados', key: 'chat', label: 'Dados', icon: 'person-outline' },
  { id: 'insights', key: 'plans', label: 'Insights', icon: 'analytics-outline' },
  { id: 'progresso', key: 'analysis', label: 'Progresso', icon: 'trending-up-outline' },
];
