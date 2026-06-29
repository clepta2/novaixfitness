import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default memo(function CompareBar({ selectedProducts, onCompare, onClear, maxCompare = 3 }) {
  if (!selectedProducts || selectedProducts.length < 2) return null;

  return (
    <View style={styles.bar}>
      <View style={styles.info}>
        <Ionicons name="git-compare-outline" size={18} color={COLORS.primary} />
        <Text style={styles.count}>{selectedProducts.length}/{maxCompare} selecionados</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.compareBtn} onPress={onCompare}>
          <Text style={styles.compareText}>Comparar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surfaceElevated, borderTopWidth: 1, borderTopColor: COLORS.border, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, position: 'absolute', bottom: 0, left: 0, right: 0 },
  info: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  count: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  clearBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  clearText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  compareBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  compareText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
});
