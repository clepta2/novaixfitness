import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

const QUICK_TIPS = [
  'Montar treino de peito',
  'Dicas de dieta',
  'Como ganhar massa',
  'Exercicios em casa',
];

export default function QuickTips({ onSendTip }) {
  return (
    <View style={styles.container}>
      <Text style={[typography.caption, { marginBottom: SPACING.sm }]}>Sugestoes:</Text>
      <View style={styles.tipsRow}>
        {QUICK_TIPS.map((tip, i) => (
          <TouchableOpacity key={i} style={styles.tipChip} onPress={() => onSendTip(tip)}>
            <Text style={typography.bodySmall}>{tip}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  tipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tipChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
});
