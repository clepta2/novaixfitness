import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

export default function WorkoutManager() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Musculacao', level: 'Iniciante', duration_minutes: 30, video_id: '', is_premium: false });

  useEffect(() => { loadWorkouts(); }, []);

  async function loadWorkouts() {
    setLoading(true);
    const { data } = await supabase.from('workouts').select('*').order('created_at', { ascending: false });
    setWorkouts(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ title: '', category: 'Musculacao', level: 'Iniciante', duration_minutes: 30, video_id: '', is_premium: false });
    setModalVisible(true);
  }

  function openEdit(workout) {
    setEditing(workout);
    setForm({ title: workout.title || '', category: workout.category || 'Musculacao', level: workout.level || 'Iniciante', duration_minutes: workout.duration_minutes || 30, video_id: workout.video_id || '', is_premium: workout.is_premium || false });
    setModalVisible(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return Alert.alert('Erro', 'Título é obrigatório');
    if (editing) {
      await supabase.from('workouts').update(form).eq('id', editing.id);
    } else {
      await supabase.from('workouts').insert(form);
    }
    setModalVisible(false);
    loadWorkouts();
  }

  async function handleDelete(id) {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await supabase.from('workouts').delete().eq('id', id); loadWorkouts(); } },
    ]);
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={typography.h5}>TREINOS ({workouts.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={20} color={COLORS.background} />
          <Text style={styles.addBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.lg }} /> : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.is_premium && <Ionicons name="lock-closed" size={14} color="#FFD600" style={{ marginLeft: 6 }} />}
                </View>
                <Text style={styles.cardMeta}>{item.category} · {item.level} · {item.duration_minutes}min</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEdit(item)}><Ionicons name="pencil" size={18} color={COLORS.primary} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}><Ionicons name="trash" size={18} color={COLORS.error} /></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={typography.h4}>{editing ? 'Editar Treino' : 'Novo Treino'}</Text>
            <TextInput style={styles.input} value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} placeholder="Título do treino" placeholderTextColor={COLORS.textMuted} />
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1 }]} value={form.category} onChangeText={(t) => setForm({ ...form, category: t })} placeholder="Categoria" placeholderTextColor={COLORS.textMuted} />
              <TextInput style={[styles.input, { flex: 1 }]} value={form.level} onChangeText={(t) => setForm({ ...form, level: t })} placeholder="Nível" placeholderTextColor={COLORS.textMuted} />
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1 }]} value={String(form.duration_minutes)} onChangeText={(t) => setForm({ ...form, duration_minutes: parseInt(t) || 0 })} placeholder="Duração (min)" keyboardType="numeric" placeholderTextColor={COLORS.textMuted} />
              <TextInput style={[styles.input, { flex: 1 }]} value={form.video_id} onChangeText={(t) => setForm({ ...form, video_id: t })} placeholder="Video ID YouTube" placeholderTextColor={COLORS.textMuted} />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Treino Premium (🔒)</Text>
              <Switch
                value={form.is_premium}
                onValueChange={(v) => setForm({ ...form, is_premium: v })}
                trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
                thumbColor={form.is_premium ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelBtnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Salvar</Text></TouchableOpacity>
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
  row: { flexDirection: 'row', gap: SPACING.sm },
  modalActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  cancelBtn: { flex: 1, padding: SPACING.md, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center' },
  cancelBtnText: { color: COLORS.textMuted, fontFamily: 'Montserrat_600SemiBold' },
  saveBtn: { flex: 1, padding: SPACING.md, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveBtnText: typography.chipActive,
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  switchLabel: { color: COLORS.textTitle, fontFamily: 'Inter_500Medium', fontSize: 14 },
});
