// src/styles/layout.js
// Estilos de layout compartilhados - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const layout = StyleSheet.create({
  // Containers
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: 60 },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  // Headers
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl },
  headerTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },

  // Sections
  section: { marginBottom: SPACING.xxl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },

  // Cards
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },

  // Dividers
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginHorizontal: SPACING.md },

  // Buttons
  btnPrimary: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },

  // Footer
  footer: { padding: SPACING.xl, paddingBottom: 40 },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
});
