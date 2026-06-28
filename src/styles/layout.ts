// src/styles/layout.ts
// Estilos de layout compartilhados - NOVAIX FITNESS com tipagem estrita e tema dinâmico
// NOTA: Telas devem usar useSafeAreaInsets() para top padding dinâmico

import { Platform, ViewStyle, TextStyle } from 'react-native';
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

export const layout: LayoutStyles = {
  // Containers
  get screen(): ViewStyle { return { flex: 1, backgroundColor: COLORS.background }; },
  get scroll(): ViewStyle { return { padding: SPACING.xl, paddingTop: SAFE_TOP }; },
  get centered(): ViewStyle { return { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }; },

  // Headers
  get header(): ViewStyle { return { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl }; },
  get headerTitle(): TextStyle { return { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, lineHeight: 36, color: COLORS.textTitle }; },
  get headerBtn(): ViewStyle { return { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' }; },

  // Sections
  get section(): ViewStyle { return { marginBottom: SPACING.xxl }; },
  get sectionTitle(): TextStyle { return { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, lineHeight: 16, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md }; },
  get sectionHeader(): ViewStyle { return { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }; },

  // Cards
  get card(): ViewStyle { return { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border }; },
  get cardActive(): ViewStyle { return { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' }; },

  // Dividers
  get divider(): ViewStyle { return { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl }; },
  get dividerLine(): ViewStyle { return { flex: 1, height: 1, backgroundColor: COLORS.border }; },
  get dividerText(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textMuted, marginHorizontal: SPACING.md }; },

  // Buttons
  get btnPrimary(): ViewStyle { return { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md }; },
  get btnText(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.background, letterSpacing: 1 }; },

  // Footer
  get footer(): ViewStyle { return { flexDirection: 'row', gap: SPACING.md, padding: SPACING.xl, paddingBottom: 40 }; },
  get footerText(): TextStyle { return { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: COLORS.textDescription }; },
  get footerLink(): TextStyle { return { fontFamily: 'Montserrat_700Bold', fontSize: 14, lineHeight: 20, color: COLORS.primary }; },
};
