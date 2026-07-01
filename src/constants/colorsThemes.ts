// src/constants/colorsThemes.ts
// Temas dark e light

import type { ThemeColors } from './colorsTypes';

export const darkTheme: ThemeColors = {
  background: '#12161A', surface: '#1E232A', surfaceElevated: '#252B34', surfaceOverlay: '#2E3540', hover: '#2A2F38',
  border: '#333333', borderLight: '#2A2F38', borderActive: '#CCFF0040',
  primary: '#CCFF00', primaryDark: '#A8E600', primaryLight: '#DEFF66', secondary: '#FF6B35', secondaryLight: '#FF8F65',
  success: '#00E676', attention: '#FFD600', error: '#FF1744', info: '#3B82F6', water: '#3B82F6',
  successBg: '#00E67615', attentionBg: '#FFD60015', errorBg: '#FF174415', infoBg: '#3B82F615', waterBg: '#3B82F615',
  textTitle: '#FFFFFF', textDescription: '#94A3B8', textMuted: '#8899AA',
  purple: '#6366F1', pink: '#EC4899', rose: '#F43F5E', fuchsia: '#D946EF', cyan: '#06B6D4',
  amber: '#F59E0B', gold: '#FFD700', star: '#F59E0B', bronze: '#CD7F32', slateBlue: '#7B68EE',
  whatsapp: '#25D366', googleBlue: '#4285F4', warning: '#FFC107', successLight: '#10B981', errorLight: '#FF4D4D', waterLight: '#00D2FF',
  overlay: 'rgba(0,0,0,0.5)', overlayDark: 'rgba(0,0,0,0.7)', overlayLight: 'rgba(0,0,0,0.3)', overlaySubtle: 'rgba(0,0,0,0.2)',
  gradientPrimary: ['#CCFF00', '#A8E600'], gradientAccent: ['#FF6B35', '#FF8F65'], gradientDark: ['#1E232A', '#12161A'],
  gradientPremium: ['#CCFF00', '#00E676'], gradientSurface: ['#252B34', '#1E232A'],
};

export const lightTheme: ThemeColors = {
  background: '#FFFFFF', surface: '#F1F5F9', surfaceElevated: '#FFFFFF', surfaceOverlay: '#F8FAFC', hover: '#E2E8F0',
  border: '#CBD5E1', borderLight: '#E2E8F0', borderActive: '#CCFF0060',
  primary: '#CCFF00', primaryDark: '#A8E600', primaryLight: '#DEFF66', secondary: '#E85D24', secondaryLight: '#FF8F65',
  success: '#00E676', attention: '#FFD600', error: '#EF4444', info: '#3B82F6', water: '#3B82F6',
  successBg: '#00E67615', attentionBg: '#FFD60015', errorBg: '#EF444415', infoBg: '#3B82F615', waterBg: '#3B82F615',
  textTitle: '#0F172A', textDescription: '#475569', textMuted: '#64748B',
  purple: '#6366F1', pink: '#EC4899', rose: '#F43F5E', fuchsia: '#D946EF', cyan: '#06B6D4',
  amber: '#F59E0B', gold: '#FFD700', star: '#F59E0B', bronze: '#CD7F32', slateBlue: '#7B68EE',
  whatsapp: '#25D366', googleBlue: '#4285F4', warning: '#FFC107', successLight: '#10B981', errorLight: '#FF4D4D', waterLight: '#00D2FF',
  overlay: 'rgba(0,0,0,0.5)', overlayDark: 'rgba(0,0,0,0.7)', overlayLight: 'rgba(0,0,0,0.3)', overlaySubtle: 'rgba(0,0,0,0.2)',
  gradientPrimary: ['#CCFF00', '#A8E600'], gradientAccent: ['#E85D24', '#FF8F65'], gradientDark: ['#F1F5F9', '#FFFFFF'],
  gradientPremium: ['#CCFF00', '#00E676'], gradientSurface: ['#FFFFFF', '#F1F5F9'],
};
