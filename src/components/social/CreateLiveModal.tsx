// @ts-nocheck
// src/components/social/CreateLiveModal.js
// Modal de criação de live de treino

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n';

const WORKOUT_TYPES = [
  { id: 'general', label: 'Geral', icon: 'barbell' },
  { id: 'hiit', label: 'HIIT', icon: 'flash' },
  { id: 'yoga', label: 'Yoga', icon: 'body' },
  { id: 'cardio', label: 'Cardio', icon: 'heart' },
  { id: 'strength', label: 'Força', icon: 'fitness' },
];

export default function CreateLiveModal({ visible, onClose, onCreate }) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workoutType, setWorkoutType] = useState('general');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert(t('common.error'), t('social.liveTitleError'));
      return;
    }
    setLoading(true);
    await onCreate({ title: title.trim(), description: description.trim(), workoutType, isPublic });
    setTitle('');
    setDescription('');
    setWorkoutType('general');
    setIsPublic(true);
    setLoading(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>CRIAR LIVE</Text>

          <TextInput
            style={styles.input}
            placeholder="Título da live"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Descrição (opcional)"
            placeholderTextColor={COLORS.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>TIPO DE TREINO</Text>
          <View style={styles.typeGrid}>
            {WORKOUT_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeBtn, workoutType === type.id && styles.typeActive]}
                onPress={() => setWorkoutType(type.id)}
              >
                <Ionicons name={type.icon} size={18} color={workoutType === type.id ? COLORS.background : COLORS.textMuted} />
                <Text style={[styles.typeText, workoutType === type.id && styles.typeTextActive]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Pública</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ true: COLORS.primary }} />
          </View>

          <Button title="INICIAR LIVE" onPress={handleCreate} loading={loading} disabled={!title.trim() || loading} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xl },
  input: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm, letterSpacing: 1 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  typeActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  typeTextActive: { color: COLORS.background },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  switchLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
});
