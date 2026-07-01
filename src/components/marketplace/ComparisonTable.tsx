import { View, Text, ScrollView, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ComparisonProduct {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  original_price?: number;
  rating?: number;
  brand?: string;
  description?: string;
  marketplace_categories?: { name: string; color?: string };
}

interface ComparisonTableProps {
  products: ComparisonProduct[];
  visible: boolean;
  onClose: () => void;
}

const FIELDS = [
  { key: 'price', label: 'Preço', format: (v: any) => `R$ ${Number(v)?.toFixed(2)}` },
  { key: 'rating', label: 'Avaliação', format: (v: any) => v > 0 ? `${v?.toFixed(1)} ★` : 'Sem avaliação' },
  { key: 'brand', label: 'Marca', format: (v: any) => v || 'N/A' },
  { key: 'category_name', label: 'Categoria', getFrom: (p: ComparisonProduct) => p.marketplace_categories?.name },
  { key: 'description', label: 'Descrição', format: (v: any) => v ? `${v.slice(0, 100)}...` : 'N/A' },
];

export default function ComparisonTable({ products, visible, onClose }: ComparisonTableProps) {
  if (!visible || !products || products.length < 2) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>COMPARAR PRODUTOS</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
            {products.map(p => (
              <View key={p.id} style={styles.column}>
                <View style={styles.imageWrap}>
                  {p.image_url ? (
                    <Image source={{ uri: p.image_url }} style={styles.image} resizeMode="cover" />
                  ) : (
                    <View style={styles.placeholder}>
                      <Ionicons name="image-outline" size={28} color={COLORS.textMuted} />
                    </View>
                  )}
                </View>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                {FIELDS.map(f => (
                  <View key={f.key} style={styles.row}>
                    <Text style={styles.label}>{f.label}</Text>
                    <Text style={styles.value}>{(f as any).getFrom ? (f as any).getFrom(p) : f.format((p as any)[f.key])}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  container: { backgroundColor: COLORS.background, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, maxHeight: '80%', paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  closeBtn: { padding: SPACING.xs },
  scroll: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  column: { width: 180, marginRight: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  imageWrap: { height: 100, backgroundColor: COLORS.surfaceElevated },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  productName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, padding: SPACING.sm, paddingBottom: SPACING.xs },
  row: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
  value: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textTitle },
});
