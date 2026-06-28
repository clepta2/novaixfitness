// src/styles/registerStyles.js
// Estilos da tela de Cadastro - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { layout } from './index';

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingTop: layout.scroll.paddingTop, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: SPACING.massive },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl },
  modalBg: { flex: 1, backgroundColor: 'rgba(18, 22, 26, 0.85)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalCard: { width: '100%', maxHeight: '80%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 16, color: COLORS.primary, marginBottom: SPACING.md },
  modalScroll: { marginBottom: SPACING.lg },
  modalBody: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18, color: COLORS.textTitle },
  modalBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  modalBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
  strengthWrap: { paddingHorizontal: SPACING.xs, marginBottom: SPACING.md },
  strengthBarBg: { height: 4, width: '100%', backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden', marginBottom: SPACING.xs },
  strengthBarFill: { height: '100%', borderRadius: 2 },
  strengthText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textTransform: 'uppercase' },
  helperText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
});
