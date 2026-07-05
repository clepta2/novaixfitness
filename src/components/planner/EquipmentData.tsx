import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function extractEquipments(exercises: any[] = []) {
  const raw = exercises
    .map(ex => ex.equipment || ex.equipamento || '')
    .filter(Boolean);
  return [...new Set(raw)];
}

export function equipmentToCategory(equipment: string) {
  const lower = equipment.toLowerCase();
  if (lower.includes('haltere') || lower.includes('barra') || lower.includes('anilha') || lower.includes('banco')) return 'equipamentos';
  if (lower.includes('elástico') || lower.includes('corda') || lower.includes('roda') || lower.includes('cinto')) return 'acessorios';
  return 'equipamentos';
}

export function ProductChip({ product, onPress }: any) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  return (
    <TouchableOpacity style={styles.chip} onPress={() => onPress(product)} activeOpacity={0.8}>
      <View style={styles.chipInner}>
        <Ionicons name="storefront-outline" size={14} color={COLORS.primary} />
        <View style={{ flex: 1, marginLeft: SPACING.xs }}>
          <Text style={styles.chipName} numberOfLines={1}>{product.name}</Text>
          <View style={styles.chipPriceRow}>
            <Text style={styles.chipPrice}>R$ {product.price?.toFixed(2)}</Text>
            {hasDiscount && (
              <Text style={styles.chipDiscount}>
                -{Math.round((1 - product.price / product.original_price) * 100)}%
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, width: 180 },
  chipInner: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, gap: SPACING.xs },
  chipName: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textTitle },
  chipPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  chipPrice: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.primary },
  chipDiscount: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.success, backgroundColor: COLORS.success + '20', paddingHorizontal: 4, borderRadius: 4 },
});
