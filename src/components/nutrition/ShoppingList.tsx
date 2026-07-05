import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { extractShoppingItems, generateShoppingHTML } from '../../helpers/shoppingListHelper';

export default function ShoppingList({ mealPlan }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (mealPlan) setItems(extractShoppingItems(mealPlan));
  }, [mealPlan]);

  const toggleItem = (index) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const grouped = useMemo(() => {
    const groups = {};
    items.forEach((item, index) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push({ ...item, index });
    });
    return groups;
  }, [items]);

  const checkedCount = items.filter(i => i.checked).length;

  const handleExport = async () => {
    try {
      const html = generateShoppingHTML(items, grouped, checkedCount);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Lista de Compras' });
    } catch (err) {
      if (__DEV__) console.error('Erro ao exportar:', err);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={32} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Gere um plano alimentar para criar a lista</Text>
      </View>
    );
  }

  const flatData = useMemo(() => {
    const result: any[] = [];
    Object.entries(grouped).forEach(([category, catItems]) => {
      result.push({ type: 'header', category, id: `header-${category}` });
      (catItems as any[]).forEach(item => {
        result.push({ type: 'item', ...item, id: `item-${item.index}` });
      });
    });
    return result;
  }, [grouped]);

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.categoryTitle}>{item.category}</Text>;
    }
    return (
      <TouchableOpacity style={styles.itemRow} onPress={() => toggleItem(item.index)}>
        <Ionicons name={item.checked ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={item.checked ? COLORS.success : COLORS.textMuted} />
        <Text style={[styles.itemText, item.checked && styles.itemChecked]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LISTA DE COMPRAS</Text>
        <TouchableOpacity onPress={handleExport} style={styles.exportBtn}>
          <Ionicons name="share-outline" size={16} color={COLORS.primary} />
          <Text style={styles.exportText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.progress}>{checkedCount}/{items.length} itens verificados</Text>

      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        data={flatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  empty: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xxl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.sm },
  exportText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  progress: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  scroll: { maxHeight: 300 },
  categoryTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, letterSpacing: 1, marginBottom: SPACING.xs },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  itemChecked: { textDecorationLine: 'line-through', color: COLORS.textMuted },
});
