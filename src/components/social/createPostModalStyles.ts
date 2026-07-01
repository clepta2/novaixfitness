import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  content: { 
    backgroundColor: 'rgba(30, 35, 42, 0.95)', 
    borderTopLeftRadius: BORDER_RADIUS.xl, 
    borderTopRightRadius: BORDER_RADIUS.xl, 
    padding: SPACING.xl, 
    paddingBottom: 40, 
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
    borderBottomWidth: 0
  },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  input: { height: 100, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  imagePreview: { position: 'relative', marginBottom: SPACING.md },
  previewImage: { width: '100%', height: 180, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background },
  removeBtn: { position: 'absolute', top: 8, right: 8 },
  addSecondBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  addSecondText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.primary },
  options: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.xl },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  composerMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  metaLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted, width: 85 },
  metaScroll: { gap: SPACING.xs },
  metaPill: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  metaPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  metaPillText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textDescription },
  metaPillTextActive: { color: COLORS.background },
});
