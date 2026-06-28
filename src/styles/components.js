// src/styles/components.js
// Estilos de componentes compartilhados - NOVAIX FITNESS com tema dinâmico

import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const components = {
  // Input
  get inputContainer() { return { marginBottom: SPACING.lg }; },
  get inputLabel() { return { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }; },
  get inputWrapper() { return { flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border }; },
  get inputFocused() { return { borderColor: COLORS.primary }; },
  get inputField() { return { flex: 1, height: '100%', paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16 }; },

  // Button
  get button() { return { height: 50, borderRadius: BORDER_RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm }; },
  get buttonText() { return { fontFamily: 'Montserrat_700Bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }; },

  // Badge
  get badge() { return { borderRadius: BORDER_RADIUS.full, alignSelf: 'flex-start' }; },
  get badgeText() { return { fontFamily: 'Montserrat_700Bold' }; },

  // List item
  get listItem() { return { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border }; },
  get listItemActive() { return { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary }; },

  // Avatar
  get avatar() { return { backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' }; },
  get avatarText() { return { fontFamily: 'Montserrat_700Bold', color: COLORS.primary }; },

  // Progress
  get progressTrack() { return { height: 8, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' }; },
  get progressFill() { return { height: '100%', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm }; },
};
