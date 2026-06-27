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
  { icon: 'stats-chart', color: '#3B82F6', label: 'Analytics', route: '/analytics', bg: '#3B82F622' },
  { icon: 'grid', color: '#8B5CF6', label: 'Dashboard', route: '/dashboard', bg: '#8B5CF622' },
  { icon: 'body', color: '#FF6B35', label: 'Medidas', route: '/body-measures', bg: '#FF6B3522' },
  { icon: 'camera', color: '#00E676', label: 'Progresso', route: '/progress-photos', bg: '#00E67622' },
  { icon: 'time', color: '#FFD600', label: 'Histórico', route: '/(tabs)/perfil/history', bg: '#FFD60022' },
  { icon: 'download', color: COLORS.primary, label: 'Exportar', route: '/export-data', bg: COLORS.primary + '22' },
  { icon: 'card', color: '#FF1744', label: 'Assinatura', route: '/subscription', bg: '#FF174422' },
  { icon: 'settings', color: '#94A3B8', label: 'Config.', route: '/settings', bg: '#94A3B822' },
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
