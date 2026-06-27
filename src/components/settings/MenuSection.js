import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function MenuSection({ title, items, onPress }) {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>{title}</Text>
      {items.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.item}
          onPress={() => item.route ? onPress(item.route) : item.version ? null : onPress(item.action)}
        >
          <View style={[styles.icon, { backgroundColor: item.color + '15' }]}>
            <Ionicons name={item.icon} size={18} color={item.color} />
          </View>
          <Text style={[typography.h5, { flex: 1 }]}>{item.label}</Text>
          {item.version ? (
            <Text style={typography.caption}>v{item.version}</Text>
          ) : (
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
