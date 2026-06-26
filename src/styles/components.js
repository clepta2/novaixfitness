// src/styles/components.js
// Estilos de componentes compartilhados - NOVAIX FITNESS

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS } from '../constants/spacing';

export const components = StyleSheet.create({
  // Input
  inputContainer: { marginBottom: SPACING.lg },
  inputLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  inputFocused: { borderColor: COLORS.primary },
  inputField: { flex: 1, height: '100%', paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16 },

  // Button
  button: { height: 50, borderRadius: BORDER_RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.sm },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },

  // Badge
  badge: { borderRadius: BORDER_RADIUS.full, alignSelf: 'flex-start' },
  badgeText: { fontFamily: 'Montserrat_700Bold' },

  // List item
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  listItemActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },

  // Avatar
  avatar: { backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Montserrat_700Bold', color: COLORS.primary },

  // Progress
  progressTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.sm },
});
