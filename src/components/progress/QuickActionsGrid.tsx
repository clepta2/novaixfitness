import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ACTIONS = [
  { icon: 'camera', color: COLORS.success, label: 'Fotos', route: '/progress-photos', bg: COLORS.success + '22' },
  { icon: 'body', color: COLORS.info, label: 'Medições', route: '/body-measures', bg: COLORS.info + '22' },
  { icon: 'document-text', color: COLORS.purple, label: 'Relatório', route: '/progress/report', bg: COLORS.purple + '22' },
  { icon: 'star', color: COLORS.secondary, label: 'Revisão', route: '/progress/monthlyReview', bg: COLORS.secondary + '22' },
];

function QuickActionsGrid(): React.JSX.Element {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.route}
          style={styles.btn}
          onPress={() => router.push(a.route)}
          accessibilityLabel={a.label}
          accessibilityRole="button"
          activeOpacity={0.75}
        >
          <View style={[styles.iconWrap, { backgroundColor: a.bg }]}>
            <Ionicons name={a.icon as any} size={22} color={a.color} />
          </View>
          <Text style={styles.label}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default memo(QuickActionsGrid);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  btn: { width: '22.5%', alignItems: 'center', gap: SPACING.xs },
  iconWrap: { width: 52, height: 52, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textDescription, textAlign: 'center' },
});
