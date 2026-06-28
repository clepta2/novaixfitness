// src/components/profile/QuickActionsGrid.js
// Grid de ações rápidas do perfil - NOVAIX FITNESS

import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

const ACTIONS = [
  { icon: 'stats-chart', color: COLORS.info, label: 'Analytics', route: '/analytics', bg: COLORS.info + '22' },
  { icon: 'grid', color: COLORS.slateBlue, label: 'Dashboard', route: '/dashboard', bg: COLORS.slateBlue + '22' },
  { icon: 'body', color: COLORS.secondary, label: 'Medidas', route: '/body-measures', bg: COLORS.secondary + '22' },
  { icon: 'camera', color: COLORS.success, label: 'Progresso', route: '/progress-photos', bg: COLORS.success + '22' },
  { icon: 'time', color: COLORS.attention, label: 'Histórico', route: '/(tabs)/perfil/history', bg: COLORS.attention + '22' },
  { icon: 'download', color: COLORS.primary, label: 'Exportar', route: '/export-data', bg: COLORS.primary + '22' },
  { icon: 'card', color: COLORS.error, label: 'Assinatura', route: '/subscription', bg: COLORS.error + '22' },
  { icon: 'settings', color: COLORS.textDescription, label: 'Config.', route: '/settings', bg: COLORS.textDescription + '22' },
];

function ActionBtn({ icon, color, bg, label, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={ICON_SIZES.md} color={color} />
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

function QuickActionsGrid() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AÇÕES RÁPIDAS</Text>
      <View style={styles.grid}>
        {ACTIONS.map((a) => (
          <ActionBtn key={a.route} {...a} onPress={() => router.push(a.route)} />
        ))}
      </View>
    </View>
  );
}

export default memo(QuickActionsGrid);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(11), color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  btn: { width: '22.5%', alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: scale(52), height: scale(52), borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: scale(10), color: COLORS.textDescription, textAlign: 'center' },
});
