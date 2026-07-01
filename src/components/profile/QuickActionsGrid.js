// src/components/profile/QuickActionsGrid.js
// Grid de ações rápidas do perfil - NOVAIX FITNESS

import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';
import { SECTION_TITLES, QUICK_ACTIONS } from '../../data/profileTexts';

const ACTION_COLORS = {
  '/analytics': COLORS.info,
  '/dashboard': COLORS.slateBlue,
  '/body-measures': COLORS.secondary,
  '/progress-photos': COLORS.success,
  '/(tabs)/perfil/history': COLORS.attention,
  '/export-data': COLORS.primary,
  '/subscription': COLORS.error,
};

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
      <Text style={styles.title}>{SECTION_TITLES.quickActions}</Text>
      <View style={styles.grid}>
        {QUICK_ACTIONS.map((a) => (
          <ActionBtn key={a.route} icon={a.icon} color={ACTION_COLORS[a.route]} bg={ACTION_COLORS[a.route] + '22'} label={a.label} onPress={() => router.push(a.route)} />
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
