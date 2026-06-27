// src/styles/playerStyles.js
// Estilos para a tela do Player de Treinos - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';
import { layout } from './layout';
import { typography } from './typography';

export const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingDot: { width: 40, height: 40, borderRadius: BORDER_RADIUS.xl, backgroundColor: COLORS.primary },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.lg },
  startText: typography.button,
  exerciseList: { gap: SPACING.sm },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  exerciseNumber: { width: 32, height: 32, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  exerciseNum: typography.stat,
  exerciseInfo: { flex: 1 },
  timerSection: { alignItems: 'center', marginVertical: SPACING.xl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  infoText: typography.h5,
  bottomSpacer: { height: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voiceToggle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
});
