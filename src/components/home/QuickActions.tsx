import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

const ACTIONS = [
  { icon: 'restaurant', label: 'Nutrição', route: '/nutrition', color: COLORS.success },
  { icon: 'body', label: 'Medidas', route: '/body-measures', color: COLORS.secondary },
  { icon: 'camera', label: 'Fotos', route: '/progress-photos', color: COLORS.info },
  { icon: 'stats-chart', label: 'Progresso', route: '/dashboard', color: COLORS.primary },
  { icon: 'chatbubbles', label: 'Coach IA', route: '/chat-coach', color: COLORS.fuchsia },
  { icon: 'calendar', label: 'Planner', route: '/planner', color: COLORS.cyan },
];

function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AÇÕES RÁPIDAS</Text>
      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <TouchableOpacity key={action.route} style={styles.btn} onPress={() => router.push(action.route)} activeOpacity={0.7}>
            <View style={[styles.iconWrap, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon} size={22} color={action.color} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default memo(QuickActions);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  btn: { width: '30%', alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: scale(52), height: scale(52), borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, textAlign: 'center' },
});
