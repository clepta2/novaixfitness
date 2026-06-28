// src/components/nutrition/ShoppingList.js
// Lista de compras gerada do plano alimentar - NOVAIX FITNESS

import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function extractShoppingItems(mealPlan) {
  if (!mealPlan?.week) return [];

  const itemMap = {};
  const categories = {
    'Proteínas': ['frango', 'peixe', 'ovo', 'carne', 'sardinha', 'tilapia', 'presunto', 'whey'],
    'Carboidratos': ['arroz', 'feijão', 'pão', 'batata', 'macarrão', 'cereal', 'aveia', 'granola', 'mandioca'],
    'Laticínios': ['leite', 'iogurte', 'queijo', 'manteiga'],
    'Frutas': ['banana', 'maçã', 'laranja', 'fruta'],
    'Legumes': ['salada', 'cenoura', 'tomate', 'brócolis', 'legume'],
    'Outros': ['azeite', 'café', 'suco', 'mel'],
  };

  mealPlan.week.forEach(day => {
    day.meals?.forEach(meal => {
      meal.items?.forEach(item => {
        const lower = item.toLowerCase();
        if (!itemMap[lower]) {
          let category = 'Outros';
          for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(k => lower.includes(k))) {
              category = cat;
              break;
            }
          }
          itemMap[lower] = { name: item, category, checked: false };
        }
      });
    });
  });

  return Object.values(itemMap);
}

export default function ShoppingList({ mealPlan }) {
  const [items, setItems] = useState([]);

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
    const unchecked = items.filter(i => !i.checked);
    const html = `
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #CCFF00; background: #12161A; padding: 15px; text-align: center; border-radius: 8px; }
        h3 { color: #12161A; border-bottom: 2px solid #CCFF00; padding-bottom: 5px; margin-top: 20px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        li::before { content: "☐ "; color: #CCFF00; font-weight: bold; }
        .checked { text-decoration: line-through; color: #999; }
      </style></head><body>
        <h1>🛒 LISTA DE COMPRAS NOVAIX</h1>
        <p style="color:#666">${items.length} itens • ${checkedCount} já tem</p>
        ${Object.entries(grouped).map(([cat, catItems]) => `
          <h3>${cat}</h3>
          <ul>${catItems.map(i => `<li class="${i.checked ? 'checked' : ''}">${i.name}</li>`).join('')}</ul>
        `).join('')}
        <p style="text-align:center;color:#999;margin-top:30px;font-size:12px;">Gerado por NOVAIX Fitness • ${new Date().toLocaleDateString('pt-BR')}</p>
      </body></html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Lista de Compras' });
    } catch (err) {
      console.error('Erro ao exportar:', err);
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
    const result = [];
    Object.entries(grouped).forEach(([category, catItems]) => {
      result.push({ type: 'header', category, id: `header-${category}` });
      catItems.forEach(item => {
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
  categoryGroup: { marginBottom: SPACING.md },
  categoryTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, letterSpacing: 1, marginBottom: SPACING.xs },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  itemChecked: { textDecorationLine: 'line-through', color: COLORS.textMuted },
});
