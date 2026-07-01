// src/components/home/HomeSkeleton.js
// Skeleton de carregamento da Home - NOVAIX FITNESS

import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={120} height={24} borderRadius={4} />
        <Skeleton width={80} height={16} borderRadius={4} />
      </View>

      <View style={styles.card}>
        <Skeleton width="100%" height={140} borderRadius={12} />
        <View style={styles.cardContent}>
          <Skeleton width="60%" height={18} borderRadius={4} />
          <Skeleton width="40%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={100} height={16} borderRadius={4} />
        <View style={styles.grid}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.gridItem}>
              <Skeleton width="100%" height={80} borderRadius={12} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={16} borderRadius={4} />
        <View style={styles.statsRow}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.statItem}>
              <Skeleton width={50} height={50} borderRadius={25} />
              <Skeleton width={40} height={12} borderRadius={4} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  header: { marginBottom: SPACING.xl },
  card: { marginBottom: SPACING.xl },
  cardContent: { marginTop: SPACING.md },
  section: { marginBottom: SPACING.xl },
  grid: { flexDirection: 'row', gap: SPACING.sm },
  gridItem: { flex: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.md },
  statItem: { alignItems: 'center' },
});
