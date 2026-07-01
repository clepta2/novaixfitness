// src/components/planner/DayEditorModal.js
// Modal para editar dia do planner - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import WorkoutPicker from './WorkoutPicker';
import { DAY_NAMES_FULL, DAY_KEYS } from '../../data/weekPlan';

export default function DayEditorModal({ visible, dayKey, currentData, onSave, onClose }) {
  const [selectedWorkout, setSelectedWorkout] = useState(currentData?.isRest ? null : { id: currentData?.workoutId, title: currentData?.workoutName, category: currentData?.category, duration_minutes: currentData?.duration });

  const dayName = dayKey ? DAY_NAMES_FULL[DAY_KEYS.indexOf(dayKey)] : '';

  const handleSave = () => {
    if (!selectedWorkout) {
      onSave({ isRest: true, workoutId: null, workoutName: null, duration: 0, category: null });
    } else {
      onSave({
        isRest: false,
        workoutId: selectedWorkout.id,
        workoutName: selectedWorkout.title,
        duration: selectedWorkout.duration_minutes || 30,
        category: selectedWorkout.category,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar {dayName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <WorkoutPicker selectedId={selectedWorkout?.id} onSelect={setSelectedWorkout} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.xl, maxHeight: '70%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  saveBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
  saveText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
});
