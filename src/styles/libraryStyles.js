// src/styles/libraryStyles.js
// Estilos para a tela de Biblioteca de Treinos - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { typography } from './typography';

export const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  favScroll: { marginLeft: -SPACING.xl, paddingLeft: SPACING.xl },
  statsCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  searchRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, height: 42, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { ...typography.inputField, flex: 1 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, height: 42, borderWidth: 1, borderColor: COLORS.border },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  filterBtnTextActive: { color: COLORS.background },
  pillsScroll: { marginBottom: SPACING.md },
  pillsContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  pillText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textDescription },
  clearAllBtn: { paddingHorizontal: SPACING.sm },
  clearAllText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  empty: { alignItems: 'center', padding: SPACING.xl, gap: SPACING.sm },
});
