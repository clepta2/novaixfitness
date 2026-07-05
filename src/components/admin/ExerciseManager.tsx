import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Musculacao', muscle_group: '', equipment: '' });

  useEffect(() => { loadExercises(); }, []);

  async function loadExercises() {
    setLoading(true);
    const { data } = await supabase.from('exercises').select('*').order('name');
    setExercises(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: '', category: 'Musculacao', muscle_group: '', equipment: '' });
    setModalVisible(true);
  }

  function openEdit(ex: any) {
    setEditing(ex);
    setForm({ name: ex.name || '', category: ex.category || 'Musculacao', muscle_group: ex.muscle_group || '', equipment: ex.equipment || '' });
    setModalVisible(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return Alert.alert('Erro', 'Nome é obrigatório');
    if (editing) {
      await supabase.from('exercises').update(form).eq('id', editing.id);
    } else {
      await supabase.from('exercises').insert(form);
    }
    setModalVisible(false);
    loadExercises();
  }

  async function handleDelete(id: any) {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await supabase.from('exercises').delete().eq('id', id); loadExercises(); } },
    ]);
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={typography.h5}>EXERCÍCIOS ({exercises.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd} accessibilityLabel="Novo exercício" accessibilityRole="button" accessibilityHint="Abre formulário para criar exercício">
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text style={styles.addBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.lg }} /> : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={exercises}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>{item.category} · {item.muscle_group || '—'} · {item.equipment || '—'}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEdit(item)} accessibilityLabel={`Editar ${item.name}`} accessibilityRole="button"><Ionicons name="pencil" size={18} color={COLORS.primary} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} accessibilityLabel={`Excluir ${item.name}`} accessibilityRole="button"><Ionicons name="trash" size={18} color={COLORS.error} /></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={typography.h4}>{editing ? 'Editar Exercício' : 'Novo Exercício'}</Text>
            <TextInput style={styles.input} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nome do exercício" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Nome do exercício" />
            <TextInput style={styles.input} value={form.category} onChangeText={(t) => setForm({ ...form, category: t })} placeholder="Categoria" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Categoria do exercício" />
            <TextInput style={styles.input} value={form.muscle_group} onChangeText={(t) => setForm({ ...form, muscle_group: t })} placeholder="Grupo muscular" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Grupo muscular" />
            <TextInput style={styles.input} value={form.equipment} onChangeText={(t) => setForm({ ...form, equipment: t })} placeholder="Equipamento" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Equipamento necessário" />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} accessibilityLabel="Cancelar"><Text style={styles.cancelBtnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} accessibilityLabel="Salvar exercício"><Text style={styles.saveBtnText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 8 },
  addBtnText: { ...typography.chipActive, fontSize: 13 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  cardInfo: { flex: 1 },
  cardTitle: typography.cardTitle,
  cardMeta: typography.cardMeta,
  cardActions: { flexDirection: 'row', gap: SPACING.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: SPACING.xl },
  modalContent: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, gap: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', borderWidth: 1, borderColor: COLORS.border },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  cancelBtn: { flex: 1, padding: SPACING.md, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center' },
  cancelBtnText: { color: COLORS.textMuted, fontFamily: 'Montserrat_600SemiBold' },
  saveBtn: { flex: 1, padding: SPACING.md, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnText: typography.chipActive,
});
