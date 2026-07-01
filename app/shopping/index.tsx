// @ts-nocheck
// app/shopping/index.js
// Lista de compras gerada por IA

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { ErrorBoundary } from '../../src/components';
import { useMountedRef } from '../../src/hooks/useMountedRef';
import { generateShoppingList, saveShoppingList, getShoppingList } from '../../src/services/shoppingList';

export default function ShoppingScreen() {
  const router = useRouter();
  const { user, onboarding } = useAuth();
  const mounted = useMountedRef();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadList(); }, [user?.id]);

  const loadList = async () => {
    if (!user?.id) return;
    setLoading(true);
    const saved = await getShoppingList(user.id);
    if (!mounted.current) return;
    if (saved) { setList(saved); setLoading(false); return; }
    await generateNewList();
  };

  const generateNewList = async () => {
    setGenerating(true);
    try {
      const newList = await generateShoppingList(null, { weight: onboarding?.weight, goal: onboarding?.goal, dietaryRestrictions: onboarding?.dietaryRestrictions });
      if (!mounted.current) return;
      if (newList) { setList(newList); await saveShoppingList(user.id, newList); }
    } catch (err) { Alert.alert('Erro', 'Não foi possível gerar a lista'); }
    finally { if (mounted.current) { setGenerating(false); setLoading(false); } }
  };

  const toggleItem = (catIndex, itemIndex) => {
    const newList = { ...list };
    newList.categories = [...list.categories];
    newList.categories[catIndex] = { ...newList.categories[catIndex] };
    newList.categories[catIndex].items = [...newList.categories[catIndex].items];
    newList.categories[catIndex].items[itemIndex] = { ...newList.categories[catIndex].items[itemIndex], checked: !newList.categories[catIndex].items[itemIndex].checked };
    setList(newList);
    saveShoppingList(user.id, newList);
  };

  const shareList = () => {
    if (!list) return;
    let text = '🛒 LISTA DE COMPRAS NOVAIX\n\n';
    list.categories?.forEach(cat => {
      text += `${cat.name}:\n`;
      cat.items?.forEach(item => { text += `${item.checked ? '✅' : '⬜'} ${item.name} - ${item.amount}\n`; });
      text += '\n';
    });
    Alert.alert('Compartilhar', text, [{ text: 'OK' }]);
  };

  const totalItems = list?.categories?.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) || 0;
  const checkedItems = list?.categories?.reduce((sum, cat) => sum + (cat.items?.filter(i => i.checked)?.length || 0), 0) || 0;

  return (
    <ErrorBoundary screenName="Shopping">
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.textMuted} /></TouchableOpacity>
        <Text style={styles.headerTitle}>LISTA DE COMPRAS</Text>
        <TouchableOpacity onPress={shareList}><Ionicons name="share" size={24} color={COLORS.primary} /></TouchableOpacity>
      </View>

      {list && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{checkedItems}/{totalItems}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <TouchableOpacity style={styles.statCard} accessibilityLabel="Gerar nova lista" accessibilityRole="button" onPress={generateNewList}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
            <Text style={[styles.statLabel, { color: COLORS.primary }]}>Gerar nova</Text>
          </TouchableOpacity>
        </View>
      )}

      {generating ? (
        <View style={styles.loadingBox}>
          <Ionicons name="sync" size={32} color={COLORS.primary} />
          <Text style={styles.loadingText}>Gerando lista com IA...</Text>
        </View>
      ) : list?.categories ? (
        <FlatList data={list.categories} keyExtractor={(item, i) => String(i)} contentContainerStyle={styles.list} renderItem={({ item: cat, index: catIndex }) => (
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>{cat.name}</Text>
            {cat.items?.map((item, itemIndex) => (
              <TouchableOpacity key={itemIndex} style={styles.itemRow} accessibilityLabel={`Marcar ${item.name}`} accessibilityRole="checkbox" onPress={() => toggleItem(catIndex, itemIndex)}>
                <Ionicons name={item.checked ? 'checkbox' : 'square-outline'} size={20} color={item.checked ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.itemName, item.checked && styles.itemChecked]}>{item.name}</Text>
                <Text style={styles.itemAmount}>{item.amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )} />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhuma lista ainda</Text>
          <TouchableOpacity style={styles.generateBtn} accessibilityLabel="Gerar Lista" accessibilityRole="button" onPress={generateNewList}>
            <Text style={styles.generateBtnText}>GERAR LISTA</Text>
          </TouchableOpacity>
        </View>
      )}

      {list?.tips && list.tips.length > 0 && (
        <View style={styles.tipsBox}>
          <Ionicons name="bulb" size={16} color={COLORS.primary} />
          <Text style={styles.tipsText}>{list.tips[0]}</Text>
        </View>
      )}
    </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  list: { padding: SPACING.lg },
  categoryCard: { marginBottom: SPACING.lg },
  categoryName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.sm },
  itemName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  itemChecked: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  itemAmount: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.lg },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  generateBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  generateBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  tipsBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, margin: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  tipsText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },
});

