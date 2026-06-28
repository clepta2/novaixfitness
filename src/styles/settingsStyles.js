// src/styles/settingsStyles.js
// Estilos da tela de Configurações - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { layout } from './index';

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  themeSection: { marginBottom: SPACING.xl },
  themeRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  themeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  themeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  themeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  themeBtnTextActive: { color: COLORS.background },
  tutorialSection: { marginBottom: SPACING.xl },
  replayBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary + '30', marginTop: SPACING.sm },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.errorBg, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.md },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md },
  footer: { alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl },
});
