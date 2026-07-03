import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useBlogStyles() {
  return useMemo(() => StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: SPACING.xl, paddingBottom: SPACING.massive },
    header: { marginBottom: SPACING.xxl },
    headerTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, lineHeight: 36, color: COLORS.textTitle },
    headerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.xs },
    categoriesScroll: { marginBottom: SPACING.xl },
    categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
    categoryPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    categoryPillText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.5 },
    categoryPillTextActive: { color: COLORS.background },
    articlesList: { gap: 0 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.massive },
    emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xxxl },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
    detailHeaderTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.border, COLORS.textTitle, COLORS.textDescription, COLORS.textMuted]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.xl, paddingBottom: SPACING.massive },
  header: { marginBottom: SPACING.xxl },
  headerTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, lineHeight: 36, color: COLORS.textTitle },
  headerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.xs },
  categoriesScroll: { marginBottom: SPACING.xl },
  categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  categoryPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryPillText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.5 },
  categoryPillTextActive: { color: COLORS.background },
  articlesList: { gap: 0 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.massive },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xxxl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  detailHeaderTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 },
});
