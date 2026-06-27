// src/styles/homeStyles.js
// Estilos para a tela principal (Home) - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { scale } from '../utils/responsive';

export const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, height: 42, justifyContent: 'center' },
  streakText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(12), color: COLORS.primary },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.md, height: 42, justifyContent: 'center' },
  levelText: { fontFamily: 'Montserrat_700Bold', fontSize: scale(11) },
  categoriesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  categoryCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  categoryIconWrap: {
    width: scale(48),
    height: scale(48),
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: scale(11),
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  categoryCount: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(10),
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});
