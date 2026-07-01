import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  timerSection: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  timerLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 2, marginBottom: SPACING.xs },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, color: COLORS.primary, fontVariant: ['tabular-nums'] },
  timerRest: { color: COLORS.info },
  exercise: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle, marginTop: SPACING.sm },
  hostControls: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  controlBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surfaceElevated, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full },
  controlText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  participantsBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  participantCount: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  endBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  endText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.error },
  participantsList: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, maxHeight: 60 },
  participantChip: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surfaceElevated, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, marginRight: SPACING.sm },
  participantName: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textTitle, maxWidth: 80 },
  chatArea: { flex: 1, paddingHorizontal: SPACING.lg },
  message: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md, maxWidth: '80%' },
  messageOwn: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  messageContent: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, paddingHorizontal: SPACING.md },
  messageAuthor: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, marginBottom: 2 },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  messageTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { padding: SPACING.sm },
});
