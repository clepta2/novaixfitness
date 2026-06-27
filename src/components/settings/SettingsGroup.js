import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function SettingsGroup({ title, items, settings, onToggle }) {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>{title}</Text>
      {items.map((item) => (
        <View key={item.key} style={styles.item}>
          <View style={styles.left}>
            <View style={[styles.icon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={styles.info}>
              <Text style={typography.h5}>{item.label}</Text>
              <Text style={typography.caption}>{item.desc}</Text>
            </View>
          </View>
          <Switch
            value={settings[item.key]}
            onValueChange={() => onToggle(item.key)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={settings[item.key] ? COLORS.background : COLORS.textMuted}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
});
