// src/constants/colors.ts
// Design System NOVAIX FITNESS
// Cores oficiais — expandidas para visual premium com tipagem estrita

export interface ThemeColors {
  // Backgrounds & Surfaces (4 níveis de profundidade)
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceOverlay: string;
  hover: string;

  // Borders (3 variantes)
  border: string;
  borderLight: string;
  borderActive: string;

  // Brand
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;

  // Semantic
  success: string;
  attention: string;
  error: string;
  info: string;
  water: string;

  // Semantic Backgrounds (sutis)
  successBg: string;
  attentionBg: string;
  errorBg: string;
  infoBg: string;
  waterBg: string;

  // Text
  textTitle: string;
  textDescription: string;
  textMuted: string;

  // Extended palette (for icons, badges, onboarding)
  purple: string;
  pink: string;
  rose: string;
  fuchsia: string;
  cyan: string;
  amber: string;
  gold: string;
  slateBlue: string;
  whatsapp: string;
  googleBlue: string;
  warning: string;
  successLight: string;
  errorLight: string;

  // Gradients (arrays para LinearGradient)
  gradientPrimary: [string, string];
  gradientAccent: [string, string];
  gradientDark: [string, string];
  gradientPremium: [string, string];
  gradientSurface: [string, string];
}

const darkTheme: ThemeColors = {
  // Backgrounds & Surfaces (4 níveis de profundidade)
  background: '#12161A',
  surface: '#1E232A',
  surfaceElevated: '#252B34',
  surfaceOverlay: '#2E3540',
  hover: '#2A2F38',

  // Borders (3 variantes)
  border: '#333333',
  borderLight: '#2A2F38',
  borderActive: '#CCFF0040',

  // Brand
  primary: '#CCFF00',
  primaryDark: '#A8E600',
  primaryLight: '#DEFF66',
  secondary: '#FF6B35',
  secondaryLight: '#FF8F65',

  // Semantic
  success: '#00E676',
  attention: '#FFD600',
  error: '#FF1744',
  info: '#3B82F6',
  water: '#3B82F6',

  // Semantic Backgrounds (sutis)
  successBg: '#00E67615',
  attentionBg: '#FFD60015',
  errorBg: '#FF174415',
  infoBg: '#3B82F615',
  waterBg: '#3B82F615',

  // Text
  textTitle: '#FFFFFF',
  textDescription: '#94A3B8',
  textMuted: '#666666',

  // Extended palette
  purple: '#6366F1',
  pink: '#EC4899',
  rose: '#F43F5E',
  fuchsia: '#D946EF',
  cyan: '#06B6D4',
  amber: '#F59E0B',
  gold: '#FFD700',
  slateBlue: '#7B68EE',
  whatsapp: '#25D366',
  googleBlue: '#4285F4',
  warning: '#FFC107',
  successLight: '#10B981',
  errorLight: '#FF4D4D',

  // Gradients (arrays para LinearGradient)
  gradientPrimary: ['#CCFF00', '#A8E600'],
  gradientAccent: ['#FF6B35', '#FF8F65'],
  gradientDark: ['#1E232A', '#12161A'],
  gradientPremium: ['#CCFF00', '#00E676'],
  gradientSurface: ['#252B34', '#1E232A'],
};

const lightTheme: ThemeColors = {
  // Backgrounds & Surfaces
  background: '#FFFFFF',
  surface: '#F1F5F9',
  surfaceElevated: '#FFFFFF',
  surfaceOverlay: '#F8FAFC',
  hover: '#E2E8F0',

  // Borders
  border: '#CBD5E1',
  borderLight: '#E2E8F0',
  borderActive: '#CCFF0060',

  // Brand
  primary: '#CCFF00',
  primaryDark: '#A8E600',
  primaryLight: '#DEFF66',
  secondary: '#E85D24',
  secondaryLight: '#FF8F65',

  // Semantic
  success: '#00E676',
  attention: '#FFD600',
  error: '#EF4444',
  info: '#3B82F6',
  water: '#3B82F6',

  // Semantic Backgrounds
  successBg: '#00E67615',
  attentionBg: '#FFD60015',
  errorBg: '#EF444415',
  infoBg: '#3B82F615',
  waterBg: '#3B82F615',

  // Text
  textTitle: '#0F172A',
  textDescription: '#475569',
  textMuted: '#64748B',

  // Extended palette
  purple: '#6366F1',
  pink: '#EC4899',
  rose: '#F43F5E',
  fuchsia: '#D946EF',
  cyan: '#06B6D4',
  amber: '#F59E0B',
  gold: '#FFD700',
  slateBlue: '#7B68EE',
  whatsapp: '#25D366',
  googleBlue: '#4285F4',
  warning: '#FFC107',
  successLight: '#10B981',
  errorLight: '#FF4D4D',

  // Gradients
  gradientPrimary: ['#CCFF00', '#A8E600'],
  gradientAccent: ['#E85D24', '#FF8F65'],
  gradientDark: ['#F1F5F9', '#FFFFFF'],
  gradientPremium: ['#CCFF00', '#00E676'],
  gradientSurface: ['#FFFFFF', '#F1F5F9'],
};

export const THEMES = { dark: darkTheme, light: lightTheme };
export const COLORS: ThemeColors = { ...darkTheme };

export function setThemeColors(theme: 'dark' | 'light') {
  const source = THEMES[theme];
  (Object.keys(source) as Array<keyof ThemeColors>).forEach(key => {
    (COLORS as any)[key] = source[key];
  });
}
