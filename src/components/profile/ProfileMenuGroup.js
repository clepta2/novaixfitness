// src/components/profile/ProfileMenuGroup.js
// Menu do perfil agrupado e colapsável - NOVAIX FITNESS

import { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

const MENU_GROUPS = [
  {
    key: 'conta',
    label: 'CONTA',
    icon: 'person-circle',
    color: COLORS.slateBlue,
    items: [
      { icon: 'notifications-outline', color: COLORS.attention, label: 'Notificações', route: '/notifications' },
      { icon: 'card-outline', color: COLORS.secondary, label: 'Minha Assinatura', route: '/subscription' },
      { icon: 'settings-outline', color: COLORS.textDescription, label: 'Configurações', route: '/settings' },
    ],
  },
  {
    key: 'progresso',
    label: 'PROGRESSO',
    icon: 'trending-up',
    color: COLORS.primary,
    items: [
      { icon: 'stats-chart-outline', color: COLORS.info, label: 'Analytics', route: '/analytics' },
      { icon: 'grid-outline', color: COLORS.slateBlue, label: 'Dashboard', route: '/dashboard' },
      { icon: 'calendar-outline', color: COLORS.cyan, label: 'Progresso Semanal', route: '/weekly-progress' },
    ],
  },
  {
    key: 'dados',
    label: 'MEUS DADOS',
    icon: 'body',
    color: COLORS.secondary,
    items: [
      { icon: 'body-outline', color: COLORS.secondary, label: 'Medidas Corporais', route: '/body-measures' },
      { icon: 'camera-outline', color: COLORS.success, label: 'Fotos de Progresso', route: '/progress-photos' },
      { icon: 'download-outline', color: COLORS.primary, label: 'Exportar Dados', route: '/export-data' },
    ],
  },
  {
    key: 'info',
    label: 'INFORMAÇÕES',
    icon: 'information-circle',
    color: COLORS.info,
    items: [
      { icon: 'shield-checkmark-outline', color: COLORS.info, label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd' },
      { icon: 'help-circle-outline', color: COLORS.textDescription, label: 'Ajuda & FAQ', route: '/(tabs)/ajuda' },
      { icon: 'information-circle-outline', color: COLORS.cyan, label: 'Conheça-nos', route: '/(tabs)/perfil/conheca-nos' },
      { icon: 'link-outline', color: COLORS.fuchsia, label: 'Links e Redes Sociais', route: '/(tabs)/perfil/links' },
      { icon: 'document-text-outline', color: COLORS.attention, label: 'Termos e Políticas', route: '/(tabs)/perfil/termos' },
    ],
  },
];

function MenuItem({ icon, color, label, route }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.item} onPress={() => router.push(route)} activeOpacity={0.7}>
      <View style={[styles.itemIcon, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={ICON_SIZES.sm} color={color} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

function MenuGroup({ group }) {
  const [open, setOpen] = useState(group.key === 'conta');
  return (
    <View style={styles.group}>
      <TouchableOpacity style={styles.groupHeader} onPress={() => setOpen(!open)} activeOpacity={0.8}>
        <View style={[styles.groupIcon, { backgroundColor: group.color + '22' }]}>
          <Ionicons name={group.icon} size={ICON_SIZES.sm} color={group.color} />
        </View>
        <Text style={styles.groupLabel}>{group.label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
      {open && (
        <View style={styles.itemsContainer}>
          {group.items.map((item) => (
            <MenuItem key={item.route} {...item} />
          ))}
        </View>
      )}
    </View>
  );
}

function ProfileMenuGroup() {
  return (
    <View style={styles.container}>
      {MENU_GROUPS.map((g) => (
        <MenuGroup key={g.key} group={g} />
      ))}
    </View>
  );
}

export default memo(ProfileMenuGroup);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  group: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg },
  groupIcon: { width: scale(36), height: scale(36), borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  groupLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: scale(13), color: COLORS.textTitle, letterSpacing: 0.5 },
  itemsContainer: { borderTopWidth: 1, borderTopColor: COLORS.border },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  itemIcon: { width: scale(32), height: scale(32), borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: scale(14), color: COLORS.textDescription },
});
