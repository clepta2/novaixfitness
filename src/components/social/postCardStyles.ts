import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'rgba(30, 35, 42, 0.85)', 
    borderRadius: BORDER_RADIUS.lg, 
    padding: SPACING.lg, 
    marginBottom: SPACING.md, 
    borderWidth: 1, 
    borderColor: 'rgba(204, 255, 0, 0.15)',
    shadowColor: COLORS.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    elevation: 4
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  userInfo: { flex: 1, marginLeft: SPACING.md },
  userName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  menuBtn: { padding: SPACING.xs },
  content: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20, marginBottom: SPACING.md },
  image: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md, backgroundColor: COLORS.background },
  video: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md, backgroundColor: COLORS.background },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.sm },
  typeText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, letterSpacing: 0.5 },
  headerStatusText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription },
  headerStatusBold: { fontFamily: 'Inter_600SemiBold', color: COLORS.textTitle },
  metaBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.primary + '15', marginRight: SPACING.xs, marginVertical: 2 },
  metaBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.primary },
  heartOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  shareMenu: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, borderBottomWidth: 0 },
  shareMenuTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.lg },
  shareOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  shareIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  shareOptionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDescription },
  shareCancelBtn: { marginTop: SPACING.lg, paddingVertical: SPACING.md, alignItems: 'center', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.md },
  shareCancelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textMuted },
  // Custom video styles
  skipIndicator: { backgroundColor: 'rgba(0,0,0,0.6)', padding: SPACING.md, borderRadius: BORDER_RADIUS.full, alignItems: 'center', gap: 4 },
  skipText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: 'white' },
  customScrubber: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  scrubberProgress: { height: '100%', backgroundColor: COLORS.primary },
});
