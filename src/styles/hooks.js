// src/styles/hooks.js
// Hooks de estilos dinâmicos para theme switching - NOVAIX FITNESS

import { useMemo } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

const SAFE_TOP = Platform.OS === 'ios' ? 54 : 40;

export function useLayout() {
  return useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SPACING.xl, paddingTop: SAFE_TOP },
    centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl },
    headerTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, lineHeight: 36, color: COLORS.textTitle },
    headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
    section: { marginBottom: SPACING.xxl },
    sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, lineHeight: 16, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
    cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dividerText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textMuted, marginHorizontal: SPACING.md },
    btnPrimary: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md },
    btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.background, letterSpacing: 1 },
    footer: { flexDirection: 'row', gap: SPACING.md, padding: SPACING.xl, paddingBottom: 40 },
    footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textDescription },
    footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.primary },
  }), [COLORS.background, COLORS.surface, COLORS.border, COLORS.primary, COLORS.textTitle, COLORS.textMuted, COLORS.textDescription]);
}

export function useTypography() {
  return useMemo(() => StyleSheet.create({
    h1: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, lineHeight: 40, color: COLORS.textTitle },
    h2: { fontFamily: 'Montserrat_700Bold', fontSize: 24, lineHeight: 32, color: COLORS.textTitle },
    h3: { fontFamily: 'Montserrat_600SemiBold', fontSize: 18, lineHeight: 24, color: COLORS.textTitle },
    h4: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, lineHeight: 22, color: COLORS.textTitle },
    h5: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, lineHeight: 16, color: COLORS.textMuted, letterSpacing: 1 },
    body: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: COLORS.textDescription },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, color: COLORS.textDescription },
    bodyMuted: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: COLORS.textMuted },
    label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, lineHeight: 16, color: COLORS.textMuted, letterSpacing: 0.5 },
    caption: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, color: COLORS.textMuted },
    timer: { fontFamily: 'Montserrat_700Bold', fontSize: 48, lineHeight: 56, color: COLORS.textTitle },
  }), [COLORS.textTitle, COLORS.textMuted, COLORS.textDescription]);
}

export function useComponents() {
  return useMemo(() => StyleSheet.create({
    inputContainer: { marginBottom: SPACING.lg },
    inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
    inputFocused: { borderColor: COLORS.primary },
    inputField: { flex: 1, height: '100%', paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16 },
    button: { height: 50, borderRadius: BORDER_RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm },
    buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
    badge: { borderRadius: BORDER_RADIUS.full, alignSelf: 'flex-start' },
    badgeText: { fontFamily: 'Montserrat_700Bold' },
    listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
    listItemActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
    avatar: { backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontFamily: 'Montserrat_700Bold', color: COLORS.primary },
    progressTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm },
  }), [COLORS.background, COLORS.surface, COLORS.border, COLORS.primary, COLORS.textTitle, COLORS.textMuted]);
}
