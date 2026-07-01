// src/components/profile/ProfileOptionsTab.tsx
// Aba de opcoes do perfil (tema, links, logout)

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { THEME_OPTIONS } from '../../data/settingsOptions';
import { SECTION_TITLES } from '../../data/profileTexts';

const QUICK_LINKS = [
  { icon: 'notifications-outline', color: COLORS.attention, label: 'Notificacoes', route: '/settings/notifications' },
  { icon: 'color-palette-outline', color: COLORS.purple, label: 'Aparencia', route: '/settings/appearance' },
  { icon: 'language-outline', color: COLORS.cyan, label: 'Idioma', route: '/settings/language' },
  { icon: 'person-outline', color: COLORS.success, label: 'Conta', route: '/settings/account' },
  { icon: 'card-outline', color: COLORS.secondary, label: 'Assinatura', route: '/subscription' },
  { icon: 'download-outline', color: COLORS.success, label: 'Exportar Dados', route: '/export-data' },
  { icon: 'shield-checkmark-outline', color: COLORS.info, label: 'Privacidade', route: '/(tabs)/perfil/lgpd' },
  { icon: 'ribbon-outline', color: COLORS.purple, label: 'Seja um Coach', route: '/register-coach' },
  { icon: 'help-circle-outline', color: COLORS.textMuted, label: 'Ajuda', route: '/(tabs)/ajuda' },
];

interface Props {
  themeMode: string;
  setThemeMode: (mode: string) => void;
  signOut: () => void;
  isCreator?: boolean;
}

export default function ProfileOptionsTab({ themeMode, setThemeMode, signOut, isCreator }: Props) {
  const router = useRouter();
  const links = isCreator
    ? [...QUICK_LINKS, { icon: 'analytics-outline', color: COLORS.primary, label: 'Painel do Coach', route: '/coach-dashboard' }]
    : QUICK_LINKS;

  return (
    <View>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="color-palette" size={18} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>{SECTION_TITLES.appearance}</Text>
        </View>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.key} style={[styles.themeBtn, themeMode === opt.key && styles.themeBtnActive]} onPress={() => setThemeMode(opt.key)}>
              <Ionicons name={opt.icon} size={20} color={themeMode === opt.key ? COLORS.background : COLORS.textMuted} />
              <Text style={[styles.themeBtnText, themeMode === opt.key && styles.themeBtnTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid" size={18} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>{SECTION_TITLES.shortcuts}</Text>
        </View>
        {links.map((link, index) => (
          <TouchableOpacity key={link.route} style={styles.quickLink} onPress={() => router.push(link.route)}>
            <View style={[styles.quickLinkIcon, { backgroundColor: link.color + '15' }]}>
              <Ionicons name={link.icon} size={18} color={link.color} />
            </View>
            <Text style={styles.quickLinkText}>{link.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert(SECTION_TITLES.logoutTitle, SECTION_TITLES.logoutMessage, [{ text: SECTION_TITLES.logoutCancel, style: 'cancel' }, { text: SECTION_TITLES.logoutConfirm, style: 'destructive', onPress: signOut }])}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>{SECTION_TITLES.logoutConfirm}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  themeRow: { flexDirection: 'row', gap: SPACING.sm },
  themeBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  themeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.sm },
  themeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  themeBtnTextActive: { color: COLORS.background },
  quickLink: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  quickLinkIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  quickLinkText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '12', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.xl },
  logoutText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.error },
});
