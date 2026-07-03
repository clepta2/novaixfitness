import { useState, useEffect, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getProducts } from '../../services/marketplace';
import { extractEquipments, equipmentToCategory, ProductChip } from './EquipmentData';

interface EquipmentSuggestionsProps {
  exercises?: any[];
}

export default memo(function EquipmentSuggestions({ exercises = [] }: EquipmentSuggestionsProps) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exercises.length) return;
    const equipments = extractEquipments(exercises);
    if (!equipments.length) return;

    setLoading(true);
    const category = equipmentToCategory(equipments[0]);

    getProducts({ category, limit: 4 })
      .then(data => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [exercises.length]);

  if (!exercises.length || (!loading && products.length === 0)) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="storefront" size={16} color={COLORS.primary} />
        <Text style={styles.title}>EQUIPAMENTOS SUGERIDOS</Text>
        <TouchableOpacity onPress={() => router.push('/marketplace')} accessibilityRole="button">
          <Text style={styles.seeAll}>Ver loja →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.sm }} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {products.map(p => (
            <ProductChip
              key={p.id}
              product={p}
              onPress={prod => router.push({ pathname: '/marketplace-detail', params: { id: prod.id } })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.xs },
  title: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle, letterSpacing: 1, marginLeft: 4 },
  seeAll: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
  scroll: { gap: SPACING.sm, paddingVertical: SPACING.xs },
});
