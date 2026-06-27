// src/styles/layout.ts
// Estilos de layout compartilhados - NOVAIX FITNESS com tipagem estrita
// NOTA: Telas devem usar useSafeAreaInsets() para top padding dinâmico

import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

// Fallback safe area top padding (telas devem preferir useSafeAreaInsets)
const SAFE_TOP = Platform.OS === 'ios' ? 54 : 40;

export interface LayoutStyles {
  screen: ViewStyle;
  scroll: ViewStyle;
  centered: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  headerBtn: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionHeader: ViewStyle;
  card: ViewStyle;
  cardActive: ViewStyle;
  divider: ViewStyle;
  dividerLine: ViewStyle;
  dividerText: TextStyle;
  btnPrimary: ViewStyle;
  btnText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
  footerLink: TextStyle;
}

export const layout = StyleSheet.create<LayoutStyles>({
  // Containers
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: SAFE_TOP },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  // Headers
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl },
  headerTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, lineHeight: 36, color: COLORS.textTitle },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },

  // Sections
  section: { marginBottom: SPACING.xxl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, lineHeight: 16, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },

  // Cards
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },

  // Dividers
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textMuted, marginHorizontal: SPACING.md },

  // Buttons
  btnPrimary: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.background, letterSpacing: 1 },

  // Footer
  footer: { padding: SPACING.xl, paddingBottom: 40 },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textDescription },
  footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.primary },
});
