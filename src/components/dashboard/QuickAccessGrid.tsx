import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface QuickAccessGridProps {
  router: { push: (route: string) => void };
}

const ITEMS = [
  { icon: 'bar-chart', label: 'Analytics', route: '/analytics', color: COLORS.primary },
  { icon: 'calendar', label: 'Semanal', route: '/weekly-progress', color: COLORS.success },
  { icon: 'body', label: 'Medidas', route: '/body-measures', color: COLORS.secondary },
  { icon: 'camera', label: 'Fotos', route: '/progress-photos', color: COLORS.attention },
  { icon: 'nutrition', label: 'Nutrição', route: '/nutrition', color: COLORS.info },
  { icon: 'trophy', label: 'Conquistas', route: '/achievements', color: COLORS.attention },
];

export default function QuickAccessGrid({ router }: QuickAccessGridProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ACESSO RÁPIDO</Text>
      <View style={styles.grid}>
        {ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.item} onPress={() => router.push(item.route)} accessibilityLabel={`Acesso rápido: ${item.label}`} accessibilityRole="button">
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  item: { width: '30%', alignItems: 'center', gap: SPACING.xs },
  iconContainer: { width: 56, height: 56, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
