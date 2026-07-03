import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export function useMarketplaceDetailStyles() {
  return useMemo(() => StyleSheet.create({
    centered: { justifyContent: 'center', alignItems: 'center' },
    imageSection: { height: 280, backgroundColor: COLORS.surfaceElevated, position: 'relative' },
    backBtn: { position: 'absolute', top: 48, left: SPACING.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    topActions: { position: 'absolute', top: 48, right: SPACING.xl, flexDirection: 'row', gap: SPACING.sm },
    shareBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    discountBadge: { position: 'absolute', bottom: SPACING.md, left: SPACING.xl, backgroundColor: COLORS.error, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
    discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#FFF' },
    content: { padding: SPACING.xl },
    categoryTag: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.5, marginBottom: SPACING.xs },
    productName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: 4 },
    brand: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
    priceSection: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: SPACING.md },
    price: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.primary },
    originalPrice: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textDecorationLine: 'line-through' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.xl },
    ratingText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
    descSection: { marginBottom: SPACING.xl },
    description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 22, marginTop: SPACING.sm },
    actionRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    buyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, height: 52 },
    buyBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
    whatsappBtn: { width: 52, height: 52, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.whatsapp + '40', justifyContent: 'center', alignItems: 'center' },
    relatedSection: { marginTop: SPACING.lg },
    relatedScroll: { marginTop: SPACING.md },
    relatedCard: { width: 160, marginRight: SPACING.md },
  }), [COLORS.background, COLORS.primary, COLORS.surface, COLORS.surfaceElevated, COLORS.border, COLORS.error, COLORS.textTitle, COLORS.textDescription, COLORS.textMuted, COLORS.whatsapp]);
}

// Backward-compatible static export
export const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center' },
  imageSection: { height: 280, backgroundColor: COLORS.surfaceElevated, position: 'relative' },
  backBtn: { position: 'absolute', top: 48, left: SPACING.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  topActions: { position: 'absolute', top: 48, right: SPACING.xl, flexDirection: 'row', gap: SPACING.sm },
  shareBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  discountBadge: { position: 'absolute', bottom: SPACING.md, left: SPACING.xl, backgroundColor: COLORS.error, paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#FFF' },
  content: { padding: SPACING.xl },
  categoryTag: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0.5, marginBottom: SPACING.xs },
  productName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: 4 },
  brand: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  priceSection: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: SPACING.md },
  price: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.primary },
  originalPrice: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.xl },
  ratingText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
  descSection: { marginBottom: SPACING.xl },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 22, marginTop: SPACING.sm },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  buyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, height: 52 },
  buyBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  whatsappBtn: { width: 52, height: 52, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.whatsapp + '40', justifyContent: 'center', alignItems: 'center' },
  relatedSection: { marginTop: SPACING.lg },
  relatedScroll: { marginTop: SPACING.md },
  relatedCard: { width: 160, marginRight: SPACING.md },
});
